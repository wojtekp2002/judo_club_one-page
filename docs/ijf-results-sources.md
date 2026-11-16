# Pełny publiczny zbiór IJF — weryfikacja 16.11.2026

Zbiór `src/ijf-results.json` zawiera **219 rekordów dla dziesięciu osób**: ośmiu wymienionych na [oficjalnej liście zawodników KS Polonia Rybnik](http://www.judorybnik.pl/info/13/Zawodnicy.html) oraz Konrada Liszki i Pawła Marka, których przynależność klubową w 2026 r. potwierdza [ranking Polskiego Związku Judo](https://pzjudo.pl/strefa-sportowa/ranking/). To **182 uczestnictwa w zawodach** i **37 wydarzeń treningowych**. Wśród zawodów **60 rekordów ma opublikowaną lokatę**. Nie oznacza to 60 medali.

## Zakres i metoda

1. Odczytano publiczne strony `/judoka/{id}/results` i ich dane SSR Nuxt. Nie uruchamiano skryptów pochodzących ze strony jako kodu lokalnego — odkodowano wyłącznie statyczny JSON, w którym wartości są referencjami indeksowymi.
2. W publicznej aplikacji IJF potwierdzono żądanie `GET https://ijf.org/api/v1/competitors/{id}/results`. Dla profili bez punktowanych lokat użyto tego samego publicznego endpointu. Nie wymaga on logowania ani tokenu.
3. Zachowano wszystkie zwrócone rekordy: lokaty, uczestnictwa bez podanej lokaty oraz obozy treningowe. Nie ograniczono zestawu do czterech rekordów „Latest Results” ani do medalowych startów.
4. Każdy rekord zachowuje nazwę zawodów, identyfikator, daty rozpoczęcia i zakończenia, kategorię wiekową, wagę z danego startu, klasę zawodów oraz odnośnik źródłowy. Daty końcowe parsowano bez konwersji strefy czasowej.
5. Typ `training` wyznaczono z jawnej nazwy obozu: Training/OTC/ITC/Seminar. Pozostałe rekordy mają typ `competition`. Brak lokaty zapisano jako `null`, nigdy jako przegraną, zero ani nieobecność.

To **pełny zbiór zwrócony przez publiczną historię IJF w dniu weryfikacji**, nie cała kariera krajowa zawodników, nie zapis pojedynczych walk i nie ranking na żywo. IJF nie obejmuje tu wszystkich mistrzostw Polski oraz zawodów lokalnych. `numberOfResults` na stronie profilu liczy punktowane lokaty, a nie wszystkie uczestnictwa — dlatego nie jest właściwym testem kompletności całego zbioru.

## Osoby i liczby

| Osoba | IJF | Wszystkie rekordy | Zawody | Treningi | Lokaty w zawodach |
| --- | --- | ---: | ---: | ---: | ---: |
| Szymon Szulik | [67962](https://www.ijf.org/judoka/67962/results) | 37 | 29 | 8 | 17 |
| Dawid Szulik | [54183](https://www.ijf.org/judoka/54183/results) | 26 | 20 | 6 | 9 |
| Julia Kowalczyk | [19867](https://www.ijf.org/judoka/19867/results) | 111 | 94 | 17 | 33 |
| Szymon Panek | [69125](https://www.ijf.org/judoka/69125) | 5 | 5 | 0 | 0 |
| Patryk Żemła | [73699](https://www.ijf.org/judoka/73699) | 4 | 3 | 1 | 0 |
| Wiktoria Mołdrzyk | [75587](https://www.ijf.org/judoka/75587) | 4 | 4 | 0 | 0 |
| Igor Gabriel | [73700](https://www.ijf.org/judoka/73700) | 13 | 10 | 3 | 0 |
| Adrian Stefański | [73701](https://www.ijf.org/judoka/73701) | 6 | 5 | 1 | 0 |
| Konrad Liszka | [73702](https://www.ijf.org/judoka/73702) | 9 | 9 | 0 | 1 |
| Paweł Marek | [83460](https://www.ijf.org/judoka/83460) | 4 | 3 | 1 | 0 |

Identyfikację pozostałych osób potwierdzają nazwiska, imiona i polska narodowość na profilach oraz [oficjalna lista startowa Bielsko-Biała 2023](https://www.ijf.org/competition/2546/judoka_athletes). Zgodność klubowa wynika z oficjalnej listy klubu. Jej data aktualizacji nie jest podana; nie twierdzimy, że sam wpis jest kontraktowym potwierdzeniem statusu każdego zawodnika na sezon 2026/2027.

### Aktualizacja składu: Konrad Liszka i Paweł Marek

[Ranking PZ Judo](https://pzjudo.pl/strefa-sportowa/ranking/) wymienia obu jako zawodników Polonii Rybnik (rocznik 2008) i publikuje ich wyniki krajowe z 2026 r. Konrada potwierdza również [kadra narodowa juniorów 2026](https://pzjudo.pl/wp-content/uploads/2026/01/Kadra-Narodowa-Juniorzy.pdf): KS Polonia Rybnik, −66 kg, trener K. Mika. Identyfikatory IJF obu odczytano z bezpośrednich odnośników [listy startowej Bielsko-Biała 2025](https://www.ijf.org/competition/3035/judoka_athletes). Następnie pobrano pełne publiczne historie `/api/v1/competitors/73702/results` i `/83460/results`.

Jedyną opublikowaną lokatą Konrada w tej historii jest **brąz Riga Cadet European Cup 2024** (19–20.10.2024), nie medal z 2026 r. Data wygenerowania dostępnego PDF w 2026 r. nie zmienia daty zawodów. Jego dziewięć rekordów IJF kończy się na Bielsko-Białej 2025; krajowe starty w 2026 r. są potwierdzone osobno przez PZ Judo.

Paweł ma trzy uczestnictwa turniejowe i obóz Mittersill EJU OTC 2026, bez podanej lokaty. Waga −100 kg w nagłówku odpowiada juniorskim startom krajowym i obozowi z 2026 r.; wcześniejsze zawody kadetów mają kategorie +90 lub −90 kg. Jego stary widok IJF pokazujący −90 kg nie powinien nadpisywać wag poszczególnych rekordów.

Na oficjalnej stronie zawodników klubu nie znaleziono portretu Konrada ani Pawła. Nie zgadywano ścieżek plików i nie zastąpiono ich cudzym zdjęciem. Widok powinien obsługiwać brak fotografii.

## Ważne różnice względem poprzedniej wersji

- Najnowsza historia Dawida zawiera udział w ME U23 w Neapolu 30–31.10.2026 z wagą −90 kg i bez podanej lokaty. Wcześniejsza lista „Latest Results” nie pokazywała tego startu.
- Waga jest przypisana do konkretnego rekordu. Bieżący profil Dawida −90 kg nie zmienia historycznych startów w −81 kg.
- Profile pięciu pozostałych osób mają `numberOfResults = 0` i przekierowują zakładkę wyników do strony głównej profilu, lecz ich publiczne historie zawierają uczestnictwa. Nie wolno pokazywać komunikatu „zawodnik nie startował”.
- Wśród rekordów Szymona są obozy, więc 37 rekordów nie wolno opisać jako 37 startów turniejowych.

## Zdjęcie główne — nowsza referencja

Znaleziono materiał [Historyczny sukces Polonii Rybnik. Brązowy medal Drużynowych Mistrzostw Polski w judo](https://www.rybnik.com.pl/wiadomosci,historyczny-sukces-polonii-rybnik-brazowy-medal-druzynowych-mistrzostw-polski-w-judo,wia5-3270-66419.html), opublikowany **12.10.2026 o 20:54**, aktualizacja 20:57. Ma galerię sześciu zdjęć oznaczoną „Fot. Materiały prasowe”. To nowsza grupowa referencja niż zdjęcie dzieci opublikowane przez klub 3.09.2026. Portal zastrzega prawa do rozpowszechniania materiału; oznaczenie „materiały prasowe” nie jest samodzielną licencją. Nie skopiowano tych fotografii ani zdjęć IJF do repozytorium. Przed użyciem konkretnego pliku potrzebna jest zgoda właściciela lub potwierdzenie licencji.

Artykuł wymienia w medalowej drużynie również Konrada Liszkę i Pawła Marka. Ich aktualną przynależność klubową i tożsamość IJF potwierdzono osobno powyższymi źródłami pierwotnymi; obaj są teraz uwzględnieni w zbiorze.
