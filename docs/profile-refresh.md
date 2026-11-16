# Profile zawodników — 16.11.2026

## Pięć decyzji

1. Produkt: profile prowadzące od nazwiska do całej publicznej historii startów IJF.
2. Charakter: sportowy, rzeczowy, lokalny.
3. Świat: autentyczne fotografie z zawodów i redakcyjna lista wyników.
4. Momenty: duże zdjęcie zawodnika oraz pierwszoplanowy tytuł/medal jego kariery.
5. Znak rozpoznawczy: numerowany klubowy spis nazwisk i czerwone podkreślenie aktywnego wyboru.

## Audyt i zmiany

- Odstępy i układ: spis dziesięciu nazwisk ma pięć kolumn na szerokim ekranie, trzy na tablecie i dwie na telefonie. Wyniki mają osobną paginację po osiem rekordów. Usunięto przypinanie zdjęcia, które przy długim profilu dawało przypadkową pustą przestrzeń.
- Kolor i ikony: zachowano ciemne neutralne tło, czerwień aktywnego nazwiska i Lucide. Złoty akcent występuje wyłącznie przy wyróżnieniu osiągnięcia i pierwszej lokacie.
- Treść: stare cztery ręcznie przepisane wyniki zastąpiono pełnymi danymi IJF; osobne widoki to „Najważniejsze”, „2026” i „Wszystkie”. Najważniejsze obejmują wszystkie opublikowane medale i miejsca olimpijskie w pierwszej siódemce, uporządkowane według rangi zawodów. Przy braku lokat pokazywane są ostatnie uczestnictwa z wyjaśnieniem zakresu.
- Typografia: zachowano Manrope i Barlow Condensed. Tytuł kariery jest spokojniejszy od nazwiska na zdjęciu.
- Detale: każdy start ma bezpośrednie źródło. Odnośnik do archiwum otwiera wybranego zawodnika. Home/End i strzałki obejmują wszystkie osoby.
- Fotografie: prowadząca trójka ma zdjęcia wydarzeń zamiast niedatowanych plakatowych portretów; Wiktoria ma kadr z OOM 2025. Pozostałe dostępne portrety pochodzą z serwera klubu. Konrad i Paweł mają inicjały i jawny brak portretu, bez zastępowania go cudzym wizerunkiem. Stan i prawa źródeł: [rejestr fotografii](athlete-photo-refresh.md).
- Ruch: zachowano krótkie przejście po wyborze zawodnika i obsługę `prefers-reduced-motion`.

## Zakres

10 profili: Szymon Szulik, Dawid Szulik, Julia Kowalczyk, Szymon Panek, Patryk Żemła, Wiktoria Mołdrzyk, Igor Gabriel, Adrian Stefański, Konrad Liszka i Paweł Marek. Źródło wyników profili oraz archiwum jest wspólne: `src/ijf-results.json`. Konrad i Paweł zostali dodani po potwierdzeniu aktualnej przynależności w PZ Judo. Pozostała ósemka wynika z oficjalnej listy klubu, której data aktualizacji nie jest podana.

219 wpisów IJF obejmuje 182 zawody i 37 wydarzeń treningowych. To pełna historia publicznie zwrócona przez IJF w dniu odczytu, bez krajowych turniejów nieobecnych w tym źródle. Nie jest automatycznie aktualizowana.

## Weryfikacja

- `npm run build` — TypeScript i produkcyjny build.
- `npm run test:people` — porównanie wszystkich 182 widocznych startów z danymi dla dziesięciu profili, przejście przez każdą stronę wyników, najważniejsze medale, 2026, puste lokaty, fotografie, dialog, fokus i klawiatura, wyszukiwanie trenerów, brak błędów strony, szerokości 1440/1024/768/390/320.
- `npm run test:results` — integralność 219 rekordów, filtry, paginacja, CSV, udostępnianie, puste lokaty i responsywność archiwum.
- `npm run test:e2e` — dziewięć grup kontroli całej strony, siedem szerokości od 1440 do 320 px, menu, formularz, dokumenty, galerie i konsola.
- `npm run test:motion` — przewijana narracja obi, sterowanie i ograniczenie ruchu.

Rzeczywiste zrzuty profili znajdują się w `design-references/profiles`. Obejrzano komputer, tablet i telefon. Lokalne testy używają Chrome w Windows; pipeline używa Chromium w Ubuntu 24.04. Pierwszy przebieg ogólnych testów na serwerze deweloperskim przerwało zniszczenie kontekstu strony podczas odświeżenia. Ponowna kontrola stabilnego buildu produkcyjnego na porcie 5174 zakończyła się powodzeniem.
