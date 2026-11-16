# Droga po pas — materiały wizualne

Odczyt źródeł: 16.11.2026. Pliki `src/belt-program.json`, `src/beltGuideData.ts` i `src/belt-media.json` oddzielają wymaganie egzaminacyjne od dostępnego materiału wizualnego.

## Źródła pierwotne

- [Oficjalny wykaz Kodokan](https://www.kodokan.org/en/techniques/names-of-judo-techniques/) — odczytano statyczne nazwy i odnośniki do filmów na oficjalnym kanale. Skrypt nie wykonuje pobranego HTML ani jego skryptów. Przeniesiono jedynie nazwy i publiczne identyfikatory filmów, bez opisów wykonania i bez pobierania nagrań.
- [Ukemi — oficjalny kanał Kodokan](https://www.youtube.com/watch?v=VoktcQAxEPg), publikacja 13.04.2020 — ogólny zestaw ukemi. Nie jest osobnym filmem dla każdego wariantu z programu KYU; interfejs to wyjaśnia.
- [Sasae-tsurikomi-ashi — Kodokan](https://www.youtube.com/watch?v=699i--pvYmE), publikacja 20.08.2020 — potwierdzony osobno. Główny wykaz prowadził dla tej nazwy do starej strony, zamiast bezpośrednio do filmu.
- [IJF o oficjalnym kanale Kodokan i wspólnych materiałach](https://www.ijf.org/news/show/kodokan-launched-official-youtube-channel) — potwierdzenie pochodzenia serii edukacyjnej.
- [Oficjalna pomoc YouTube: osadzanie](https://support.google.com/youtube/answer/171780) i [zasady odtwarzacza](https://developers.google.com/youtube/terms/developer-policies) — źródło sposobu osadzenia, trybu privacy-enhanced i przekazywania Referer.

## Udostępnienie i zakres

Materiały pozostają w serwisie właściciela. Nie pobrano filmów, nie utworzono lokalnych GIF-ów ani kopii klatek. Podglądy używają miniatur platformy `i.ytimg.com`; na stronie widnieje Kodokan/YouTube i odnośnik do oryginału. Odtwarzacz `youtube-nocookie.com` jest tworzony dopiero po kliknięciu, bez autoplay, z prawidłowym Referer. Zachowuje oznaczenia i kontrolki YouTube. W źródłach i prywatności podstrony są linki do warunków YouTube i polityki Google.

Nie zadeklarowano, że tryb privacy-enhanced oznacza brak wszystkich zewnętrznych żądań: miniatura ładuje się wraz ze stroną, a film korzysta z platformy zewnętrznej. Zamknięcie lub zmiana materiału usuwa odtwarzacz. Dostępność może zmienić właściciel filmu; pozostaje odnośnik YouTube.

Lista nie przypisuje przypadkowego filmu wariantom Mune-gatame, Kuzure-yoko-shiho-gatame lub Ushiro-ude-garami. Przy pozycjach bez dopasowanego materiału panel pokazuje nazwę i właściwą stronę regulaminu. Duszenia i dźwignie zachowują nazwy w programie; przewodnik nie podaje instrukcji wykonania ani demonstracji tych pozycji. Hon-kesa-gatame używa materiału podstawowego Kesa-gatame.

Ilustracja pasa jest własnym SVG, nie fotografią klubu ani skopiowaną grafiką PZ Judo. Kolory odzwierciedlają oznaczenia stopni, nie formalną ocenę postępów. Zmiana koloru oraz jednorazowe odsłonięcie szwu są informacją zwrotną wyboru. Przy `prefers-reduced-motion` przejścia i animacja są wyłączone.

## Kontrola

W lokalnym Chrome potwierdzono załadowanie miniatury Ukemi oraz prawdziwego odtwarzacza: tytuł „Ukemi - YouTube”, bez widocznego błędu odtwarzacza. Nie twierdzimy, że ręcznie obejrzano wszystkie nagrania. Test automatyczny kontroluje wybór właściwego ID, brak automatycznego wczytywania iframe, brak autoplay i zmianę materiału; sam iframe jest w nim zastępowany lokalną odpowiedzią, żeby CI nie zależało od zewnętrznego odtwarzania. Statyczny wydruk zawiera pełny wybrany program i źródło, bez zewnętrznych klatek.

Potwierdzono także scenariusz prawdziwego filmu Sasae-tsurikomi-ashi, wyszukiwania, ponownego rozwinięcia wcześniejszych stopni i otwarcia notesu. Syntetyczny iframe w Chrome przechwytywał kliknięcie po długim przewinięciu; rzeczywisty odtwarzacz nie odtwarzał tego problemu. Dlatego test granicy zewnętrznego iframe działa w osobnej karcie, a testy pozostałych kontrolek pozostają niezależne od jego imitacji. Załadowany odtwarzacz ma zwykłe pozycjonowanie; przypinany może być jedynie podgląd przed uruchomieniem.
