import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
await fs.mkdir("design-references/people", { recursive: true });
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
  await page.getByRole("tab", { name: /02 Dawid Szulik/ }).click();
  assert.match(await page.locator(".athlete-panel").innerText(), /Skopje/);
  assert.match(
    await page.locator(".athlete-source a").first().getAttribute("href"),
    /54183/,
  );
  await page
    .getByRole("button", { name: "Wszystkie", exact: true })
    .last()
    .click();
  assert.equal(await page.locator(".athlete-results li").count(), 4);
  await page.getByRole("tab", { name: /03 Julia Kowalczyk/ }).click();
  assert.match(await page.locator(".athlete-panel").innerText(), /Tallinn/);
  await page
    .getByRole("button", { name: "Następne zdjęcie zawodnika" })
    .click();
  await page
    .getByRole("button", { name: "Powiększ zdjęcie: Julia Kowalczyk" })
    .click();
  assert(await page.locator(".people-photo-dialog").isVisible());
  await page.keyboard.press("Escape");
  await page.getByLabel("Szukaj trenera").fill("kuska");
  assert.equal(await page.locator(".coach-card").count(), 1);
  assert.match(await page.locator(".coach-grid").innerText(), /Ariel Kuśka/);
  await page.getByLabel("Szukaj trenera").fill("xyz");
  assert(await page.getByText("Nie znaleziono takiej osoby").isVisible());
  await page.getByRole("button", { name: "Pokaż całą kadrę" }).click();
  assert.equal(await page.locator(".coach-card").count(), 8);
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow ${width}`,
    );
  }
  await page.addStyleTag({content: ".header,.skip-link{visibility:hidden!important}"});
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .locator("#zawodnicy")
    .screenshot({ path: "design-references/people/athletes-desktop.png" });
  await page
    .locator("#kadra")
    .screenshot({ path: "design-references/people/coaches-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .locator("#zawodnicy")
    .screenshot({ path: "design-references/people/athletes-mobile.png" });
  assert.deepEqual(errors, []);
  console.log(
    "PASS profile, wyniki, zdjęcia, modal, 8 trenerów, wyszukiwanie, 5 szerokości, brak błędów",
  );
} finally {
  await browser.close();
}
