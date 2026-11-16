import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    (process.platform === "win32"
      ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
      : undefined),
  headless: true,
});
const folder = "test-results/motion";
await fs.mkdir(folder, { recursive: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(10000);
const errors = [];
const checks = [];
page.on("pageerror", (error) => errors.push(error.message));
const selected = () =>
  page.locator('.journey-tabs [aria-selected="true"]').getAttribute("id");
const marker = () => page.locator(".obi-marker").getAttribute("transform");
async function align() {
  await page.evaluate(() => {
    const el = document.querySelector(".dojo-journey");
    window.scrollTo({
      top: el.getBoundingClientRect().top + scrollY - 120,
      behavior: "instant",
    });
  });
}
async function settle() {
  await page.waitForTimeout(500);
}
try {
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:5173");
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = "eager";
    await document.fonts.ready;
    await Promise.race([
      Promise.all(
        [...document.images].map((img) => img.decode().catch(() => {})),
      ),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  });
  await align();
  assert.equal(
    await page
      .locator(".journey-panel")
      .evaluate((el) => getComputedStyle(el).position),
    "relative",
  );
  assert(
    (await page.locator(".dojo-journey").boundingBox()).height < 900,
    "no multi-screen scroll track",
  );
  assert.equal(
    await page.locator("#obi-draw-mask").count(),
    0,
    "illustration is complete without scroll revelation",
  );
  const startMarker = await marker();
  const scrollBefore = await page.evaluate(() => scrollY);
  await page.locator("#journey-tab-2").click();
  await settle();
  assert.equal(await selected(), "journey-tab-2");
  assert(
    Math.abs((await page.evaluate(() => scrollY)) - scrollBefore) <= 1,
    "selecting step does not move the page",
  );
  assert.notEqual(await marker(), startMarker, "chosen step moves the marker");
  const endMarker = await marker();
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(150);
  assert(
    (await page.evaluate(() => scrollY)) > scrollBefore + 300,
    "wheel scroll passes through section",
  );
  assert.equal(
    await selected(),
    "journey-tab-2",
    "scrolling cannot overwrite selection",
  );
  assert.equal(
    await marker(),
    endMarker,
    "scrolling cannot animate the marker",
  );
  checks.push(
    "Naturalne przewijanie: bez przypinania, sztucznej wysokości, zmiany etapu i ruchu pasa od scrolla",
  );
  await align();
  await page.locator("#journey-tab-0").focus();
  const keyboardStart = await page.evaluate(() => scrollY);
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowRight");
  await settle();
  assert.equal(await selected(), "journey-tab-1");
  assert.equal(
    await page.locator(":focus").getAttribute("id"),
    "journey-tab-1",
  );
  assert(Math.abs((await page.evaluate(() => scrollY)) - keyboardStart) <= 1);
  await page.keyboard.press("End");
  await settle();
  assert.equal(await selected(), "journey-tab-2");
  await page.keyboard.press("Home");
  await settle();
  assert.equal(await selected(), "journey-tab-0");
  checks.push(
    "Mysz i klawiatura: jawny wybór, strzałki/Home/End, zachowany fokus i pozycja strony",
  );
  await page.locator(".journey-join").click();
  assert(await page.locator("dialog.dialog").evaluate((el) => el.open));
  await page.keyboard.press("Escape");
  assert(!(await page.locator("dialog.dialog").evaluate((el) => el.open)));
  checks.push("Kontakt z sekcji otwiera formularz; Escape zamyka okno");
  await page.addStyleTag({
    content: ".header,.skip-link{visibility:hidden!important}",
  });
  for (const [width, height] of [
    [1440, 1000],
    [1024, 1000],
    [768, 1000],
    [640, 844],
    [390, 844],
    [320, 844],
    [1440, 600],
  ]) {
    await page.locator("#journey-tab-2").click();
    await settle();
    await page.setViewportSize({ width, height });
    assert.equal(await selected(), "journey-tab-2", "resize preserves choice");
    assert.equal(
      await page
        .locator(".journey-panel")
        .evaluate((el) => getComputedStyle(el).position),
      "relative",
    );
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow ${width}`,
    );
    const sizes = [];
    for (let index = 0; index < 3; index++) {
      await page.locator(`#journey-tab-${index}`).click();
      await settle();
      sizes.push((await page.locator(".dojo-journey").boundingBox()).height);
    }
    assert(
      Math.max(...sizes) - Math.min(...sizes) <= 2,
      `stable section height ${width}: ${sizes}`,
    );
    assert(Math.max(...sizes) < 1200, `no extra scroll track ${width}`);
    if ([1440, 768, 390].includes(width) && height >= 844)
      await page
        .locator(".dojo-journey")
        .screenshot({ path: `${folder}/journey-${width}.png` });
  }
  checks.push(
    "1440/1024/768/640/390/320 px i niski ekran: brak przepełnienia, stała wysokość etapów i zachowany wybór",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  const previous = await marker();
  await page.locator("#journey-tab-1").click();
  await page.evaluate(
    () =>
      new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
  assert.notEqual(await marker(), previous);
  const reducedMarker = await marker();
  await page.waitForTimeout(100);
  assert.equal(await marker(), reducedMarker);
  assert.equal(
    await page
      .locator(".dojo-journey")
      .evaluate(
        (el) =>
          el
            .getAnimations({ subtree: true })
            .filter((a) => a.playState === "running").length,
      ),
    0,
  );
  checks.push(
    "prefers-reduced-motion: natychmiastowa pozycja znacznika, bez animacji, wszystkie etapy dostępne",
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
