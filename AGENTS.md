# KS Polonia Rybnik — zasady projektu

## Cel i tożsamość

Twórz polską stronę prawdziwego klubu judo dla rodziców, dzieci, młodzieży i zawodników. Priorytetem są wybór zajęć i lokalizacji, wiarygodne informacje oraz prosty kontakt w sprawie pierwszego treningu. Zachowuj oryginalne logo i czarno-biało-czerwone barwy klubu.

Przed nową większą częścią interfejsu określ pięć decyzji: **produkt, charakter, świat, najważniejsze momenty i znak rozpoznawczy**. Rozwijaj kierunek z [docs/design-direction.md](docs/design-direction.md) i wartości z [docs/design-system.md](docs/design-system.md). Projektuj całą kompozycję, jej hierarchię i rytm; nie składaj strony z przypadkowych kart.

## Projektowanie

- Utrzymuj sportową, redakcyjną kompozycję: wyraziste proporcje, mocną typografię, autentyczne fotografie i spokojną nawigację. Każda sekcja ma wnosić odrębną informację.
- Stosuj Barlow Condensed 600 do nagłówków i Manrope 400/500/600 do treści. Duże wersaliki są świadomym zabiegiem plakatowym; etykiety, formularze i nawigacja pozostają czytelne, w zwykłym zapisie. O hierarchii decydują rozmiar, przestrzeń i kontrast.
- Używaj kontrolowanej palety neutralnej i czerwieni klubu. Zapewniaj czytelny kontrast; dekoracja nie może utrudniać odczytu zdjęć ani tekstu.
- Buduj odstępy na skali 4 px, wyrównuj pokrewne elementy i konsekwentnie stosuj wielkości kontrolek. Nie zamykaj każdej sekcji w takim samym pojemniku lub zaokrąglonej karcie.
- Unikaj gradientowych nagłówków, neonów, poświat, rozmytych plam, glassmorphismu, dekoracyjnych siatek, nadmiaru cieni i odznak, pustych metryk, fałszywych opinii, losowych kolorowych ikon, emoji jako ikon oraz powtarzalnych siatek funkcji.
- Zdjęcia muszą przedstawiać klub lub rzeczywisty kontekst judo i mieć odnotowane źródło. Nie zastępuj ich przypadkowymi zdjęciami stockowymi ani pozorowanymi materiałami klubu. Sprawdź zgodę na wykorzystanie przed publikacją.
- Stosuj jeden zestaw ikon Lucide, kontrolowany rozmiar i grubość kreski. Motyw dwóch cienkich kresek inspirowany oznaczeniem pasa judo jest detalem identyfikacji, nie tłem każdej powierzchni.
- Ruch służy zmianie stanu i informacji zwrotnej. Unikaj animacji zapętlonych, parallaxu i `transition: all`; respektuj `prefers-reduced-motion`.
- Zachowuj autorską ilustrację obi z `DojoJourney.tsx` i trzy kroki do pierwszego treningu. Etap wybiera użytkownik przyciskiem lub klawiaturą; krótki ruch znacznika wynika wyłącznie z tego wyboru. Sekcja ma wysokość treści, bez przypinania, sterowania etapem przez scroll i programowego przewijania po wyborze. Przy ograniczonym ruchu znacznik zmienia pozycję od razu. Aktualne decyzje: `docs/motion-controls.md`; wcześniejszy wariant jest udokumentowany historycznie w `docs/motion-refinement.md`.

## Treść i działanie

Korzystaj ze zweryfikowanych źródeł zapisanych w `docs/research.md`. Nie wymyślaj osiągnięć, wyników, trenerów, terminów, opinii ani funkcji. Nie przedstawiaj historycznych wiadomości jako aktualizacji na żywo. Ceny i grafik wymagają potwierdzenia przy zmianie sezonu.

Każdy przycisk i link ma działać. Formularz kontaktowy przygotowuje wiadomość w programie pocztowym; bez backendu nie wolno komunikować, że zgłoszenie wysłano lub przyjęto. Nie dodawaj kont, płatności ani panelu administracyjnego bez potrzeby wynikającej z zadania.

Używaj semantycznego HTML, etykiet formularzy, tekstów alternatywnych, widocznego fokusu i obsługi klawiatury. Menu mobilne i modal muszą być dostępne. Projektuj odrębne układy dla telefonu, tabletu i komputera, bez poziomego przepełnienia.

## Technologia i weryfikacja

Stos: React, TypeScript, Vite, Tailwind CSS i własne style. Zachowuj proste komponenty, nie wprowadzaj zależności bez konkretnej potrzeby i nie pozwalaj bibliotece narzucać wyglądu. Nie nadpisuj pracy użytkownika ani reguł projektu bez przeglądu.

Po zmianach uruchom właściwe kontrole, w tym `npm run build`. Przy istotnej zmianie interfejsu uruchom stronę, obejrzyj rzeczywiste zrzuty ekranu i sprawdź co najmniej 1440, 768 i 390 px oraz szerokości pośrednie. Sprawdź nawigację, formularze, fokus, kadrowanie zdjęć, kontrast i błędy konsoli. Raportuj wyłącznie faktycznie wykonane kontrole oraz ich ograniczenia.

## Unslop Local

Pełna umiejętność znajduje się w [.agents/skills/unslop-local/SKILL.md](.agents/skills/unslop-local/SKILL.md). Przeczytaj ją oraz adekwatne pliki `references/` przed audytem. Jeśli nie jest automatycznie wykrywana, zastosuj instrukcje ręcznie. Pracuj w kolejności: odstępy, kolor, ikony, treść, typografia, układ, detale, fotografie, ruch; zapisz konkretne ustalenia i wykonaj ograniczony cykl poprawek oraz ponownej oceny. Zachowaj świadomą typografię, asymetrię i charakter klubu. Nie zmieniaj udanego ekranu tylko po to, by wyglądał inaczej.

Autor procesu i materiałów Unslop: Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Adaptacja Unslop Local: [Dawid Zdunczyk](https://github.com/DawidZdunczyk/unslop). Zachowuj te informacje przy kopiowaniu lub adaptacji umiejętności.
