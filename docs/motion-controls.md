# Pierwszy trening bez sterowania przewijaniem — 16.11.2026

## Decyzje i audyt

1. Produkt: rodzic sam wybiera jeden z trzech kroków przed pierwszą wizytą.
2. Charakter: spokojny, konkretny, sportowy.
3. Świat: tatami i autorski szyty pas obi; zachowane barwy, typografia i treść klubu.
4. Momenty: pełna ilustracja pasa oraz krótki ruch znacznika po świadomym wyborze etapu.
5. Znak rozpoznawczy: trzy numerowane etapy i czerwony znacznik na pasie.

Poprzednia sekcja rezerwowała 228svh na komputerze i 260svh na telefonie. Przy wysokich ekranach przypinała zawartość, a pozycja przewijania zmieniała etap. Kliknięcie przycisku także przesuwało stronę. Użytkownik zgłosił tę interakcję jako uciążliwą i poprosił o zmianę. Ta prośba zastępuje wcześniejszą zasadę zachowania przewijanej narracji.

Nowa sekcja ma wysokość wynikającą z treści. Trzy przyciski są nad ilustracją i opisem. Wybór działa myszą, dotykiem, strzałkami, Home i End. Nie uruchamia przewijania, nie zmienia etapu podczas przewijania i nie resetuje wyboru po zmianie szerokości okna. Ruch znacznika trwa 440 ms, zaczyna się w jego aktualnym miejscu i nie jest zapętlony. Przy ograniczonym ruchu pozycja zmienia się od razu.

Zachowujemy treść pierwszego treningu, ilustrację obi i przycisk kontaktu. Nie dodajemy karuzeli automatycznej, parallaxu ani nowej biblioteki animacyjnej. Historyczny audyt i film pozostają w `docs/motion-refinement.md`; nie opisują obecnego zachowania.

Przegląd: usunięcie sztucznej przestrzeni, zachowanie neutralnej palety i Lucide, jasna instrukcja wyboru, spójna typografia, widoczne etapy nad treścią, stabilna wysokość opisu, dostępny fokus i jeden ograniczony ruch po decyzji użytkownika. Materiały fotograficzne pozostają poza zakresem tej poprawki.

## Weryfikacja

- `npm run build` — kontrola TypeScript i build produkcyjny przeszły.
- `npm run test:motion` — 5 grup kontroli: brak przypinania i wymuszonego scrolla, niezmienny etap przy przewijaniu, krótki ruch tylko po wyborze, mysz i strzałki/Home/End, fokus, kontakt i Escape, stabilna wysokość każdego etapu, zachowanie wyboru przy resize oraz ograniczony ruch.
- Wymiary: 1440/1024/768/640/390/320 px oraz ekran 1440×600. Brak poziomego przepełnienia. Obejrzano rzeczywiste zrzuty 1440/768/390 px; sekcja przy 1440 px ma 832 px, a przy 390 px około 827 px wysokości, zamiast wcześniejszych wielokrotności ekranu.
- `npm run test:e2e` — wszystkie 9 grup kontroli strony, w tym formularze, galerie, aktualności, dokumenty, menu mobilne, 7 szerokości i konsola, przeszły.

Automatyczny raport i zrzuty powstają w ignorowanym `test-results/motion`; CI dołącza je do artefaktów. Wybrane zrzuty i zapis weryfikacji: `design-references/journey`. Starsze nagranie zachowano jako materiał historyczny i tak opisano je w README.
