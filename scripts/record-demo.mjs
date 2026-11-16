import fs from "node:fs/promises";
import path from "node:path";

process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve(".cache/playwright");
const { chromium } = await import("playwright");

const directory = "design-references/motion-review";
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: directory, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
const video = page.video();

async function scrollTo(target, duration) {
  await page.evaluate(
    async ({ target, duration }) => {
      const start = scrollY;
      const started = performance.now();
      await new Promise((resolve) => {
        function update(now) {
          const progress = Math.min(1, (now - started) / duration);
          const eased =
            progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          window.scrollTo({
            top: start + (target - start) * eased,
            behavior: "instant",
          });
          if (progress < 1) requestAnimationFrame(update);
          else resolve();
        }
        requestAnimationFrame(update);
      });
    },
    { target, duration },
  );
}

try {
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:5173/");
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) image.loading = "eager";
    await Promise.all(
      [...document.images].map((image) => image.decode().catch(() => {})),
    );
  });
  await page.waitForTimeout(1800);
  await scrollTo(
    await page.locator("#klub").evaluate((element) => element.offsetTop - 88),
    1500,
  );
  await page.waitForTimeout(1000);
  const journey = await page
    .locator(".dojo-journey")
    .evaluate((element) => ({
      start: element.offsetTop - 88,
      end: element.offsetTop + element.offsetHeight - innerHeight,
    }));
  await scrollTo(journey.start, 1600);
  await page.waitForTimeout(1000);
  await scrollTo(journey.end, 8500);
  await page.waitForTimeout(900);
  await scrollTo(
    await page
      .locator("#treningi")
      .evaluate((element) => element.offsetTop - 88),
    1300,
  );
  await page.waitForTimeout(700);
  await page.getByRole("tab", { name: /Nowiny/ }).click();
  await page.waitForTimeout(1000);
} finally {
  await context.close();
  await video.saveAs(`${directory}/polonia-animations.webm`);
  await browser.close();
}
