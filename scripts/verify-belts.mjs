import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";
const data = JSON.parse(await fs.readFile("src/belt-program.json", "utf8"));
const media = JSON.parse(await fs.readFile("src/belt-media.json", "utf8"));
const outputDir = "test-results/belts";
assert.equal(media.length, 49);
assert(media.every((item) => /^[A-Za-z0-9_-]{11}$/.test(item.videoId)));
for (const name of data.flatMap((belt) => belt.throws))
  assert(
    media.some((item) => item.name.toLowerCase() === name.toLowerCase()),
    `missing primary video reference: ${name}`,
  );
assert.equal(data.length, 9);
assert.deepEqual(
  data.map((b) => b.grade),
  [
    "6 KYU",
    "5,5 KYU",
    "5 KYU",
    "4,5 KYU",
    "4 KYU",
    "3,5 KYU",
    "3 KYU",
    "2 KYU",
    "1 KYU",
  ],
);
assert.deepEqual(
  data.map((b) => b.basics.length + b.throws.length + b.ground.length),
  [14, 11, 7, 7, 8, 7, 10, 15, 11],
);
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    (process.platform === "win32"
      ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
      : undefined),
  headless: true,
});
const context = await browser.newContext({
  reducedMotion: "reduce",
  viewport: { width: 1440, height: 1000 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const base = process.env.TEST_URL || "http://127.0.0.1:5173";
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await fs.mkdir(outputDir, { recursive: true });
try {
  await page.goto(base);
  await page
    .locator(".main-nav")
    .getByRole("link", { name: "Droga po pas", exact: true })
    .click();
  await page
    .getByRole("heading", { name: /Droga po pas/ })
    .first()
    .waitFor();
  assert.equal(await page.locator(".guide-belt-nav button").count(), 10);
  await page
    .getByRole("link", { name: "Wybierz swój pas", exact: true })
    .click();
  assert(await page.locator(".guide-current").isVisible());
  assert.match(page.url(), /#\/droga-po-pas/);
  assert.equal(
    await page.locator(".guide-video-stage iframe").count(),
    0,
    "no iframe before consent/click",
  );
  const choose = (id) =>
    page
      .locator(".guide-belt-nav button")
      .nth(data.findIndex((b) => b.id === id))
      .click();
  for (const [index, belt] of data.entries()) {
    await page.locator(".guide-belt-nav button").nth(index).click();
    const names = await page
      .locator(".guide-tech-select>span")
      .evaluateAll((els) => els.map((el) => el.firstChild.textContent));
    assert.deepEqual(
      names,
      [...belt.basics, ...belt.throws, ...belt.ground],
      `complete syllabus ${belt.grade}`,
    );
    assert.match(page.url(), new RegExp(`pas=${belt.id}$`));
  }
  await choose("5-5");
  const review = page.getByRole("checkbox", {
    name: "Powtórzone: De-ashi-harai",
    exact: true,
  });
  await review.check();
  await review.focus();
  await page.keyboard.press("Space");
  assert(!(await review.isChecked()), "keyboard toggles review");
  await page.keyboard.press("Space");
  assert(await review.isChecked());
  await page.reload();
  assert(
    await page
      .getByRole("checkbox", { name: "Powtórzone: De-ashi-harai", exact: true })
      .isChecked(),
  );
  await choose("5");
  assert.equal(
    await page
      .getByRole("checkbox", { name: "Powtórzone: De-ashi-harai", exact: true })
      .count(),
    0,
  );
  await page
    .getByRole("button", { name: "Z wcześniejszymi stopniami", exact: true })
    .click();
  assert(
    await page
      .getByRole("checkbox", { name: "Powtórzone: De-ashi-harai", exact: true })
      .isChecked(),
  );
  await page.getByLabel("Szukaj techniki").fill("sasae");
  assert.equal(await page.locator(".guide-tech-select").count(), 1);
  assert.match(
    await page.locator(".guide-tech-select").innerText(),
    /Sasae-tsurikomi-ashi/,
  );
  await page.locator(".guide-tech-select").click();
  assert.match(
    await page.locator(".guide-media-caption h3").innerText(),
    /Sasae-tsurikomi-ashi/,
  );
  const playerPage = await context.newPage();
  await playerPage.goto(`${base}/#/droga-po-pas?pas=5`);
  await playerPage.getByLabel("Szukaj techniki").fill("sasae");
  await playerPage.locator(".guide-tech-select").click();
  await playerPage.route("https://www.youtube-nocookie.com/embed/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<!doctype html><title>Test player</title><p>External player boundary</p>",
    }),
  );
  await playerPage
    .getByRole("button", {
      name: "Wczytaj film Kodokan: Sasae-tsurikomi-ashi",
      exact: true,
    })
    .click();
  assert.match(
    await playerPage.locator(".guide-video-stage iframe").getAttribute("src"),
    /699i--pvYmE/,
  );
  assert(
    !/autoplay=1/.test(
      await playerPage.locator(".guide-video-stage iframe").getAttribute("src"),
    ),
  );
  await playerPage.close();
  await page.bringToFront();
  await page.getByLabel("Szukaj techniki").fill("brak takiej techniki");
  assert(
    await page.getByText("Nie ma takiej pozycji w tym zakresie.").isVisible(),
  );
  await page
    .getByRole("button", { name: "Pokaż cały wybrany materiał", exact: true })
    .click();
  await page.evaluate(() => {
    window.__beltCopied = "";
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (value) => {
          window.__beltCopied = value;
        },
      },
      configurable: true,
    });
  });
  await page
    .getByRole("button", { name: "Kopiuj link do wybranego pasa" })
    .click();
  await page.getByText("Skopiowano", { exact: true }).waitFor();
  assert.match(
    await page.evaluate(() => window.__beltCopied),
    /#\/droga-po-pas\?pas=5$/,
  );
  await page
    .getByRole("button", { name: "Wyczyść notes", exact: true })
    .click();
  assert(await page.locator(".guide-reset-dialog").isVisible());
  await page.keyboard.press("Escape");
  assert(!(await page.locator(".guide-reset-dialog").isVisible()));
  assert(
    await page
      .getByRole("button", { name: "Wyczyść notes", exact: true })
      .evaluate((el) => el === document.activeElement),
  );
  await page
    .getByRole("button", { name: "Wyczyść notes", exact: true })
    .click();
  await page.getByRole("button", { name: "Zachowaj", exact: true }).click();
  assert(
    await page
      .getByRole("checkbox", { name: "Powtórzone: De-ashi-harai", exact: true })
      .isChecked(),
  );
  await page
    .getByRole("button", { name: "Wyczyść notes", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Usuń zaznaczenia", exact: true })
    .click();
  assert(
    !(await page
      .getByRole("checkbox", { name: "Powtórzone: De-ashi-harai", exact: true })
      .isChecked()),
  );
  await choose("4");
  await page.getByRole("button", { name: "Katame-waza", exact: true }).click();
  await page
    .locator(".guide-tech-select")
    .filter({ hasText: "Hadaka-jime" })
    .click();
  assert.equal(
    await page
      .locator(".guide-video-stage iframe,.guide-video-stage img")
      .count(),
    0,
    "restricted technique has names and primary requirements only",
  );
  await page.locator(".guide-belt-nav button").last().click();
  assert.equal(await page.locator(".guide-dan-table>div").count(), 9);
  assert.match(
    await page.locator(".guide-dan-table").innerText(),
    /Koshiki-no-kata/,
  );
  await page.goto(`${base}/#/droga-po-pas?pas=1`);
  await page
    .getByRole("button", { name: "Z wcześniejszymi stopniami", exact: true })
    .click();
  const allNames = new Set(
    data.flatMap((b) => [...b.basics, ...b.throws, ...b.ground]),
  );
  assert.equal(await page.locator(".guide-tech-select").count(), allNames.size);
  await page.getByLabel("Szukaj techniki").fill("ura-nage");
  await page.emulateMedia({ media: "print" });
  assert(await page.locator(".guide-print-only").isVisible());
  assert.equal(
    await page.locator(".guide-print-only li").count(),
    allNames.size,
    "printed program is complete despite screen search filter",
  );
  await page.pdf({
    path: `${outputDir}/program-1-kyu.pdf`,
    format: "A4",
    printBackground: true,
  });
  await page.emulateMedia({ media: "screen", reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".guide-belt-stitch")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  await choose("5");
  await page.getByRole("button", { name: "Nage-waza", exact: true }).click();
  await page
    .locator(".guide-tech-select")
    .filter({ hasText: "Tai-otoshi" })
    .click();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.race([
      Promise.all([...document.images].map((i) => i.decode().catch(() => {}))),
      new Promise((r) => setTimeout(r, 5000)),
    ]);
    window.scrollTo(0, 0);
  });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow guide ${width}`,
    );
    if ([1440, 768, 390].includes(width))
      await page.screenshot({
        path: `${outputDir}/${width === 1440 ? "desktop" : width === 768 ? "tablet" : "mobile"}.png`,
        fullPage: true,
      });
    await page.locator(".guide-belt-nav button").nth(5).click();
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow half grade ${width}`,
    );
    await choose("5");
    await page.getByRole("button", { name: "Nage-waza", exact: true }).click();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .locator(".guide-tech-select")
    .filter({ hasText: "Uki-goshi" })
    .click();
  await page.waitForTimeout(150);
  assert(
    (await page.locator(".guide-media").boundingBox()).y >= -1,
    "selected material is brought into view on mobile",
  );
  await page.getByRole("link", { name: "Wróć do klubu", exact: true }).click();
  await page.locator(".main-nav").waitFor({ state: "attached" });
  assert.equal(new URL(page.url()).hash, "");
  await page.getByRole("button", { name: "Otwórz menu", exact: true }).click();
  await page
    .locator(".main-nav")
    .getByRole("link", { name: "Droga po pas", exact: true })
    .click();
  await page.locator(".guide-current").waitFor();
  assert.equal(
    await page.evaluate(() => document.body.style.overflow),
    "",
    "mobile navigation releases body scroll",
  );
  await page.goBack();
  await page.locator(".main-nav").waitFor({ state: "attached" });
  assert(
    !/Droga po pas/.test(await page.title()),
    "home title restored after browser back",
  );
  const blocked = await context.newPage();
  await blocked.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("storage blocked");
    };
  });
  await blocked.goto(`${base}/#/droga-po-pas?pas=5`);
  await blocked.getByRole("checkbox").first().check();
  assert(
    await blocked.getByText(/Przeglądarka nie zapisała zaznaczeń/).isVisible(),
  );
  await blocked.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("blocked");
        },
      },
      configurable: true,
    });
  });
  await blocked
    .getByRole("button", { name: "Kopiuj link do wybranego pasa" })
    .click();
  assert(await blocked.getByText("Skopiuj adres ręcznie").isVisible());
  assert.deepEqual(errors, []);
  await fs.writeFile(
    `${outputDir}/report.json`,
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        kyu: 9,
        techniqueNames: 73,
        uniqueRequirements: allNames.size,
        checks: [
          "routing",
          "all KYU requirements",
          "cumulative syllabus",
          "DAN kata",
          "search",
          "filters",
          "persisted notes",
          "reset confirmation",
          "video boundary without autoplay",
          "share and fallback",
          "storage fallback",
          "complete print program",
          "reduced motion",
          "mobile material selection",
          "5 widths",
          "no page errors",
        ],
        limitations: [
          "Player iframe is mocked in automated test; actual playback depends on YouTube/network",
          "No claim that notes award a grade",
        ],
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS belts: 9 KYU, 73 technique names, cumulative syllabus, DAN, filters, persistence, print, video boundary, clipboard/storage fallbacks, keyboard-ready controls, 5 widths and no errors",
  );
} catch (error) {
  await page
    .screenshot({
      path: `${outputDir}/failure-${Date.now()}.png`,
      fullPage: true,
    })
    .catch(() => {});
  console.error(
    JSON.stringify({
      url: page.url(),
      summary: await page
        .locator(".guide-review-summary")
        .innerText()
        .catch(() => null),
      bodyOverflow: await page
        .evaluate(() => document.body.style.overflow)
        .catch(() => null),
    }),
  );
  throw error;
} finally {
  await browser.close();
}
