# Kadra i zawodnicy — 16 listopada 2026

Gałąź: `codex/kadra-zawodnicy-ijf`. README zapisano oddzielnym commitem na `main`.

## Dane

- [Sztab MOSiR](https://mosir.rybnik.pl/aktywny-rybnik/sport-i-rekreacja/dyscypliny-indywidualne): osiem osób i role trenerów. Nie utożsamiano starszej listy trenerów z aktualnym zestawieniem miejskim. Nie dodano niepotwierdzonych numerów dan, telefonów ani przydziałów grup.
- [Oficjalne portrety klubu](http://www.judorybnik.pl/info/14/Trenerzy.html): Ariel Kuśka (`KuskaAriel.jpg`), Krzysztof Mika (`MikaKrzysztof.jpg`), Rafał Kowalczyk junior (`KowalczykRafal.jpg`), Rafał Kowalczyk (`kowalczyk.jpg`), Ewelina Rogalka (`RogalkaEwelina.jpg`). Pliki pod `http://www.judorybnik.pl/uploads/`, lokalnie `public/images/coaches/`. Daty zdjęć nie są opublikowane. Dla Dawida Janasa i Juliusza Kowalczyka zastosowano inicjały zamiast cudzych lub wygenerowanych portretów.
- [Szymon Szulik — IJF](https://www.ijf.org/judoka/67962): brąz ME juniorów Podgorica 2026, brąz Paks 2026, złoto Warsaw European Open 2026, brąz ME juniorów Bratysława 2025.
- [Dawid Szulik — IJF](https://www.ijf.org/judoka/54183): 5. miejsce Skopje 2026, brąz Podgorica 2026, brąz Dubrownik 2025, brąz Paks 2024. Obecny nagłówek profilu podaje −90 kg, starsze wyniki/ranking −81 kg; nie przypisano nowej wagi do starych startów.
- [Julia Kowalczyk — IJF](https://www.ijf.org/judoka/19867): brąz Tallinn 2026, brąz Conegliano 2025, złoto Podgorica 2024 i 7. miejsce Grand Slam Qazaqstan Barysy 2023.

Daty wyników są datami zawodów z IJF, nie datami publikacji klubowych artykułów. To zweryfikowany zapis, bez synchronizacji na żywo i bez utrwalania dynamicznych rankingów.

## Fotografie i prawa

Albumy używają oficjalnych materiałów klubu już zarejestrowanych w `research.md`: portretów, Birmingham, Stambułu, Portimão, Dubrownika oraz Julii w Baku. Fotografia grupowa Tbilisi nie została przypisana do Julii. Materiały archiwalne są tak podpisane; nie twierdzimy, że wykonano je w 2026 roku.

Nie dodano do repozytorium plików zdjęciowych IJF: ich regulamin nie daje ogólnej licencji na kopiowanie do innej witryny. Każdy profil prowadzi bezpośrednio do oficjalnej galerii IJF oraz walk w JudoTV. Profil Dawida w momencie sprawdzenia nie miał zdjęć eventowych. Nowe fotografie IJF można podmienić dopiero po uzyskaniu odpowiedniej zgody/licencji; publiczna dostępność nie zastępuje takiej zgody. Prawa do klubowych materiałów także pozostają przy ich właścicielach, zgodnie z dotychczasowym rejestrem.

## Funkcje

Trzy przełączane profile, obsługa strzałek/Home/End, filtr wyników 2026/wszystkie, album na osobę, powiększenie fotografii z Escape i przywracaniem fokusu, wyszukiwarka ośmiu trenerów tolerująca brak polskich znaków, stan pusty i reset, kontakt w sprawie zajęć oraz zwijane archiwum portretów. Kontrolki mają opisy; animacje respektują ograniczenie ruchu.

Wykonano pomyślnie: `node scripts/verify-people.mjs` (profile, wyniki, zdjęcia, powiększenie, wyszukiwanie, 5 szerokości), wszystkie 9 grup `npm run test:e2e` oraz `npm run build` z kontrolą TypeScript. Obejrzano zrzuty desktop i mobile w `design-references/people/`. Nowy test jest też dostępny jako `npm run test:people`.
