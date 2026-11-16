import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.TEST_URL || "http://127.0.0.1:5173";
const executablePath =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath, headless: true });
const errors = [];
const results = [];
await fs.mkdir("design-references", { recursive: true });

async function check(name, test) {
  await test();
  results.push(name);
  console.log(`PASS ${name}`);
}
async function loadPhotos(page) {
  await page.evaluate(async () => {
    for (const image of document.images) image.loading = "eager";
    await Promise.all(
      [...document.images].map((image) => image.decode().catch(() => {})),
    );
    await document.fonts.ready;
    await document.fonts.load('600 64px "Barlow Condensed"');
    await document.fonts.load("400 16px Manrope");
  });
}

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(baseUrl);
  await loadPhotos(page);

  await check("Wszystkie lokalne zdjęcia i fonty się ładują", async () => {
    const missing = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.src),
      );
    assert.deepEqual(missing, []);
    assert(
      await page.evaluate(() =>
        document.fonts.check('600 64px "Barlow Condensed"'),
      ),
    );
    assert(await page.evaluate(() => document.fonts.check("400 16px Manrope")));
  });

  await check(
    "4 bazy: poprawne adresy, godziny i reset filtra grupy",
    async () => {
      await page.getByRole("tab", { name: /Nowiny/ }).click();
      assert.match(
        await page.locator(".location-info").innerText(),
        /Orzepowicka 15A/,
      );
      assert.match(
        await page.locator(".schedule-rows").innerText(),
        /16:15–17:05/,
      );
      await page.getByLabel("Wybierz grupę").selectOption("GR 11");
      assert.equal(await page.locator(".schedule-row").count(), 1);
      await page.getByRole("tab", { name: /Niedobczyce/ }).click();
      assert.equal(await page.getByLabel("Wybierz grupę").inputValue(), "all");
      assert.match(
        await page.locator(".schedule-rows").innerText(),
        /16:10–17:00/,
      );
      await page.getByRole("tab", { name: /Boguszowice/ }).click();
      assert.match(
        await page.locator(".schedule-rows").innerText(),
        /18:15–19:15/,
      );
      await page.getByRole("tab", { name: /Centrum/ }).click();
      assert.equal(await page.locator(".schedule-row").count(), 8);
      await page.getByRole("tab", { name: /Centrum/ }).focus();
      await page.keyboard.press("ArrowRight");
      assert.equal(
        await page
          .getByRole("tab", { name: /Nowiny/ })
          .getAttribute("aria-selected"),
        "true",
      );
      await page.getByRole("tab", { name: /Centrum/ }).click();
    },
  );

  await check("Filtry i szczegóły aktualności", async () => {
    await page.getByRole("button", { name: "Wyniki", exact: true }).click();
    assert.equal(await page.locator(".news-card").count(), 2);
    await page
      .getByRole("button", { name: "Życie klubu", exact: true })
      .click();
    assert.equal(await page.locator(".news-card").count(), 1);
    await page.getByRole("button", { name: /Czytaj: Judo dla/ }).click();
    assert(await page.getByRole("dialog").isVisible());
    assert.match(
      await page
        .getByRole("link", { name: "Oficjalne źródło" })
        .getAttribute("href"),
      /\/news\/276\//,
    );
    await page.keyboard.press("Escape");
    assert(!(await page.getByRole("dialog").isVisible()));
    await page.getByRole("button", { name: "Wszystkie", exact: true }).click();
  });

  await check(
    "Formularz: walidacja, treść maila, kopiowanie, edycja i Escape",
    async () => {
      await page
        .getByRole("button", { name: "Przyjdź na pierwszy trening" })
        .click();
      await page.getByRole("button", { name: "Przygotuj wiadomość" }).click();
      assert(await page.getByLabel("Imię rodzica lub opiekuna").isVisible());
      await page.getByLabel("Imię rodzica lub opiekuna").fill("Anna");
      await page.getByLabel("Wiek dziecka").fill("7");
      await page.getByLabel("Telefon kontaktowy").fill("500 600 700");
      await page
        .getByLabel("Lokalizacja", { exact: true })
        .selectOption("Nowiny");
      await page.getByRole("button", { name: "Przygotuj wiadomość" }).click();
      assert.match(
        await page.getByLabel("Treść wiadomości do klubu").inputValue(),
        /Lokalizacja: Nowiny/,
      );
      assert.match(
        await page
          .getByRole("link", { name: "Otwórz pocztę" })
          .getAttribute("href"),
        /^mailto:poloniarybnik@poczta.onet.pl/,
      );
      assert.equal(
        await page.locator(":focus").innerText(),
        "Wiadomość jest gotowa",
      );
      await page.getByRole("button", { name: "Kopiuj treść" }).click();
      await page
        .getByRole("button", { name: "Skopiowano wiadomość" })
        .waitFor({ state: "visible" });
      assert(
        await page
          .getByRole("button", { name: "Skopiowano wiadomość" })
          .isVisible(),
      );
      await page.getByRole("button", { name: "Wróć do formularza" }).click();
      assert.equal(
        await page.getByLabel("Imię rodzica lub opiekuna").inputValue(),
        "Anna",
      );
      await page.getByLabel("Wiek dziecka").fill("8");
      await page.getByRole("button", { name: "Przygotuj wiadomość" }).click();
      assert(
        await page.getByRole("button", { name: "Kopiuj treść" }).isVisible(),
      );
      await page.screenshot({ path: "design-references/form-verified.png" });
      await page.keyboard.press("Escape");
      assert(!(await page.getByRole("dialog").isVisible()));
      assert.equal(
        await page.locator(":focus").innerText(),
        "Przyjdź na pierwszy trening",
      );
    },
  );

  await check(
    "Galeria: otwieranie, następne zdjęcie klawiaturą, zamknięcie",
    async () => {
      await page
        .getByRole("button", {
          name: "Otwórz zdjęcie: Julia Kowalczyk",
        })
        .click();
      await page.keyboard.press("ArrowRight");
      assert.equal(
        await page.getByRole("dialog").getAttribute("aria-labelledby"),
        "dialog-title",
      );
      assert.match(
        await page.locator(".gallery-controls").innerText(),
        /Szymon Szulik/,
      );
      await page.keyboard.press("Escape");
    },
  );

  await check("Półkolonie 2027, dokumenty i FAQ", async () => {
    await page
      .getByRole("button", { name: "Poznaj zimowe półkolonie" })
      .click();
    assert.match(
      await page.getByRole("dialog").innerText(),
      /18–22 stycznia 2027/,
    );
    assert.match(
      await page
        .getByRole("link", { name: "Pełna oferta klubu" })
        .getAttribute("href"),
      /info\/46\//,
    );
    await page.keyboard.press("Escape");
    await page
      .locator("summary")
      .filter({ hasText: "Ile kosztują zajęcia?" })
      .click();
    assert.match(await page.locator("details[open]").innerText(), /170 zł/);
    await page
      .locator("summary")
      .filter({ hasText: "Ile kosztują zajęcia?" })
      .click();
    for (const path of [
      "/documents/deklaracja-czlonkowska.pdf",
      "/documents/karta-kwalifikacyjna.doc",
    ]) {
      const response = await page.request.get(baseUrl + path);
      assert.equal(response.status(), 200);
      assert((await response.body()).length > 10000);
    }
  });

  await check(
    "Responsywność 1440, 1024, 768, 640, 390, 360 i 320 px",
    async () => {
      for (const width of [1440, 1024, 768, 640, 390, 360, 320]) {
        await page.setViewportSize({ width, height: width > 640 ? 1000 : 844 });
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: "instant" }),
        );
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
          `Poziome przepełnienie ${width}px`,
        );
        if ([1440, 768, 390].includes(width))
          await page.screenshot({
            path: `design-references/${width === 1440 ? "desktop" : width === 768 ? "tablet" : "mobile"}-verified.png`,
            fullPage: true,
          });
      }
    },
  );

  await check("Menu mobilne i nawigacja do sekcji", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Otwórz menu" }).click();
    assert.equal(
      await page
        .getByRole("button", { name: "Zamknij menu" })
        .getAttribute("aria-expanded"),
      "true",
    );
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Treningi", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("button", { name: "Otwórz menu" })
        .getAttribute("aria-expanded"),
      "false",
    );
    assert.equal(new URL(page.url()).hash, "#treningi");
  });

  await check("Brak błędów konsoli i JavaScript", async () =>
    assert.deepEqual(errors, []),
  );
  await fs.writeFile(
    "design-references/test-report.json",
    JSON.stringify(
      { date: new Date().toISOString(), baseUrl, checks: results, errors },
      null,
      2,
    ),
  );
  console.log(`\n${results.length} grup kontroli zakończonych pomyślnie.`);
} finally {
  await browser.close();
}
