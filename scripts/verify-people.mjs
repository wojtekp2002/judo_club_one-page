import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";
const data = JSON.parse(await fs.readFile("src/ijf-results.json", "utf8"));
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    (process.platform === "win32"
      ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
      : undefined),
  headless: true,
});
await fs.mkdir("design-references/profiles", { recursive: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:5173");
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = "eager";
    await Promise.all(
      [...document.images].map((img) => img.decode().catch(() => {})),
    );
    await document.fonts.ready;
  });
  const tabs = page
    .getByRole("tablist", { name: "Wybierz zawodnika" })
    .getByRole("tab");
  assert.equal(await tabs.count(), 10);
  assert.match(
    await page.locator(".athlete-results li").first().innerText(),
    /Zagreb World Championships Cadets Individuals 2023/,
  );
  for (const [index, athlete] of data.athletes.entries()) {
    await tabs.nth(index).click();
    await page
      .getByRole("group", { name: "Okres wyników" })
      .getByRole("button", { name: "Wszystkie", exact: true })
      .click();
    const expected = athlete.results
      .filter((r) => r.kind === "competition")
      .sort((a, b) => b.date.localeCompare(a.date));
    const seen = [];
    assert.equal(
      await page.locator(".archive-cta").getAttribute("href"),
      `?judoka=${athlete.id}#wyniki`,
    );
    while (true) {
      seen.push(
        ...(await page
          .locator(".profile-result-source")
          .evaluateAll((links) => links.map((a) => a.href))),
      );
      const next = page
        .locator(".profile-result-pages")
        .getByRole("button", { name: "Kolejne", exact: true });
      if (!(await next.count()) || (await next.isDisabled())) break;
      await next.click();
    }
    assert.deepEqual(
      seen,
      expected.map((r) => r.sourceUrl),
      `complete results: ${athlete.name}`,
    );
    assert.match(
      await page.locator(".athlete-source a").first().getAttribute("href"),
      new RegExp(String(athlete.ijfId)),
    );
  }
  await tabs.nth(1).click();
  await page
    .getByRole("group", { name: "Okres wyników" })
    .getByRole("button", { name: "2026", exact: true })
    .click();
  assert.match(await page.locator(".athlete-results").innerText(), /Skopje/);
  assert.match(await page.locator(".athlete-results").innerText(), /udział/);
  await tabs.nth(2).click();
  assert.match(
    await page.locator(".athlete-results li").first().innerText(),
    /World Championships Senior 2019/,
  );
  await page
    .getByRole("button", { name: "Następne zdjęcie zawodnika" })
    .click();
  await page
    .getByRole("button", { name: "Powiększ zdjęcie: Julia Kowalczyk" })
    .click();
  assert(await page.locator(".people-photo-dialog").isVisible());
  await page.keyboard.press("Escape");
  assert(
    await page
      .getByRole("button", { name: "Powiększ zdjęcie: Julia Kowalczyk" })
      .evaluate((el) => el === document.activeElement),
  );
  await tabs.nth(2).focus();
  await page.keyboard.press("End");
  assert.equal(await tabs.last().getAttribute("aria-selected"), "true");
  assert(await page.locator(".profile-photo-missing").isVisible());
  await page.keyboard.press("Home");
  assert.equal(await tabs.first().getAttribute("aria-selected"), "true");
  await page.getByLabel("Szukaj trenera").fill("kuska");
  assert.equal(await page.locator(".coach-card").count(), 1);
  assert.match(await page.locator(".coach-grid").innerText(), /Ariel Kuśka/);
  await page.getByLabel("Szukaj trenera").fill("xyz");
  assert(await page.getByText("Nie znaleziono takiej osoby").isVisible());
  await page.getByRole("button", { name: "Pokaż całą kadrę" }).click();
  assert.equal(await page.locator(".coach-card").count(), 8);
  await page.addStyleTag({
    content: ".header,.skip-link{visibility:hidden!important}",
  });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const index of [0, 2, 8]) {
      await tabs.nth(index).click();
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `overflow ${width}/${index}`,
      );
    }
    await tabs.first().click();
    await page
      .locator("#zawodnicy")
      .screenshot({ path: `design-references/profiles/szymon-${width}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await tabs.nth(2).click();
  await page
    .locator("#zawodnicy")
    .screenshot({ path: "design-references/profiles/julia-1440.png" });
  assert.deepEqual(errors, []);
  console.log(
    "PASS 10 profiles: all 182 competition records reachable, major medals, year filter, null ranks, photos, keyboard, coaches, 5 widths, no page errors",
  );
} finally {
  await browser.close();
}
