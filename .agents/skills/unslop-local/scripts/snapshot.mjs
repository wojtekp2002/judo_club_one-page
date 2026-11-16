import { createRequire } from "node:module";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createAssetServer, LOCAL_CSP, readBounded, reserveOutput, restrictRequests, SNAPSHOT_CSP } from "./safety.mjs";

const usage = "usage: node snapshot.mjs <url or local file> <out.html> [pass label] [--dark | --light] [--width 1440] [--height 810] [--allow-origin https://example.com]";
const args = process.argv.slice(2);
const positionals = [];
let width = 1440;
let height = 810;
const origins = new Set();
const size = (name, value) => {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0 || n > 4096) {
    console.error(`--${name} must be a whole number above 0 and at most 4096, got "${value}"`);
    process.exit(1);
  }
  return n;
};
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  const match = /^--(width|height)(?:=(.*))?$/.exec(arg);
  if (match) {
    const value = match[2] ?? args[++i];
    if (value === undefined || value.startsWith("--")) {
      console.error(`--${match[1]} needs a value, like --${match[1]} 1440`);
      process.exit(1);
    }
    if (match[1] === "width") width = size("width", value);
    else height = size("height", value);
  } else if (arg === "--allow-origin" || arg.startsWith("--allow-origin=")) {
    const value = arg.includes("=") ? arg.slice(arg.indexOf("=") + 1) : args[++i];
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password || parsed.href !== `${parsed.origin}/`) throw new Error("--allow-origin requires an exact HTTP(S) origin, without credentials or a path");
    origins.add(parsed.origin);
  } else if (["--dark", "--light"].includes(arg)) {
    // Handled below.
  } else if (!arg.startsWith("--")) {
    positionals.push(arg);
  } else {
    throw new Error(`Unknown option: ${arg}`);
  }
}
const [url, out, label] = positionals;
const scheme = args.includes("--dark") ? "dark" : args.includes("--light") ? "light" : "no-preference";
if (!url || !out) {
  console.error(usage);
  process.exit(1);
}
// A path on disk is a page too: a bare file path is not a URL, and
// Playwright rejects it with a protocol error, so turn it into one.
let target;
let localServer;
const local = url.startsWith("file:") ? fileURLToPath(url) : statSync(url, { throwIfNoEntry: false })?.isFile() ? resolve(url) : null;
if (local) {
  target = null; // Start the loopback server inside the cleanup scope below.
} else {
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password || !origins.has(parsed.origin)) throw new Error("Remote snapshots require --allow-origin with the exact HTTP(S) origin. Page scripts stay disabled.");
  target = parsed.href;
}
if (!/\.html?$/i.test(out)) throw new Error("Output must have an .html or .htm extension");
const screenshotPath = resolve(out).replace(/\.html?$/i, "") + ".live.png";
if (existsSync(resolve(out)) || existsSync(screenshotPath)) throw new Error("Output already exists; choose a new output name");

async function browserKit() {
  for (const name of ["playwright", "playwright-core"]) {
    try {
      return await import(name);
    } catch {}
    try {
      return createRequire(join(process.cwd(), "package.json"))(name);
    } catch {}
  }
  throw new Error("Playwright is not installed. In your project, run `npm install -D playwright@1.58.2` followed by `npx playwright install chromium`.");
}

