# Weryfikacja i audyt Unslop Local

Data: 16 listopada 2026. Audyt wykonano ręcznie według zainstalowanego `.agents/skills/unslop-local/SKILL.md`, `signs.md`, `tokens.md`, `visuals.md` i referencji wizualnej. Nie używano opcjonalnego snapshot helpera, ponieważ strona jest aplikacją React. Rzeczywiste rendery wykonano w Chrome przez Playwright.

## Kierunek

- Produkt: lokalny klub judo; rodzic ma znaleźć grupę, godzinę, salę i sposób kontaktu.
- Charakter: zdyscyplinowany, odważny, rodzinny.
- Świat: dojo, mata tatami, judoga i klubowy plakat zawodów.
- Najważniejsze momenty: szeroki autentyczny kadr z sali w hero oraz fotografia najmłodszych judoków.
- Podpis: dwie czerwone kreski inspirowane oznaczeniem pasa; oryginalne logo pozostaje zachowane.

## Ustalenia i dziewięć przebiegów

1. **Odstępy:** zachowano skalę 4 px, wspólne krawędzie treści, spójne rzędy grafiku i różne proporcje sekcji. Na telefonie kolumny układają się w kolejności czytania.
2. **Kolor:** papier, czerń i klubowa czerwień. Brak poświat, gradientowych napisów i szklanych kart. Neutralna przesłona na fotografii służy czytelności tekstu.
3. **Ikony:** jeden zestaw Lucide, domyślnie 18 px / 1,5; kontrolowane wyjątki dla menu i dużych strzałek. Usunięto nieużywany import Instagram zamiast dodawać niezweryfikowany profil.
4. **Treść:** ilustracyjne nazwy grup zastąpiono prawdziwymi GR i godzinami z oficjalnego grafiku. Nie przypisano numerom grup wymyślonych przedziałów wieku. Artykuły i oferta mają dokładne linki źródłowe; wiadomości historyczne zachowują daty.
5. **Typografia:** Barlow Condensed 600 i Manrope 400/500/600, dostarczane lokalnie z pełnym zestawem polskich oraz łacińskich znaków. Wyraziste wersaliki w nagłówkach są świadomym wyjątkiem sportowej kompozycji. Po pierwszym renderze zwiększono rozmiary treści i kluczowych informacji na telefonie.
6. **Układ:** pełna fotografia dojo, asymetryczna sekcja klubu, użytkowy grafik, artykuły, plakat półkolonii, galeria i FAQ mają odrębne funkcje. Nie dodano fikcyjnych opinii ani dekoracyjnych wskaźników.
7. **Detale:** wyśrodkowano natywny dialog mimo resetu CSS, zapewniono biały fokus na czerwonej sekcji i poprawiono nagłówek mobilny. Formularz zachowuje dane podczas powrotu do edycji, resetuje stan kopiowania po zmianie wiadomości i czyści dane po zamknięciu. Fokus przechodzi do wyniku i wraca do przycisku otwierającego.
8. **Fotografie:** wybrano prawdziwe materiały Polonii, z lokalnymi kopiami i rejestrem pochodzenia. W pierwszym pełnym zrzucie część zdjęć poniżej ekranu oczekiwała na lazy loading; finalne zrzuty wykonano dopiero po załadowaniu i sprawdzeniu wszystkich obrazów.
9. **Ruch:** krótkie zmiany kolorów i stanów; brak animacji zapętlonych, parallaxu i skalowania kart. Strona respektuje `prefers-reduced-motion`.

## Wykonane kontrole

- `npm install --ignore-scripts` — pomyślnie; audyt instalacji: 0 wykrytych podatności.
- `npm run build` — pomyślnie, wraz ze ścisłą kontrolą TypeScript.
- `npm run test:e2e` — 9 grup kontroli zakończonych pomyślnie: zasoby i fonty, 4 grafiki i filtry grup, aktualności, formularz i kopiowanie, galeria i klawiatura, półkolonie/dokumenty/FAQ, responsywność, menu mobilne, konsola JavaScript.
- Sprawdzono szerokości 1440, 1024, 768, 640, 390, 360 i 320 px; brak poziomego przepełnienia.
- Obejrzano rzeczywiste zrzuty desktop 1440 px, tablet 768 px, mobile 390 px oraz dialog wiadomości. Pierwszy render i finalne zrzuty znajdują się w `design-references/`.
- Raport automatyczny: `design-references/test-report.json`.

Nie przeprowadzano audytu WCAG przez zewnętrznego specjalistę ani testów na fizycznym iPhonie/Androidzie. Interakcje sprawdzono w Chromium. Strona jest lokalnym projektem bez CMS, serwera zapisów i automatycznego wysyłania korespondencji. Warunki publikacji i pochodzenie zdjęć opisano w `research.md`.

Proces Unslop: Damir Sokolovsky, CC BY 4.0. Adaptacja Unslop Local: Dawid Zdunczyk.
