# Droga po pas — kierunek funkcji

## Pięć decyzji

1. Produkt: klubowy przewodnik po wymaganiach PZ Judo, z wyborem stopnia, nazwami technik, materiałami wizualnymi i prywatną listą powtórek.
2. Charakter: sportowy, uporządkowany, cierpliwy.
3. Świat: dojo, szyty pas i podręczny notes treningowy. Zachowujemy czerń, papierowe tło, czerwień, Barlow Condensed i Manrope.
4. Momenty: duży wektorowy pas przy wyborze stopnia oraz pojedynczy panel materiału Kodokan. Lista wymagań zachowuje spokojną hierarchię.
5. Znak rozpoznawczy: spis stopni z rzeczywistymi kolorami pasów, ze zszyciem jako drobnym detalem ilustracji.

## Zakres i audyt przed implementacją

Osobna podstrona `#/droga-po-pas` działa na statycznym hostingu bez reguł przekierowań i bez nowej biblioteki routingu. Linki z głównej nawigacji i stopki łączą przewodnik ze stroną klubu. Istniejąca narracja obi pozostaje na stronie głównej.

Nowy interfejs weryfikujemy w kolejności: odstępy, kolor, ikony, treść, typografia, układ, detale, fotografie, ruch. Unikamy dziewięciu identycznych kart, tablicy wszystkich filmów naraz i dekoracyjnych procentów. Kolory pasów są danymi, a nie paletą przycisków. Zaznaczenia są prywatną listą powtórek, bez sugerowania zaliczenia egzaminu.

Program wymaga odczytania aktualnie podlinkowanych dokumentów PZ Judo, z półstopniami i odrębną ścieżką DAN. Nie zakładamy wymyślonych limitów wieku ani identycznego programu klubowego bez potwierdzenia. Treść obejmuje nazwy i kategorie, bez samodzielnie opracowywanych instrukcji rzutów, duszeń czy dźwigni. Materiały zewnętrzne wskazują autora i źródło; filmy pozostają na platformie właściciela.

Ilustracja pasa powstaje w SVG, ponieważ jest wektorowym elementem interfejsu. Nie generujemy wizerunków zawodników ani technicznych animacji udających zweryfikowaną demonstrację. Ruch ograniczamy do zmiany wybranego stopnia i krótkich przejść; bez automatycznego odtwarzania i zapętlonych dekoracji, z obsługą ograniczonego ruchu.

## Gotowa funkcja

- Program: 9 KYU, 73 nazwy technik (42 nage-waza i 31 katame-waza), 14 unikalnych pozycji podstaw. Widok z wcześniejszymi stopniami zawiera 87 pozycji bez powtarzania tych samych nazw.
- DAN: odrębne zestawienie kata i kolorów z regulaminu z 23.09.2025; nie udaje kompletnej kwalifikacji egzaminacyjnej.
- Wybór stopnia, wyszukiwanie, filtry grup, wskazanie materiału oraz 49 zweryfikowanych adresów filmów Kodokan. Zasady dopasowania i zakres demonstracji: [materiały](belt-media-sources.md).
- Notes powtórek zapisuje identyfikatory w `localStorage`; obsługuje odmowę zapisu oraz potwierdzenie usunięcia. Nie przechowuje danych zawodników ani wyników egzaminu.
- Udostępnianie zachowuje wybrany stopień w URL; przy braku dostępu do schowka pokazuje adres do ręcznego skopiowania.
- Wydruk obejmuje pełny wybrany program z wcześniejszymi stopniami, niezależnie od filtrów na ekranie. Dla DAN drukuje zestawienie kata.
- Podstrona ma własne metadane, link powrotny, działający skrót do programu i informację o źródłach/prywatności. Główna nawigacja i stopka prowadzą do atlasu. Ładowanie przez `React.lazy` zachowuje osobny plik nowej funkcji.

## Przegląd dziewięciu warstw

1. Odstępy: skala 4 px, sekcje 40–80 px, obszary dotykowe minimum44px. Checkbox obejmuje cały obszar etykiety, a nie sam mały znak.
2. Kolor: neutralny papier i czerń z klubową czerwienią; inne barwy występują wyłącznie jako faktyczne kolory pasów. Jasny pas ma kontrastującą powierzchnię i obrys.
3. Ikony: tylko Lucide; osobne znaczenie filmu, źródła, wydruku i zaznaczenia.
4. Treść: nazwy z PZ Judo, właściwe strony PDF i jawne daty dokumentów. Bez fikcyjnego przypisywania minimalnego wieku i automatycznego zaliczenia.
5. Typografia: Barlow Condensed w głównym tytule i wybranym stopniu; Manrope w programie i kontrolkach. Dłuższe nazwy zawijają się w wierszu.
6. Układ: boczny spis na komputerze, pełny spis nad programem na tablecie, dwie kolumny wyboru pasa i jeden panel materiału na telefonie. Wybranie materiału na telefonie przenosi widok do tego panelu.
7. Detale: widoczny fokus, natywne checkboxy i przyciski, odnośniki do dokumentów, stan pusty oraz potwierdzenie usunięcia notatek.
8. Fotografie: materiały Kodokan pozostają zewnętrzne, z podpisem autora i działającym oryginałem. Nie dodano fikcyjnych ujęć technik ani portretów.
9. Ruch: krótka zmiana koloru pasa i jednorazowy szew po wyborze, bez zapętlenia. Odtwarzanie po decyzji użytkownika; ograniczony ruch wyłącza przejścia.

## Jak odtworzyć kontrolę

`npm run build`, serwer `npm run preview -- --port 5173`, następnie `npm run test:belts`. Test sprawdza kompletność wszystkich stopni, wcześniejszy materiał, DAN, wyszukiwanie i filtry, zapis po odświeżeniu, reset, klawiaturę, blokadę schowka i pamięci, pełny wydruk, granicę odtwarzacza, routing i szerokości1440/1024/768/390/320. Funkcjonalne przejścia wykonuje przy ograniczonym ruchu, aby automatyczne przewijanie nie wpływało na trafienie kontrolki.

Raport, zrzuty i przykładowy PDF z testów trafiają do ignorowanego `test-results/belts`, skąd CI dołącza je do artefaktów. `design-references/belts` zawiera wybrane rzeczywiste zrzuty do dokumentacji. Ręcznie obejrzano komputer, tablet i telefon oraz prawdziwy odtwarzacz Ukemi. Testy ogólne strony głównej obejmują siedem szerokości i wszystkie wcześniejsze formularze, menu, galerie i dokumenty.
