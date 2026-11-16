# KS Polonia Rybnik

Lokalny projekt responsywnej strony klubu judo: sportowa typografia, oryginalne logo, fotografie klubu i informacje o treningach. Stos: React 19, TypeScript, Vite 6, Tailwind CSS 4 i Lucide. Fonty są dostarczane lokalnie z zależności projektu.

## Uruchomienie

Wymagany Node.js 22 i npm. W folderze projektu wykonaj:

```powershell
npm install
npm run dev
```

Otwórz lokalny adres wypisany przez Vite. Wersję produkcyjną przygotowuje `npm run build`, a jej podgląd uruchamia `npm run preview`.

## Zakres

Strona obejmuje informacje o klubie, wybór miejsca treningu i grafiku, aktualności, obozy i półkolonie, FAQ oraz kontakt. Działanie dotyczące pierwszego treningu przygotowuje wiadomość e-mail; użytkownik wysyła ją w swoim programie pocztowym.

Druga wersja dodaje autorską opowieść z pasem judo sterowanym przewijaniem, wejście typografii, odsłonięcie fotografii oraz przejścia stanów. Sekwencja ma alternatywę ręczną dla niskich ekranów i ustawienia ograniczonego ruchu. Aktualności i portrety otrzymały bardziej zróżnicowany układ.

Treści i źródła fotografii opisuje [docs/research.md](docs/research.md). Kierunek i zasady dalszej pracy znajdują się w [docs/design-direction.md](docs/design-direction.md), [docs/design-system.md](docs/design-system.md) i [AGENTS.md](AGENTS.md).

## Weryfikacja

```powershell
npm run build
npm run test:e2e
npm run test:motion
```

Test przeglądarkowy korzysta z Playwright i lokalnego Chrome. Najpierw uruchom w drugim terminalu `npm run dev -- --port 5173`. Domyślnie test szuka Chrome w `C:/Program Files/Google/Chrome/Application/chrome.exe`; inną ścieżkę można przekazać zmienną `CHROME_PATH`, a inny adres serwera — `TEST_URL`.

Weryfikacja 16 listopada 2026: build i TypeScript przeszły pomyślnie, podobnie jak 9 grup testów przeglądarkowych. Sprawdzono szerokości 320–1440 px, obejrzano zrzuty desktop/tablet/mobile i formularza. Szczegóły: [docs/quality-review.md](docs/quality-review.md). Zrzuty są w `design-references/`, a wersja produkcyjna w `dist/`.

Po drugim audycie ponownie przeszły testy funkcjonalne i dodatkowe 4 grupy kontroli ruchu. Analiza filmu, ustalenia i szczegóły: [docs/motion-refinement.md](docs/motion-refinement.md). Nagranie efektu: `design-references/motion-review/polonia-animations.mp4`.

Unslop Local jest zainstalowany z kompletnymi referencjami i skryptami w `.agents/skills/unslop-local/`. W tej sesji instrukcje są stosowane przez bezpośredni odczyt; w kolejnych sesjach można użyć `$unslop-local`, jeśli agent wykrywa umiejętności projektu. Autor Unslop: [Damir Sokolovsky](https://x.com/heydamir), CC BY 4.0; adaptacja: [Dawid Zdunczyk](https://github.com/DawidZdunczyk/unslop).

## Ograniczenia przed publikacją

- Aktualności i informacje organizacyjne są lokalnym zapisem źródeł, bez CMS i automatycznej synchronizacji z mediami społecznościowymi.
- Ceny, terminy i grafik wymagają potwierdzenia przez klub przed publikacją oraz przy zmianie sezonu.
- Zdjęcia pochodzą z publicznych materiałów klubu; publikacja projektu wymaga potwierdzenia praw i zgody klubu na ich wykorzystanie.
- Projekt nie ma serwera do wysyłania wiadomości, zapisywania zgłoszeń ani obsługi płatności. Przygotowanie e-maila nie potwierdza przyjęcia do grupy.

Projekt zapisano lokalnie; wdrożenie na publicznej domenie jest osobnym krokiem.
