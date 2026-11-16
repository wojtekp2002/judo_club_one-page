import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.TEST_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const folder = "design-references/motion-review";
await fs.mkdir(folder, { recursive: true });
const checks = [];
const errors = [];

async function settle(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    await Promise.all(
      document
        .getAnimations()
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
}
async function goToProgress(page, progress) {
  await page.evaluate((progress) => {
    const section = document.querySelector(".dojo-journey");
    const top = window.innerWidth <= 640 ? 72 : 88;
    const travel = section.offsetHeight - window.innerHeight + top;
    const start = section.getBoundingClientRect().top + window.scrollY - top;
    window.scrollTo({ top: start + travel * progress, behavior: "instant" });
  }, progress);
  await settle(page);
}

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseUrl);
  await page.evaluate(async () => {
    for (const image of document.images) image.loading = "eager";
    await Promise.all(
      [...document.images].map((image) => image.decode().catch(() => {})),
    );
    await document.fonts.ready;
  });
  await settle(page);
  await page.screenshot({ path: `${folder}/hero-desktop.png` });
  await page.screenshot({ path: `${folder}/desktop-full.png`, fullPage: true });

  let previousOffset = 2;
  for (const [index, progress] of [0.03, 0.5, 0.97].entries()) {
    await goToProgress(page, progress);
    assert.equal(
      await page.locator(`#journey-tab-${index}`).getAttribute("aria-selected"),
      "true",
    );
    const offset = Number(
      await page
        .locator("#obi-draw-mask path")
        .getAttribute("stroke-dashoffset"),
    );
    assert(offset < previousOffset, "Pas odsłania się zgodnie z przewijaniem");
    previousOffset = offset;
    const clipped = await page
      .locator(".journey-sticky")
      .evaluate((element) => {
        const last = element
          .querySelector(".journey-join")
          .getBoundingClientRect();
        return last.bottom > element.getBoundingClientRect().bottom + 1;
      });
    assert(!clipped, "Cała treść historii mieści się w ekranie");
    await page.screenshot({
      path: `${folder}/journey-desktop-${index + 1}.png`,
    });
  }
  checks.push(
    "Przewijanie: 3 etapy, narastające odsłanianie pasa, cała treść w kadrze",
  );

  await page.getByRole("tab", { name: "01 Poznajmy się" }).click();
  await page.waitForFunction(
    () =>
      document.querySelector("#journey-tab-0").getAttribute("aria-selected") ===
      "true",
  );
  await page.locator("#journey-tab-0").focus();
  await page.keyboard.press("End");
  await page.waitForFunction(
    () =>
      document.querySelector("#journey-tab-2").getAttribute("aria-selected") ===
      "true",
  );
  assert.equal(
    await page.locator(":focus").getAttribute("id"),
    "journey-tab-2",
  );
  checks.push(
    "Wybór etapu myszą i klawiaturą, fokus pozostaje na wybranym kroku",
  );

  for (const [width, height] of [
    [768, 1000],
    [390, 844],
    [320, 844],
    [1440, 700],
  ]) {
    await page.setViewportSize({ width, height });
    await settle(page);
    if (height < 800) {
      assert.equal(
        await page.locator(".dojo-journey").getAttribute("data-static"),
        "true",
      );
      await page.locator("#journey-tab-1").click();
      assert.equal(
        await page.locator("#journey-tab-1").getAttribute("aria-selected"),
        "true",
      );
    } else {
      await goToProgress(page, 0.5);
      assert.equal(
        await page.locator("#journey-tab-1").getAttribute("aria-selected"),
        "true",
      );
      const bounds = await page.locator(".journey-join").boundingBox();
      assert(
        bounds.y + bounds.height <= height + 1,
        `Przycisk widoczny przy ${width}px`,
      );
    }
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    if (width === 390 || width === 768)
      await page.screenshot({ path: `${folder}/journey-${width}.png` });
    if (width === 390) {
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await settle(page);
      await page.screenshot({
        path: `${folder}/mobile-full.png`,
        fullPage: true,
      });
    }
  }
  checks.push("Historia na 768/390/320 px i ręczny wybór na niskim ekranie");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await settle(page);
  assert.equal(
    await page.locator(".dojo-journey").getAttribute("data-static"),
    "true",
  );
  assert.equal(
    await page
      .locator(".journey-sticky")
      .evaluate((element) => getComputedStyle(element).position),
    "relative",
  );
  await page.locator("#journey-tab-1").click();
  assert.equal(
    await page.locator("#journey-tab-1").getAttribute("aria-selected"),
    "true",
  );
  assert.equal(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === "running").length,
    ),
    0,
  );
  checks.push(
    "prefers-reduced-motion: bez przypinania i animacji, działające kroki",
  );
  assert.deepEqual(errors, []);
  await fs.writeFile(
    `${folder}/report.json`,
    JSON.stringify({ date: new Date().toISOString(), checks, errors }, null, 2),
  );
  for (const check of checks) console.log(`PASS ${check}`);
} finally {
  await browser.close();
}
