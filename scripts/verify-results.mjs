import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";
const data = JSON.parse(await fs.readFile("src/ijf-results.json", "utf8"));
assert.equal(data.athletes.length, 10);
for (const athlete of data.athletes) {
  assert.equal(athlete.counts.allRows, athlete.results.length);
  assert.equal(
    athlete.counts.competitionRows,
    athlete.results.filter((r) => r.kind === "competition").length,
  );
  assert.equal(
    athlete.counts.trainingRows,
    athlete.results.filter((r) => r.kind === "training").length,
  );
  assert(
    athlete.results.every(
      (r) =>
        r.sourceUrl.startsWith("https://www.ijf.org/competition/") &&
        /^\d{4}-\d{2}-\d{2}$/.test(r.date),
    ),
  );
}
assert.equal(
  data.athletes.reduce((s, a) => s + a.results.length, 0),
  219,
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
  viewport: { width: 1440, height: 1000 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:5173");
  await page.locator("#wyniki").scrollIntoViewIfNeeded();
  assert.equal(await page.locator(".archive-table tbody tr").count(), 10);
  await page.getByRole("button", { name: "Kolejne 10" }).click();
  assert.match(await page.locator(".archive-pagination").innerText(), /2 \/ 3/);
  await page.getByLabel("Rodzaj wpisu").selectOption("training");
  assert.equal(await page.locator(".archive-table tbody tr").count(), 8);
  await page.getByLabel("Rodzaj wpisu").selectOption("competition");
  await page.getByLabel("Tylko podium").check();
  assert((await page.locator(".archive-table tbody tr").count()) > 0);
  await page
    .getByRole("group", { name: "Zawodnik w archiwum" })
    .getByRole("button", { name: "Szymon Panek", exact: true })
    .click();
  assert.equal(await page.locator(".archive-table tbody tr").count(), 5);
  assert.match(await page.locator(".archive-table").innerText(), /Bez lokaty/);
  await page
    .getByLabel("Szukaj zawodów", { exact: true })
    .fill("brak takiego turnieju");
  assert(await page.getByText("Brak wpisów dla tych filtrów").isVisible());
  await page
    .getByRole("button", { name: "Wyczyść filtry", exact: true })
    .click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Eksport CSV", exact: true }).click();
  const download = await downloadPromise;
  assert.match(download.suggestedFilename(), /szymon-panek/);
  const stream = await download.createReadStream();
  let content = "";
  for await (const chunk of stream) content += chunk.toString();
  assert.match(content, /Szymon Panek/);
  assert.match(content, /Brak opublikowanej lokaty/);
  await page.getByRole("button", { name: "Udostępnij zawodnika" }).click();
  await page.getByRole("button", { name: "Link skopiowany" }).waitFor();
  assert.match(page.url(), /judoka=szymon-panek/);
  await fs.mkdir("design-references/results", { recursive: true });
  await page.addStyleTag({
    content: ".header,.skip-link{visibility:hidden!important}",
  });
  await page
    .locator("#wyniki")
    .screenshot({ path: "design-references/results/desktop.png" });
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(
      () =>
        new Promise((r) =>
          requestAnimationFrame(() => requestAnimationFrame(r)),
        ),
    );
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow ${width}`,
    );
  }
  await page
    .locator("#wyniki")
    .screenshot({ path: "design-references/results/mobile.png" });
  assert.deepEqual(errors, []);
  console.log(
    "PASS IJF dataset: 219 records / 10 athletes, filters, pagination, null ranks, CSV, share, responsive",
  );
} finally {
  await browser.close();
}