const chrome = [process.env.CHROME_PATH, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((path) => path && existsSync(path));
let browser;
try {
  const { chromium } = await browserKit();
  if (local) {
    localServer = await createAssetServer({ root: dirname(local), prefix: "/", documents: new Map([["/__snapshot.html", { html: (await readBounded(local)).toString("utf8"), csp: LOCAL_CSP.replace("connect-src 'none'", "connect-src 'self'") }]]) });
    target = `${localServer.base}/__snapshot.html`;
    origins.add(localServer.base);
  }
  browser = await chromium.launch(chrome ? { executablePath: chrome } : {});
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: scheme, serviceWorkers: "block", acceptDownloads: false });
  await restrictRequests(context, origins);
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  page.setDefaultNavigationTimeout(15_000);
  await page.goto(target, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  await page.evaluate(async () => {
    const pause = (ms) => new Promise((done) => setTimeout(done, ms));
    const root = document.scrollingElement || document.documentElement;
    let last = root.scrollHeight;
    for (let step = 0; step < 30 && root.scrollTop < 20_000; step++) {
      window.scrollBy(0, window.innerHeight);
      await pause(150);
      const grown = root.scrollHeight;
      if (grown <= last && root.scrollTop + window.innerHeight >= grown) break;
      last = grown;
    }
    window.scrollTo(0, 0);
    const loaded = (image) =>
      new Promise((done) => {
        image.addEventListener("load", done, { once: true });
        image.addEventListener("error", done, { once: true });
      });
    const pending = [...document.images].filter((image) => !image.complete);
    await Promise.race([Promise.all(pending.map(loaded)), pause(5000)]);
  });
  const html = await page.evaluate(async ([label, scheme, csp]) => {
    const LIMIT = 3_000_000;
    let remaining = 16_000_000;
    let resources = 0;
    const boundedFetch = async (href) => {
      if (++resources > 64) throw new Error("Resource limit exceeded");
      const response = await fetch(href, { signal: AbortSignal.timeout(5000), credentials: "omit" });
      if (!response.ok || !response.body) throw new Error("Resource unavailable");
      const reader = response.body.getReader();
      const chunks = []; let size = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.length; remaining -= value.length;
          if (size > LIMIT || remaining < 0) throw new Error("Resource size limit exceeded");
          chunks.push(value);
        }
      } finally { await reader.cancel().catch(() => {}); }
      return new Blob(chunks, { type: response.headers.get("content-type") || "application/octet-stream" });
    };
    const absolute = (value, base = location.href) => {
      try {
        return new URL(value, base).href;
      } catch {
        return value;
      }
    };
    const inlined = new Map();
    const inline = async (href) => {
      if (!href || href.startsWith("data:")) return href;
      if (!inlined.has(href)) {
        inlined.set(
          href,
          boundedFetch(href)
            .then((blob) =>
              blob && blob.size < LIMIT
                ? new Promise((done) => {
                    const reader = new FileReader();
                    reader.onload = () => done(reader.result);
                    reader.readAsDataURL(blob);
                  })
                : "",
            )
            .catch(() => ""),
        );
      }
      return inlined.get(href);
    };
    const urls = async (css, base) => {
      const found = [...css.matchAll(/url\((['"]?)(?!data:)([^)'"]+)\1\)/g)];
      let result = css;
      for (const [whole, , value] of found) {
        if (/^(#|%23)/.test(value.trim())) continue;
        const data = await inline(absolute(value.trim(), base));
        result = result.split(whole).join(`url("${data}")`);
      }
      return result;
    };

    const css = [];
    const flattenSheet = async (sheet, depth = 0, ancestors = new Set()) => {
      if (!sheet || depth > 4 || ancestors.has(sheet)) return "";
      const seen = new Set(ancestors).add(sheet);
      const base = sheet.href || location.href;
      try {
        const text = [];
        for (const rule of sheet.cssRules) {
          if (rule.type === CSSRule.IMPORT_RULE) {
            let imported = await flattenSheet(rule.styleSheet, depth + 1, seen);
            if (rule.media?.mediaText) imported = `@media ${rule.media.mediaText} {${imported}}`;
            if (rule.supportsText) imported = `@supports (${rule.supportsText}) {${imported}}`;
            if (rule.layerName !== undefined && rule.layerName !== null) imported = `@layer ${rule.layerName} {${imported}}`;
            text.push(imported);
          } else text.push(await urls(rule.cssText, base));
        }
        return text.join("\n");
      } catch {
        // Cross-origin CSSOM can be inaccessible even when its fetch is
        // authorized. Keep ordinary declarations; imports need an accessible
        // static export rather than a live URL in the offline document.
        const text = sheet.href ? await boundedFetch(sheet.href).then((blob) => blob.text()).catch(() => "") : sheet.ownerNode?.textContent || "";
        return urls(text.replace(/@import\s+(?:url\([^)]*\)|"[^"]*"|'[^']*')[^;]*;/gi, ""), base);
      }
    };
    for (const sheet of document.styleSheets) {
      const text = await flattenSheet(sheet);
      const media = sheet.media && sheet.media.mediaText;
      css.push(media && media !== "all" ? `@media ${media} {\n${text}\n}` : text);
    }

    const copy = document.documentElement.cloneNode(true);
    // Freeze the browser's selected image before removing responsive markup.
    const images = document.querySelectorAll("img");
    copy.querySelectorAll("img").forEach((node, index) => {
      const selected = images[index].currentSrc;
      if (selected) node.setAttribute("src", selected);
    });
    // Serialize only static HTML/SVG. Remove whole foreign/active subtrees,
    // including template content and nested browsing contexts.
    copy.querySelectorAll("script, noscript, link, style, base, meta[http-equiv], iframe, frame, frameset, object, embed, portal, template, foreignObject, animate, animateMotion, animateTransform, set").forEach((node) => node.remove());
    for (const node of [copy, ...copy.querySelectorAll("*")]) {
      if (!["http://www.w3.org/1999/xhtml", "http://www.w3.org/2000/svg"].includes(node.namespaceURI)) { node.remove(); continue; }
      if (node.localName.includes("-")) { node.replaceWith(...node.childNodes); continue; }
      for (const attr of [...node.attributes]) {
        const name = attr.name.toLowerCase();
        if (name.startsWith("on") || ["srcdoc", "action", "formaction", "ping", "nonce", "integrity", "is", "autofocus", "autoplay", "background", "manifest", "codebase", "archive"].includes(name)) node.removeAttributeNode(attr);
      }
      if (["input", "textarea", "select", "button"].includes(node.localName)) node.setAttribute("disabled", "");
    }
    copy.querySelectorAll("[srcset]").forEach((node) => node.removeAttribute("srcset"));
    copy.querySelectorAll("source").forEach((node) => node.remove());
    copy.querySelectorAll("[loading]").forEach((node) => node.removeAttribute("loading"));
    for (const node of copy.querySelectorAll("img[src], video[poster], image")) {
      const attr = node.tagName === "VIDEO" ? "poster" : node.tagName.toLowerCase() === "image" ? "href" : "src";
      const value = node.getAttribute(attr);
      if (value) node.setAttribute(attr, await inline(absolute(value)));
    }
    for (const node of [copy, ...copy.querySelectorAll("*")]) {
      for (const attr of [...node.attributes]) {
        if (!["href", "xlink:href", "src", "poster", "data"].includes(attr.name.toLowerCase())) continue;
        const value = attr.value.trim();
        const image = ["img", "image"].includes(node.localName);
        const fragment = value.startsWith("#");
        const safeImage = image && /^data:image\/(?:png|jpeg|gif|webp|avif|svg\+xml)[;,]/i.test(value);
        if (node.localName === "a" && attr.name === "href" && /^https?:/i.test(absolute(value))) {
          node.setAttribute("href", absolute(value)); node.setAttribute("rel", "noopener noreferrer");
        } else if (!fragment && !safeImage) node.removeAttributeNode(attr);
      }
    }
    for (const node of copy.querySelectorAll("[style*='url(']")) {
      node.setAttribute("style", await urls(node.getAttribute("style"), location.href));
    }
    const style = document.createElement("style");
    let text = css.join("\n");
    if (scheme === "dark" || scheme === "light") {
      const other = scheme === "dark" ? "light" : "dark";
      text = text
        .replace(new RegExp(`prefers-color-scheme\\s*:\\s*${scheme}`, "g"), "min-width: 0px")
        .replace(new RegExp(`prefers-color-scheme\\s*:\\s*${other}`, "g"), "max-width: 0px");
      const meta = document.createElement("meta");
      meta.name = "color-scheme";
      meta.content = scheme;
      copy.querySelector("head").prepend(meta);
    }
    // Raw-text HTML serialization must not create a closing style tag.
    style.textContent = text.replace(/<\/style/gi, "<\\/style");
    copy.querySelector("head").appendChild(style);
    if (label) {
      const meta = document.createElement("meta");
      meta.name = "unslop-pass";
      meta.content = label;
      copy.querySelector("head").prepend(meta);
    }
    const policy = document.createElement("meta");
    policy.httpEquiv = "Content-Security-Policy";
    policy.content = csp;
    copy.querySelector("head").prepend(policy);
    return "<!doctype html>\n" + copy.outerHTML;
  }, [label ?? "", scheme, SNAPSHOT_CSP]);
  if (Buffer.byteLength(html) > 32_000_000) throw new Error("Snapshot exceeds 32 MB");
  mkdirSync(dirname(resolve(out)), { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  const screenshot = await page.screenshot();
  const htmlFile = await reserveOutput(resolve(out));
  try {
    const pngFile = await reserveOutput(screenshotPath);
    try { await htmlFile.writeFile(html); await pngFile.writeFile(screenshot); }
    finally { await pngFile.close(); }
  } finally { await htmlFile.close(); }
  console.log(`saved ${resolve(out)}${label ? ` as ${label}` : ""}`);
} finally {
  await browser?.close();
  await new Promise((done) => localServer ? localServer.server.close(done) : done());
}
