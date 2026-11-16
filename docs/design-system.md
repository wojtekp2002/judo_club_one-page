# System wizualny

## Kolor

| Rola | Wartość | Zastosowanie |
| --- | --- | --- |
| Nearblack | `#171918` | główny tekst i ciemne sekcje |
| Paper | `#f5f3ee` | spokojne jasne tło |
| Club red | `#c9282f` | główne działanie i wybrane akcenty |
| White | `#ffffff` | tekst na ciemnych polach i jasne powierzchnie |

Kolory tekstu ograniczaj do trzech ról: głównej, pomocniczej i metadanych. Czerwień nie służy do ozdabiania każdej ikony. Utrzymuj kontrast tekstu co najmniej 4,5:1; granice i podziały są cienkie i neutralne. Fotografia może zachować własną kolorystykę.

## Typografia

- **Barlow Condensed 600:** hero, plakat półkolonii i duży numer etapu. Wersaliki nie powtarzają się w każdej sekcji.
- **Manrope 400/500/600:** użytkowe nagłówki 34–54 px, tekst treści 13–16 px, etykiety 11–12 px. Kontroluj kontrast i czytelność na rzeczywistym renderze telefonu.
- Podstawowa skala treści i nagłówków: 12, 14, 16, 20, 24, 32, 48, 64, 96 px; rozmiary display mogą płynnie reagować na szerokość. Ujemny tracking tylko w dużych nagłówkach.
- Zwykły zapis etykiet i zdań, bez wykrzykników i marketingowych ogólników. Liczby wyrównuj przez `font-variant-numeric: tabular-nums` tam, gdzie ułatwia to porównanie.

## Przestrzeń i kompozycja

Skala odstępów: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128 px. Więcej przestrzeni między sekcjami niż wewnątrz grup. Na desktopie korzystaj z asymetrii i rozległej fotografii; na telefonie z jednej kolumny i większych obszarów dotyku. Unikaj identycznej karty dla każdego rodzaju treści. Krawędzie, linie i oznaczenia mają spójny charakter.

## Komponenty i interakcje

Nawigacja: logo, krótkie linki i jedno wyróżnione działanie. Hero: jeden główny przycisk i najwyżej jedno działanie pomocnicze. Kontrolki dotykowe mają minimum 44 px wysokości; wszystkie interaktywne elementy mają widoczny fokus. Wybrana baza treningowa i otwarte pytanie FAQ muszą być jednoznacznie rozpoznawalne także bez koloru.

Lucide jest jedynym zestawem ikon, zwykle 18 px ze spójną grubością kreski. Dwie cienkie kreski inspirowane pasem judo pojawiają się tylko przy istotnych podziałach. Fotografiom nadaj opisowe `alt`, wymiary i celowe kadrowanie; obraz główny ładuj priorytetowo, dalsze leniwie.

Przejścia stanów trwają 200–400 ms; pojedyncze wejście typografii i odsłonięcie fotografii 700–1200 ms. Wspólna krzywa: `cubic-bezier(0.22, 1, 0.36, 1)`. Nie chowaj treści domyślnie w oczekiwaniu na observer; dekoracyjne wejście może ją animować dopiero przy widoczności.

`DojoJourney.tsx` prezentuje trzy ręcznie wybierane kroki przed pierwszym treningiem. Pełna ilustracja obi jest widoczna od początku; wybór etapu przesuwa znacznik wzdłuż pasa przez 440 ms. Nie wiąż ruchu ani treści ze scrollem, nie przypinaj sekcji i nie przewijaj strony po wyborze. `prefers-reduced-motion` ustawia znacznik od razu. `usePageMotion.ts` obsługuje jednorazowe wejścia i linię postępu czytania. Nie dodawaj biblioteki animacyjnej do tych prostych efektów.
