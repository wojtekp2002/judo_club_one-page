<div align="center">

<img src="public/images/logo.png" alt="KS Polonia Rybnik" width="84" />

# JUDO. PO RYBNICKU.

**KS Polonia Rybnik — sportowa strona z własnym rytmem.**

Autentyczni ludzie. Prawdziwe dojo. Interakcje, które pomagają wejść na matę.

`React 19` · `TypeScript` · `Vite 6` · `Tailwind CSS 4` · `Lucide` · `Playwright`

[![Quality — main](https://github.com/wojtekp2002/judo_club_one-page/actions/workflows/quality.yml/badge.svg?branch=main)](https://github.com/wojtekp2002/judo_club_one-page/actions/workflows/quality.yml)

[Zobacz projekt](#projekt) · [Funkcje](#funkcje) · [Zawodnicy i IJF](#zawodnicy) · [Uruchom](#uruchomienie) · [Architektura](#architektura) · [Testy i CI](#testy)

</div>

![Aktualny pierwszy ekran — młodzi judocy Polonii, sportowa typografia i barwy klubu](design-references/hero/desktop.png)

<a id="projekt"></a>

## Klub, który ma własną twarz

Strona prowadzi rodzica od poznania klubu do wyboru sali, grupy i kontaktu w sprawie pierwszego treningu. Zawodnik znajdzie grafik, wiadomości, fotografie oraz dokumenty. Całość jest po polsku i zachowuje oryginalne logo KS Polonia Rybnik.

Zamiast anonimowego zestawu kart: plakatowy początek, redakcyjna kompozycja, reportażowe fotografie i własna ilustracja pasa judo. Czerwień wynika ze znaku klubu, a nie z przypadkowego motywu kolorystycznego.

> **Jedna wyróżniająca interakcja:** przewijanie rozwija pas obi i prowadzi przez trzy kroki przed pierwszym treningiem. Na niskim ekranie lub przy ograniczeniu ruchu te same informacje wybiera się przyciskami.

### Zobacz ruch

[▶ Demonstracja animacji — 21 sekund, MP4](design-references/motion-review/polonia-animations.mp4)

Nagranie dokumentuje sekwencję obi i animacje wcześniejszej wersji. Aktualny pierwszy ekran oraz profile pokazują zrzuty w tym README.

<table>
  <tr>
    <td width="74%"><img src="design-references/motion-review/journey-desktop-3.png" alt="Pas judo i trzeci etap opowieści na komputerze" width="100%" /></td>
    <td width="26%"><img src="design-references/motion-review/journey-390.png" alt="Ta sama interakcja dopasowana do telefonu 390 px" width="100%" /></td>
  </tr>
  <tr>
    <td align="center"><b>Komputer — przypięta narracja, naturalne przewijanie</b></td>
    <td align="center"><b>Telefon — treść w zasięgu kciuka</b></td>
  </tr>
</table>

<a id="funkcje"></a>

## Od pierwszego spojrzenia do pierwszego treningu

```mermaid
flowchart LR
  A[Poznaj Polonię] --> B[Trzy kroki do pierwszych zajęć]
  B --> C[Wybierz dzielnicę]
  C --> D[Sprawdź grupę i godziny]
  D --> E[Przygotuj wiadomość lub zadzwoń]
  E --> F[Termin potwierdza klub]
```

| Miejsce | Co można zrobić |
| :--- | :--- |
| **Klub** | Poznać lokalny charakter Polonii i zobaczyć jej prawdziwe fotografie |
| **Pierwszy trening** | Przejść przez trzy kroki: kontakt, wejście na matę, dobór grupy |
| **Treningi** | Przełączać Centrum, Nowiny, Niedobczyce i Boguszowice; filtrować konkretne grupy i otworzyć dojazd |
| **Klubowy dziennik** | Filtrować wiadomości, otworzyć artykuł i przejść do oficjalnego źródła |
| **Półkolonie** | Sprawdzić turnusy zimowe 2027, informacje organizacyjne i pobrać kartę kwalifikacyjną |
| **Ludzie i galeria** | Oglądać portrety, powiększać zdjęcia i przechodzić między nimi klawiaturą |
| **Nazwiska z Rybnika** | Poznać 10 zawodników, przejrzeć najważniejsze osiągnięcia, sezon 2026 i wszystkie starty IJF bezpośrednio w profilu |
| **Archiwum IJF** | Filtrować 219 wpisów: 182 starty turniejowe i 37 wydarzeń treningowych; pobrać CSV i udostępnić profil |
| **FAQ i dokumenty** | Sprawdzić odpowiedzi przed pierwszym treningiem i pobrać deklarację członkowską |
| **Kontakt** | Zadzwonić lub przygotować wiadomość e-mail z danymi potrzebnymi do dobrania zajęć |

<a id="zawodnicy"></a>

### Dziesięć nazwisk. Jedna historia wyników.

Szymon Szulik, Dawid Szulik, Julia Kowalczyk, Szymon Panek, Patryk Żemła, Wiktoria Mołdrzyk, Igor Gabriel, Adrian Stefański, Konrad Liszka i Paweł Marek mają osobne profile. Najważniejsze osiągnięcia obejmują m.in. złoto MŚ kadetów Szymona z 2023 r., brąz MŚ seniorek Julii z 2019 r. i jej siódme miejsce olimpijskie w Tokio.

| Widok | Zawartość |
| :--- | :--- |
| **Najważniejsze** | Wszystkie medale zapisane w IJF i lokaty olimpijskie w pierwszej siódemce, uporządkowane według rangi zawodów; przy braku takich wyników — ostatnie starty |
| **2026** | Starty turniejowe z wybranego sezonu |
| **Wszystkie** | Pełna historia turniejowa zawodnika z paginacją po osiem wpisów |
| **Archiwum** | Filtry zawodnika, sezonu, rodzaju wydarzenia i podium; wyszukiwanie zawodów, eksport CSV i link do udostępnienia |

Profile i archiwum korzystają z jednego zbioru danych IJF, zweryfikowanego 16.11.2026. Brak opublikowanej lokaty oznacza udział, nie przegraną. Zakres, źródła i ograniczenia: [dane IJF](docs/ijf-results-sources.md), [fotografie](docs/athlete-photo-refresh.md), [weryfikacja profili](docs/profile-refresh.md).

![Nazwiska z Rybnika — profil Szymona, pełna historia i najważniejsze osiągnięcia](design-references/profiles/szymon-1440.png)

<details>
<summary><b>Zobacz profil na telefonie — 390 px</b></summary>

<img src="design-references/profiles/szymon-390.png" alt="Profil Szymona na telefonie: wybór zawodnika, fotografia, najważniejsze wyniki i paginacja" width="390" />

</details>

**Zakres zbioru:** 219 rekordów = 182 uczestnictwa turniejowe + 37 wydarzeń treningowych. Dane obejmują publiczną historię IJF z dnia weryfikacji, bez krajowych turniejów nieobecnych w tym źródle i bez synchronizacji na żywo. Zmiana danych w `src/ijf-results.json` aktualizuje równocześnie profile i archiwum.

### Ruch z konkretnym zadaniem

| Efekt | Implementacja | Po co |
| :--- | :--- | :--- |
| Odsłonięcie liter hero | CSS, pojedyncza sekwencja | Nadaje wejściu sportowy rytm |
| Pas obi | SVG + `requestAnimationFrame` | Łączy przewijanie z trzema krokami przed zajęciami |
| Odsłonięcie fotografii | Intersection Observer + Web Animations API | Buduje jeden wyraźny moment fotograficzny |
| Zmiana grafiku i filtrów | Krótkie przejścia stanów | Pokazuje, że treść została zmieniona |
| Linia w nagłówku | Postęp przewijania | Ułatwia orientację w długiej stronie |

Bez biblioteki animacyjnej, przechwytywania kółka myszy i zapętlonych dekoracji. Obsługiwane jest `prefers-reduced-motion`.

<a id="uruchomienie"></a>

## Uruchomienie w minutę

Potrzebujesz **Node.js 22** i **npm**.

```bash
git clone https://github.com/wojtekp2002/judo_club_one-page.git
cd judo_club_one-page
npm ci
npm run dev
```

Otwórz adres wypisany przez Vite, domyślnie **http://127.0.0.1:5173**.

| Polecenie | Działanie |
| :--- | :--- |
| `npm run dev` | Lokalny serwer z odświeżaniem po zmianach |
| `npm run build` | Kontrola TypeScript i gotowa wersja w `dist/` |
| `npm run preview` | Podgląd zbudowanej wersji |
| `npm run test:e2e` | Testy funkcji i responsywności w Chrome |
| `npm run test:people` | Kompletność wyników 10 profili, klawiatura, fotografie i trenerzy |
| `npm run test:results` | Integralność danych IJF, filtry, CSV i udostępnianie |
| `npm run test:motion` | Testy historii obi, klawiatury i ograniczonego ruchu |

<a id="architektura"></a>

## Mało warstw. Jasne odpowiedzialności.

```mermaid
flowchart TB
  V[Vite] --> R[React + TypeScript]
  R --> A[App: sekcje, grafik, filtry i dialogi]
  R --> J[DojoJourney: historia pasa obi]
  R --> M[usePageMotion: wejścia i postęp czytania]
  A --> K[People: zawodnicy i trenerzy]
  A --> H[ResultsArchive: filtry, CSV i udostępnianie]
  K --> F[athleteProfiles: fotografie i wybór osiągnięć]
  F --> I[ijf-results.json: 10 osób, 219 wpisów]
  H --> I
  K --> C[teamData: klubowe albumy i trenerzy]
  F --> C
  A --> D[data.ts: dane klubu i treści]
  A --> P[public: lokalne zdjęcia, logo i dokumenty]
  R --> S[CSS: system wizualny i responsywność]
  T[Playwright] -. sprawdza .-> R
```

```text
src/
├── App.tsx              # strona i działające interakcje
├── DojoJourney.tsx      # trzy etapy opowieści i ilustracja SVG
├── People.tsx           # profile zawodników, galerie i kadra
├── athleteProfiles.ts   # przygotowanie profili i wyróżnienie osiągnięć
├── ResultsArchive.tsx   # archiwum, filtry, CSV i linki do udostępnienia
├── ijf-results.json     # wspólny zbiór wyników IJF dla profili i archiwum
├── teamData.ts          # albumy klubowe i informacje o trenerach
├── usePageMotion.ts     # jednorazowe wejścia i postęp przewijania
├── data.ts              # informacje, grafik, artykuły i fotografie
├── styles.css           # bazowy system i układy
├── experience.css       # kompozycja redakcyjna i ruch
├── people.css           # profile, galerie i kadra
├── profile-refresh.css  # pełne profile i responsywny spis nazwisk
└── results.css          # archiwum wyników
public/
├── images/              # fotografie klubu, logo, partnerzy
└── documents/           # oryginalne dokumenty do pobrania
scripts/                 # testy i nagranie demonstracyjne
docs/                    # źródła, decyzje projektowe, audyty
design-references/       # rzeczywiste zrzuty, raporty i film
.github/workflows/       # build, regresja przeglądarkowa i audyt zależności
.agents/skills/          # pełna instalacja Unslop Local
```

Fonty i fotografie są lokalne. Strona nie potrzebuje zewnętrznego CDN ani kluczy API. Wynik `build` jest statyczną stroną do umieszczenia na hostingu.

### Co dzieje się ze zgłoszeniem?

```mermaid
sequenceDiagram
  actor Rodzic
  participant Strona
  participant Poczta as Własna aplikacja pocztowa
  participant Klub
  Rodzic->>Strona: Wpisuje wiek, lokalizację i kontakt
  Strona-->>Rodzic: Pokazuje gotową treść wiadomości
  Rodzic->>Poczta: Otwiera mailto lub kopiuje treść
  Rodzic->>Klub: Samodzielnie wysyła wiadomość
  Klub-->>Rodzic: Potwierdza grupę i termin
```

Formularz nie wysyła korespondencji i nie zapisuje zgłoszeń na serwerze. Powrót do edycji zachowuje pola, a zamknięcie okna je czyści. Projekt nie zawiera płatności ani panelu CMS.

<a id="testy"></a>

## Sprawdzone w przeglądarce

Stan lokalnych kontroli: **16 listopada 2026**. Bieżący status gałęzi `main` pokazuje badge na początku README oraz [GitHub Actions](https://github.com/wojtekp2002/judo_club_one-page/actions/workflows/quality.yml).

| Kontrola | Wynik |
| :--- | :--- |
| Build i ścisły TypeScript | Przeszły |
| Testy funkcjonalne | 9 grup kontroli przeszło |
| Testy animacji i klawiatury | 4 grupy kontroli przeszły |
| Profile zawodników | Wszystkie 182 starty dostępne w 10 profilach, komplet stron wyników, źródła, klawiatura i fotografie |
| Archiwum IJF | Spójne 219 rekordów, działające filtry, CSV, udostępnianie i obsługa pustych lokat |
| Szerokości | 320, 360, 390, 640, 768, 1024, 1440 px |
| Konsola podczas testów funkcjonalnych | Bez błędów |
| Ograniczony ruch | Działająca alternatywa bez przypinania |

[Raport funkcji](design-references/test-report.json) · [Raport ruchu](design-references/motion-review/report.json) · [Przegląd jakości](docs/quality-review.md) · [Analiza filmu i drugi audyt](docs/motion-refinement.md)

### Pipeline Quality

```mermaid
flowchart LR
  G[Push lub pull request] --> B[Node 22: npm ci i build]
  B --> P[Chromium: funkcje, profile, archiwum i ruch]
  P --> Z[Artefakty: zrzuty i raporty, 7 dni]
  P --> W[Artefakt: produkcyjny dist, 7 dni]
  G --> D[Audyt zależności: high i critical]
```

[Konfiguracja](.github/workflows/quality.yml) uruchamia dwa zadania na Ubuntu 24.04: `build-and-browser` i `dependencies`. Pipeline działa dla PR, zmian na `main` i gałęziach funkcjonalności oraz ręcznie przez **Run workflow**. Gotowy build i materiały kontroli można pobrać z sekcji **Artifacts** wybranego uruchomienia. Pipeline sprawdza projekt i przygotowuje pliki; nie wdraża strony na hosting.

<details>
<summary><b>Jak odtworzyć testy</b></summary>

Uruchom serwer w pierwszym terminalu:

```bash
npm run dev -- --port 5173
```

W drugim:

```bash
npm run build
npm run test:e2e
npm run test:people
npm run test:results
npm run test:motion
```

Na Windows testy domyślnie używają Chrome pod ścieżką `C:/Program Files/Google/Chrome/Application/chrome.exe`. Własną przeglądarkę wskaż przez `CHROME_PATH`. Na Linux/macOS zainstaluj Chromium poleceniem `npx playwright install chromium`; testy użyją go domyślnie. Inny adres serwera ustawisz przez `TEST_URL`.

Przykład PowerShell:

```powershell
$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$env:TEST_URL = 'http://127.0.0.1:5173'
npm run test:e2e
```

</details>

## Projekt, który da się dalej rozwijać

| Dokument | Co w nim znajdziesz |
| :--- | :--- |
| [Zasady projektu](AGENTS.md) | Reguły treści, dostępności i dalszych zmian |
| [Kierunek wizualny](docs/design-direction.md) | Charakter Polonii i decyzje kompozycyjne |
| [System wizualny](docs/design-system.md) | Barwy, typografia, odstępy i komponenty |
| [Badanie klubu](docs/research.md) | Źródła faktów, grafiku, fotografii i dokumentów |
| [Rozwinięcie animacji](docs/motion-refinement.md) | Powody zmian i konkretne sprawdzenia |
| [Źródła składu i kadry](docs/people-sources.md) | Identyfikacja zawodników, trenerzy i klubowe fotografie |
| [Publiczna historia IJF](docs/ijf-results-sources.md) | Metoda pobrania, identyfikatory, liczby i zakres danych |
| [Pełne profile](docs/profile-refresh.md) | Decyzje interfejsu i kontrola wszystkich startów |
| [Przegląd fotografii](docs/athlete-photo-refresh.md) | Źródła, daty materiałów i brakujące portrety |
| [Aktualizacja pierwszego ekranu](docs/hero-photo-update.md) | Źródło zdjęcia grupowego i kadrowanie |

Unslop Local pozostaje w [`.agents/skills/unslop-local/`](.agents/skills/unslop-local/SKILL.md). Proces i materiały: [Damir Sokolovsky](https://x.com/heydamir), CC BY 4.0; adaptacja: [Dawid Zdunczyk](https://github.com/DawidZdunczyk/unslop).

### Treści i publikacja

Dane pochodzą z materiałów klubu, IJF i PZ Judo; dokumentacja wskazuje źródło każdej grupy informacji. Aktualności, składki, grafik i wyniki są zapisem źródeł, bez automatycznej synchronizacji. Fotografie są podpisane zgodnie z dostępnym kontekstem; archiwalne kadry nie są przedstawiane jako sesja z 2026 r. Dla Konrada Liszki i Pawła Marka jawnie pokazano brak portretu. Galerie IJF otwierają się w serwisie federacji.

Przed publicznym uruchomieniem klub powinien potwierdzić aktualność informacji i prawa do wykorzystania fotografii. Repozytorium nie nadaje odrębnej licencji na cudze zdjęcia, logo ani dokumenty.

---

<div align="center">

**KS Polonia Rybnik · judo od 1991 roku**  
[Oficjalna strona klubu](http://www.judorybnik.pl/) · [Facebook](https://www.facebook.com/JudoZabawaRybnik/)

</div>
