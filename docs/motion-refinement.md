# Drugi audyt i rozwinięcie ruchu — 16.11.2026

> Dokument historyczny. Na późniejszą prośbę użytkownika zastąpiono sterowanie przewijaniem ręcznym wyborem trzech kroków, bez przypinania i sztucznej wysokości. Obecny wariant i jego kontrolę opisuje [Swobodne przewijanie](motion-controls.md). Poniższe wyniki i nagranie dotyczą wcześniejszej implementacji.

## Film referencyjny

Przeanalizowano dostarczony film 1440×900, 46,48 s. Kontaktowe arkusze klatek zapisano w `design-references/motion-reference/`.

Najważniejsza obserwacja: w okolicach 6–14 sekundy film pokazuje przypięty fragment opowieści. Przewijanie rysuje ścieżkę i aktualizuje trzy etapy. Dobrze działają też spokojna typografia użytkowa, oszczędny akcent oraz przejścia związane z treścią. Późniejszy formularz jest przykładem wieloetapowej interakcji, ale nie był potrzebny do obecnego zakresu strony klubu.

Adaptowano zasadę łączenia ruchu i narracji, bez kopiowania gór, ścieżki, kolorów ani treści innej marki. Autorski odpowiednik to płaski, szyty pas obi z czerwonym znacznikiem i trzema krokami przed pierwszym treningiem. To ilustracja dołączenia do klubu, a nie skala stopni ani instrukcja wiązania pasa.

## Audyt: konkretne problemy

- Powtarzający się plakatowy ton prawie wszystkich tytułów, mimo różnych zadań sekcji.
- Ogólne hasła: „Małe kroki. Wielka droga”, „Twój pierwszy ruch”, „Pierwszy ruch należy do Ciebie”.
- Standardowy rząd trzech dużych liczb pod hero; fakty były prawdziwe, ale kompozycja szablonowa.
- Trzy identyczne karty aktualności, każda z takim samym kwadratem i strzałką.
- Zbyt częste powtórzenie tego samego zdjęcia dojo i fotografii dzieci.
- Dekoracyjne obrócenie plakatu półkolonii.
- Brak charakterystycznej interakcji poza podstawowymi filtrami i modalami.

Ocena: lekka korekta systemu i mocniejsze rozwinięcie charakteru. Zachowano oryginalne logo, barwy, fonty, zweryfikowaną treść i działające funkcje.

## Dziewięć przebiegów Unslop

1. **Odstępy:** rząd liczb zastąpiono informacją o dzielnicach i przejściem do grafiku; aktualności mają różną gęstość. Dostosowano układ telefonu, w tym jednokolumnowe FAQ.
2. **Kolor:** utrzymano papier, czerń i klubową czerwień. W nowej ilustracji bogatsza forma pozostaje zamknięta w jednym momencie. Bez poświat i nowych gradientów.
3. **Ikony:** usunięto powtarzalne kwadraty ze strzałkami na każdym zdjęciu aktualności. Lucide pozostał jedynym zestawem.
4. **Treść:** hero „Judo po rybnicku”; dalsze nagłówki nazywają treść: sale, klubowy dziennik, ferie, ludzie i pierwszy trening. Sekwencja obi odpowiada na konkretne pytania rodzica.
5. **Typografia:** mocna Barlow Condensed w hero i plakacie, spokojny Manrope w nagłówkach użytkowych. Zwiększono część etykiet i informacji pomocniczych.
6. **Układ:** większy materiał i dwie krótkie historie w aktualnościach; portrety zamiast ponownego szerokiego zdjęcia sali. Kolejność dotychczasowych funkcji zachowana; nowa opowieść prowadzi do grafiku.
7. **Detale:** wyprostowano plakat, wyrównano stany i obszary dotyku. Trzy kroki obsługują mysz, dotyk, strzałki, Home i End. Fokus jest widoczny.
8. **Materiały:** oryginalna ilustracja SVG z krawędziami przeszyć, etykietą i węzłem. Portrety Julii Kowalczyk, Szymona Szulika i Dawida Szulika pochodzą z już zweryfikowanych materiałów klubu. Nie dodano fikcyjnych fotografii.
9. **Ruch:** jednorazowe odsłanianie liter hero i fotografii, przypięta narracja pasa, krótkie przejścia grafiku, filtrów, menu i dialogu, linia postępu czytania w nagłówku. Bez zapętlonej dekoracji, przechwytywania kółka myszy, blokowania gestów i nowej biblioteki animacyjnej.

## Weryfikacja

- `npm run build`: pomyślnie, łącznie z kontrolą TypeScript.
- `npm run test:e2e`: 9 grup kontroli pomyślnie; zachowane funkcje, dokumenty, brak błędów konsoli i poziomego przepełnienia na 320–1440 px.
- `npm run test:motion`: 4 grupy kontroli pomyślnie. Zweryfikowano trzy etapy przewijania, narastanie maski SVG, wybór myszą i klawiaturą, widoczność końca treści, 768/390/320 px i niski ekran.
- `prefers-reduced-motion`: brak przypinania i animacji; kroki pozostają dostępne ręcznie. Na niskich ekranach ten sam układ ręczny pozwala uniknąć uciętej treści.
- Obejrzano rendery desktop, tablet, telefon, trzy stany opowieści i klatki nagrania. Duża czarna przestrzeń na pełnostronicowym zrzucie to dystans przewijania przypiętej historii — rzeczywisty widok widać na osobnych zrzutach `journey-*.png` i filmie.
- Nagranie działającej strony: `design-references/motion-review/polonia-animations.mp4` (21,48 s). Raport ruchu: `design-references/motion-review/report.json`.

Pliki implementacji: `src/DojoJourney.tsx`, `src/usePageMotion.ts`, `src/experience.css`. Bazowe funkcje pozostają w `App.tsx`. Fonty i animacje działają bez zewnętrznego CDN.

Proces Unslop: Damir Sokolovsky, CC BY 4.0; adaptacja Unslop Local: Dawid Zdunczyk.
