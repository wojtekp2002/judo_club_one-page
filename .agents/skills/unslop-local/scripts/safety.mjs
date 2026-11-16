import { createServer } from "node:http";
import { constants } from "node:fs";
import { open, realpath } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";

export const MAX_FILE_BYTES = 8 * 1024 * 1024;
export const SNAPSHOT_CSP = "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; frame-src 'none'; object-src 'none'; connect-src 'none'; base-uri 'none'; form-action 'none'";
export const LOCAL_CSP = "default-src 'none'; script-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; frame-src 'none'; object-src 'none'; connect-src 'none'; base-uri 'none'; form-action 'none'";
const types = new Map(Object.entries({ ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff" }));

export function isWithin(root, target) {
  const path = relative(root, target);
  return path === "" || (!isAbsolute(path) && path !== ".." && !path.startsWith(`..${sep}`));
}

// Never overwrite existing files (including symlinks). Callers own only the
// file descriptor returned by this exclusive create, not its parent directory.
export async function reserveOutput(path) {
  return open(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
}

export async function readBounded(path) {
  const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > MAX_FILE_BYTES) throw new Error("Expected a regular file of at most 8 MiB");
    // A bounded read also limits files which grow after fstat.
    const bytes = Buffer.alloc(MAX_FILE_BYTES + 1);
    let used = 0;
    while (used < bytes.length) {
      const { bytesRead } = await handle.read(bytes, used, bytes.length - used, null);
      if (!bytesRead) break;
      used += bytesRead;
    }
    if (used > MAX_FILE_BYTES) throw new Error("File exceeds 8 MiB");
    return bytes.subarray(0, used);
  } finally {
    await handle.close();
  }
}

// Documents are explicit in-memory routes. Other requests can only read static
// assets under the real root; HTML, JS, JSON, dotfiles and directories are denied.
export async function createAssetServer({ root, prefix = "/__story/", documents = new Map() }) {
  root = await realpath(root);
  const server = createServer(async (request, response) => {
    const finish = (status) => { response.writeHead(status); response.end(); };
    try {
      if (request.method !== "GET" && request.method !== "HEAD") return finish(405);
      const path = decodeURIComponent(request.url.split("?")[0]);
      if (path.includes("\\") || path.includes("\0") || path.split("/").some((part) => part === "." || part === "..")) return finish(403);
      response.setHeader("X-Content-Type-Options", "nosniff");
      response.setHeader("Referrer-Policy", "no-referrer");
      response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
      response.setHeader("Cache-Control", "no-store");
      const document = documents.get(path);
      if (document) {
        response.setHeader("Content-Security-Policy", document.csp ?? LOCAL_CSP);
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        return response.end(request.method === "HEAD" ? undefined : document.html);
      }
      if (!path.startsWith(prefix)) return finish(404);
      const name = path.slice(prefix.length);
      if (name.split("/").some((part) => part.startsWith("."))) return finish(403);
      const type = types.get(extname(name).toLowerCase());
      if (!type) return finish(403);
      const target = await realpath(resolve(root, name));
      if (!isWithin(root, target)) return finish(403);
      const bytes = await readBounded(target);
      response.setHeader("Content-Security-Policy", LOCAL_CSP);
      response.setHeader("Content-Type", type);
      response.end(request.method === "HEAD" ? undefined : bytes);
    } catch (error) {
      if (response.headersSent) return response.destroy();
      finish(error instanceof URIError ? 400 : error.code === "ENOENT" ? 404 : 403);
    }
  });
  await new Promise((done, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", done); });
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}

export async function restrictRequests(context, origins, { allowFrames = false } = {}) {
  let requests = 0;
  let remaining = 32 * 1024 * 1024;
  await context.route("**/*", async (route) => {
    const request = route.request();
    let url;
    try { url = new URL(request.url()); } catch { return route.abort(); }
    if (++requests > 128 || !["http:", "https:"].includes(url.protocol) || !origins.has(url.origin) || request.method() !== "GET" || request.resourceType() === "script") return route.abort();
    // Do not use route.continue(): Chromium can follow redirect hops which
    // Playwright does not route again. Fetch once with redirects disabled and
    // bounded streaming, then give the vetted response to the browser.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(url, { method: "GET", redirect: "error", signal: controller.signal });
      if (!response.body) return route.fulfill({ status: response.status, body: "" });
      const chunks = []; let bytes = 0;
      for await (const chunk of response.body) {
        bytes += chunk.length; remaining -= chunk.length;
        if (bytes > MAX_FILE_BYTES || remaining < 0) { controller.abort(); throw new Error("Network resource budget exceeded"); }
        chunks.push(chunk);
      }
      const headers = Object.fromEntries([...response.headers].filter(([name]) => !["content-encoding", "content-length", "transfer-encoding", "connection", "set-cookie"].includes(name)));
      const policy = `script-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'${allowFrames ? "" : "; frame-src 'none'"}`;
      headers["content-security-policy"] = headers["content-security-policy"] ? `${headers["content-security-policy"]}, ${policy}` : policy;
      await route.fulfill({ status: response.status, headers, body: Buffer.concat(chunks) });
    } catch { await route.abort().catch(() => {}); }
    finally { clearTimeout(timer); }
  });
  await context.routeWebSocket("**/*", (socket) => socket.close());
}
