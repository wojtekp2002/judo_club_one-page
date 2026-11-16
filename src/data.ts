export const club = {
  phone: "+48 515 100 603",
  phoneHref: "tel:+48515100603",
  email: "poloniarybnik@poczta.onet.pl",
  facebook: "https://www.facebook.com/JudoZabawaRybnik/",
  website: "http://www.judorybnik.pl/",
};

export const locations = [
  {
    id: "centrum",
    name: "Centrum",
    venue: "Pawilon Judo MOSiR",
    address: "ul. Powstańców Śląskich 42",
    note: "Siedziba klubu · duża sala",
    query: "Pawilon judo Powstańców Śląskich 42 Rybnik",
    scheduleUrl:
      "http://www.judorybnik.pl/harmonogram/1-centrum-duza-sala.html",
    sessions: [
      { group: "GR 5", days: "Środa, piątek", time: "16:00–16:50" },
      { group: "GR 4", days: "Wtorek, czwartek", time: "16:15–17:15" },
      { group: "GR 3", days: "Wtorek, czwartek", time: "17:30–18:45" },
      {
        group: "GR 2",
        days: "Poniedziałek, środa, piątek",
        time: "17:00–18:30",
      },
      { group: "GR 1", days: "Poniedziałek, piątek", time: "18:45–20:30" },
      { group: "GR 1", days: "Wtorek", time: "19:00–20:30" },
      { group: "GR 1", days: "Środa · randori", time: "18:30–20:30" },
      { group: "GR 1", days: "Czwartek", time: "19:00–20:00" },
    ],
  },
  {
    id: "nowiny",
    name: "Nowiny",
    venue: "Aula Zespołu Szkół nr 3",
    address: "ul. Orzepowicka 15A",
    note: "Judo blisko domu — na Nowinach",
    query: "Zespół Szkół nr 3 Orzepowicka 15A Rybnik",
    scheduleUrl: "http://www.judorybnik.pl/harmonogram/3-nowiny.html",
    sessions: [
      { group: "GR 12", days: "Poniedziałek, czwartek", time: "16:15–17:05" },
      { group: "GR 11", days: "Poniedziałek, czwartek", time: "17:10–18:10" },
    ],
  },
  {
    id: "niedobczyce",
    name: "Niedobczyce",
    venue: "Szkoła Podstawowa nr 22",
    address: "ul. Boczna 17",
    note: "Treningi w dzielnicy Niedobczyce",
    query: "Szkoła Podstawowa 22 Boczna 17 Rybnik",
    scheduleUrl: "http://www.judorybnik.pl/harmonogram/4-niedobczyce.html",
    sessions: [
      { group: "GR 21", days: "Wtorek, czwartek", time: "16:10–17:00" },
      { group: "GR 22", days: "Wtorek, czwartek", time: "17:10–18:10" },
    ],
  },
  {
    id: "boguszowice",
    name: "Boguszowice",
    venue: "Szkoła Podstawowa nr 36",
    address: "ul. Sztolniowa 29B",
    note: "Nasza baza w Boguszowicach",
    query: "Szkoła Podstawowa 36 Sztolniowa 29B Rybnik",
    scheduleUrl: "http://www.judorybnik.pl/harmonogram/5-boguszowice.html",
    sessions: [
      { group: "GR 32", days: "Wtorek, piątek", time: "17:10–18:10" },
      { group: "GR 33", days: "Wtorek, piątek", time: "18:15–19:15" },
    ],
  },
];

export const news = [
  {
    id: "birmingham",
    category: "Wyniki",
    date: "27 lipca 2025",
    image: "/images/szymon-birmingham.jpg",
    alt: "Szymon Szulik ze złotym medalem w Birmingham",
    title: "Złoto Szymona Szulika w Birmingham",
    excerpt:
      "Kolejny mocny występ naszego zawodnika w Pucharze Europy Juniorów.",
    text: "Szymon Szulik zdobył złoty medal w Pucharze Europy Juniorów w Birmingham. To kolejny międzynarodowy sukces zawodnika KS Polonia Rybnik, po zwycięstwie w Stambule. Gratulujemy Szymonowi i jego trenerom.",
    url: "http://www.judorybnik.pl/news/275/zloto-szymona-szulika-w-birmingham--dzudoka-polonii-rybnik-zwycieza-w-pucharze-europy-juniorow.html",
  },
  {
    id: "zapisy",
    category: "Życie klubu",
    date: "3 września 2026",
    image: "/images/judo-kids.jpeg",
    alt: "Dzieci z KS Polonia Rybnik w judogach na klubowym wydarzeniu",
    title: "Judo dla 5-latka. Dobry początek w Rybniku",
    excerpt:
      "Zapraszamy dzieci od 5 lat. Wybierz jedną z czterech lokalizacji w Rybniku.",
    text: "Nie trzeba mieć doświadczenia ani własnej judogi, żeby zapytać o pierwszy trening. Klub prowadzi nabór dzieci od 5. roku życia. Zajęcia odbywają się w Centrum, na Nowinach, w Niedobczycach i Boguszowicach. Zadzwoń pod numer 515 100 603 — wspólnie dobierzemy grupę i potwierdzimy termin.",
    url: "http://www.judorybnik.pl/news/276/jakie-zajecia-dla-5-latka-w-rybniku--dlaczego-warto-wybrac-judo.html",
  },
  {
    id: "dubrovnik",
    category: "Wyniki",
    date: "8 kwietnia 2025",
    image: "/images/dawid-dubrovnik.jpg",
    alt: "Dawid Szulik po występie w Pucharze Europy w Dubrowniku",
    title: "Dawid Szulik na podium Pucharu Europy",
    excerpt: "Brązowy medal w Dubrowniku dopisujemy do klubowej historii.",
    text: "Dawid Szulik wywalczył brązowy medal podczas Pucharu Europy Seniorów w Dubrowniku. Więcej informacji o starcie i pozostałych wynikach znajdziesz w oficjalnym archiwum klubu.",
    url: "http://www.judorybnik.pl/news/272/brazowy-medal-dawida-szulika-w-dubrowniku.html",
  },
];
export type NewsItem = (typeof news)[number];

export const gallery = [
  {
    src: "/images/julia-kowalczyk.jpg",
    alt: "Julia Kowalczyk w białej judodze z polskim orłem",
    caption: "Julia Kowalczyk",
  },
  {
    src: "/images/szymon-szulik.jpg",
    alt: "Szymon Szulik w judodze z czarnym pasem",
    caption: "Szymon Szulik",
  },
  {
    src: "/images/dawid-szulik.jpg",
    alt: "Portret Dawida Szulika w klubowych materiałach Polonii Rybnik",
    caption: "Dawid Szulik",
  },
  {
    src: "/images/wiktoria-medal.jpg",
    alt: "Wiktoria Mołdrzyk z medalem Ogólnopolskiej Olimpiady Młodzieży",
    caption: "Wiktoria Mołdrzyk · medal OOM",
  },
];

export const faqs = [
  {
    question: "Od jakiego wieku można zacząć?",
    answer:
      "Zapraszamy dzieci od 5. roku życia. Przy doborze grupy uwzględniamy wiek i dotychczasowe doświadczenie. Najlepiej zadzwonić do klubu, aby ustalić odpowiednią grupę i lokalizację.",
  },
  {
    question: "Co zabrać na pierwszy trening?",
    answer:
      "Na początek przygotuj wygodny strój sportowy bez zamków i twardych elementów, wodę oraz klapki do przejścia z szatni. Na macie ćwiczymy boso. Przed wizytą potwierdź z klubem termin i szczegóły pierwszych zajęć.",
  },
  {
    question: "Ile kosztują zajęcia?",
    answer:
      "W opublikowanej ofercie składka wynosi 170 zł miesięcznie za pierwsze dziecko, 119 zł za drugie i 17 zł za trzecie. Kolejne dzieci z rodziny są zwolnione ze składki. Aktualne warunki oraz ewentualne dodatkowe opłaty potwierdź w klubie przed zapisem.",
  },
  {
    question: "Czy trzeba od razu kupić judogę?",
    answer:
      "Przed zakupem skontaktuj się z trenerem. Pomoże ustalić, kiedy judoga będzie potrzebna i jak dobrać jej rozmiar. Na pierwszą wizytę przygotuj wygodny strój sportowy.",
  },
  {
    question: "Czy można dołączyć w trakcie roku?",
    answer:
      "Tak — nabór prowadzimy przez cały rok. Skontaktuj się z nami, aby sprawdzić dostępność miejsc w wybranej lokalizacji i ustalić grupę dopasowaną do dziecka.",
  },
];
