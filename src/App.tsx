import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Phone,
  MapPin,
  Mail,
  Clock3,
  Check,
  Copy,
  ExternalLink,
  CalendarDays,
  Download,
  Facebook,
} from "lucide-react";
import { club, locations, news, gallery, faqs, type NewsItem } from "./data";
import ResultsArchive from "./ResultsArchive";
import People from "./People";
import DojoJourney from "./DojoJourney";
import usePageMotion from "./usePageMotion";

type ModalState =
  | { kind: "join" }
  | { kind: "news"; item: NewsItem }
  | { kind: "gallery"; index: number }
  | { kind: "camp" }
  | { kind: "privacy" }
  | null;

function SectionLabel({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`section-label${light ? " light" : ""}`}>
      <span className="belt-mark" aria-hidden="true" />
      {children}
    </div>
  );
}

function App() {
  usePageMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState("centrum");
  const [group, setGroup] = useState("all");
  const [filter, setFilter] = useState("Wszystkie");
  const [modal, setModal] = useState<ModalState>(null);
  const [formReady, setFormReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [mailUrl, setMailUrl] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const readyRef = useRef<HTMLHeadingElement>(null);
  const location = locations.find((item) => item.id === activeLocation)!;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (modal && dialog && !dialog.open) dialog.showModal();
    if (!modal && dialog?.open) dialog.close();
    document.body.style.overflow = modal || menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal, menuOpen]);

  useEffect(() => {
    if (formReady) readyRef.current?.focus();
  }, [formReady]);

  function selectLocation(id: string) {
    setActiveLocation(id);
    setGroup("all");
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        closeModal();
      }
      if (
        modal?.kind === "gallery" &&
        ["ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        event.preventDefault();
        setModal({
          kind: "gallery",
          index:
            (modal.index +
              (event.key === "ArrowRight" ? 1 : gallery.length - 1)) %
            gallery.length,
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  function closeModal() {
    setModal(null);
    setMessage("");
    setMailUrl("");
    setFormValues({});
    setCopied(false);
  }

  const openJoin = () => {
    setFormValues({});
    setMessage("");
    setMailUrl("");
    setFormReady(false);
    setCopied(false);
    setMenuOpen(false);
    setModal({ kind: "join" });
  };

  function prepareMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCopied(false);
    const data = new FormData(event.currentTarget);
    setFormValues(
      Object.fromEntries(
        [...data.entries()].map(([key, value]) => [key, String(value)]),
      ),
    );
    const text = `Dzień dobry,\n\nchcę zapytać o pierwszy trening judo w KS Polonia Rybnik.\n\nImię rodzica / opiekuna: ${data.get("parent")}\nWiek dziecka: ${data.get("age")}\nLokalizacja: ${data.get("location")}\nTelefon kontaktowy: ${data.get("phone")}\nDodatkowe informacje: ${data.get("note") || "Brak"}\n\nProszę o informację o grupie, wolnych miejscach i terminie pierwszych zajęć.\n\nPozdrawiam,\n${data.get("parent")}`;
    setMessage(text);
    setMailUrl(
      `mailto:${club.email}?subject=${encodeURIComponent("Pierwszy trening judo — zapytanie")}&body=${encodeURIComponent(text)}`,
    );
    setFormReady(true);
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Przejdź do treści
      </a>
      <div className="topbar">
        <div className="shell topbar-inner">
          <span>Na rybnickiej macie od 1991 roku</span>
          <a href={club.phoneHref}>
            <Phone />
            Zapisy: 515 100 603
            <ArrowUpRight />
          </a>
        </div>
      </div>
      <header className="header">
        <div className="shell header-inner">
          <a
            className="brand"
            href="#"
            aria-label="KS Polonia Rybnik — strona główna"
          >
            <img src="/images/logo.png" width="52" height="52" alt="" />
            <span>
              POLONIA RYBNIK<small>KLUB SPORTOWY · JUDO</small>
            </span>
          </a>
          <nav
            className={menuOpen ? "main-nav is-open" : "main-nav"}
            id="main-nav"
            aria-label="Nawigacja główna"
          >
            {[
              ["Klub", "#klub"],
              ["Treningi", "#treningi"],
              ["Aktualności", "#aktualnosci"],
              ["Kadra", "#kadra"],
              ["Obozy", "#obozy"],
              ["Kontakt", "#kontakt"],
            ].map(([label, href]) => (
              <a href={href} key={href} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <button className="button button-red nav-join" onClick={openJoin}>
              Dołącz do klubu
              <ArrowUpRight />
            </button>
          </nav>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-photo">
            <img
              src="/images/judo-kids.jpeg"
              alt="Młodzi judocy Polonii Rybnik podczas klubowego wydarzenia"
              fetchPriority="high"
              width="1600"
              height="1200"
            />
          </div>
          <div className="hero-shade" />
          <div className="shell hero-inner">
            <div className="hero-content">
              <SectionLabel light>
                KS Polonia Rybnik · od 1991 roku
              </SectionLabel>
              <h1 id="hero-title" aria-label="Judo po rybnicku">
                <span className="hero-line" aria-hidden="true">
                  <span>JUDO.</span>
                </span>
                <span className="hero-line" aria-hidden="true">
                  <span>PO</span>
                </span>
                <span className="hero-line" aria-hidden="true">
                  <span>RYBNICKU.</span>
                </span>
              </h1>
              <p>
                Treningi dla dzieci od 5 lat i młodzieży.
                <br className="desktop-break" /> Cztery dzielnice Rybnika. Jedna
                Polonia.
              </p>
              <div className="hero-actions">
                <button className="button button-red" onClick={openJoin}>
                  Przyjdź na pierwszy trening
                  <ArrowUpRight />
                </button>
                <a className="hero-secondary" href="#treningi">
                  Znajdź swoją grupę
                  <ArrowDown />
                </a>
              </div>
            </div>
            <div className="hero-caption">
              <span>Rybnik, Polska</span>
              <span>Młodzi judocy / KS Polonia Rybnik</span>
            </div>
            <a
              className="hero-scroll"
              href="#klub"
              aria-label="Poznaj nasz klub"
            >
              <ArrowDown />
            </a>
          </div>
        </section>

        <div className="club-facts">
          <div className="shell facts-inner">
            <span className="district-label">
              Znajdź nas w swojej dzielnicy
            </span>
            <p>
              Centrum <span>/</span> Nowiny <span>/</span> Niedobczyce{" "}
              <span>/</span> Boguszowice
            </p>
            <a href="#treningi">
              Zobacz sale i grafik
              <ArrowUpRight />
            </a>
          </div>
        </div>

        <section className="section intro shell" id="klub">
          <div className="intro-copy">
            <SectionLabel>Na naszej macie</SectionLabel>
            <h2 className="editorial-title" data-reveal="text">
              Dzieci trenują.
              <br />
              Rodzice kibicują.
            </h2>
            <p className="lead">
              Jedni wiążą pas po raz pierwszy.
              <br />
              Inni wracają z medalami.
            </p>
            <p>
              W Polonii Rybnik uczymy judo od 1991 roku. Dzieci zaczynają od
              zabawy, równowagi i współpracy. Z czasem przychodzą technika,
              odwaga i radość z własnych postępów.
            </p>
            <p>
              Na tej samej macie spotykają się początkujący i zawodnicy
              startujący w międzynarodowych turniejach. Łączy nas szacunek — do
              sportu, trenera i siebie nawzajem.
            </p>
            <a className="text-link" href="#zawodnicy">
              Poznaj ludzi Polonii
              <ArrowUpRight />
            </a>
          </div>
          <figure className="intro-image" data-reveal="image">
            <img
              src="/images/footer-original.jpg"
              alt="Wspólna zbiórka zawodników Polonii Rybnik w dojo"
              loading="lazy"
              width="1920"
              height="942"
            />
            <figcaption>
              <span>Od pierwszego treningu</span>
              <span>
                Razem na macie
                <ArrowUpRight />
              </span>
            </figcaption>
          </figure>
        </section>

        <DojoJourney onJoin={openJoin} />

        <section className="training-section" id="treningi">
          <div className="shell section">
            <div className="section-heading">
              <div>
                <SectionLabel>Znajdź swoją matę</SectionLabel>
                <h2 className="editorial-title">
                  Cztery sale.
                  <br />
                  Która jest po drodze?
                </h2>
              </div>
              <p>
                Cztery lokalizacje. Jeden klub.
                <br />
                Wybierz miejsce po drodze do domu.
              </p>
            </div>
            <div
              className="location-tabs"
              role="tablist"
              aria-label="Lokalizacje treningów"
            >
              {locations.map((item, index) => (
                <button
                  key={item.id}
                  id={`tab-${item.id}`}
                  role="tab"
                  aria-selected={activeLocation === item.id}
                  aria-controls="location-panel"
                  tabIndex={activeLocation === item.id ? 0 : -1}
                  className={activeLocation === item.id ? "active" : ""}
                  onClick={() => selectLocation(item.id)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowRight" ||
                      event.key === "ArrowLeft"
                    ) {
                      event.preventDefault();
                      const next =
                        (index + (event.key === "ArrowRight" ? 1 : 3)) % 4;
                      selectLocation(locations[next].id);
                      document
                        .getElementById(`tab-${locations[next].id}`)
                        ?.focus();
                    }
                  }}
                >
                  <span>0{index + 1}</span>
                  {item.name}
                  <ArrowUpRight />
                </button>
              ))}
            </div>
            <div
              className="location-panel"
              key={activeLocation}
              id="location-panel"
              role="tabpanel"
              aria-labelledby={`tab-${activeLocation}`}
            >
              <div className="location-info">
                <span className="location-neighborhood">
                  Rybnik / {location.name}
                </span>
                <h3>{location.venue}</h3>
                <p className="address">
                  <MapPin />
                  {location.address}
                </p>
                <p>{location.note}</p>
                <a
                  className="text-link"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.query)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Pokaż dojazd
                  <ArrowUpRight />
                </a>
                <div className="location-contact">
                  <Phone />
                  <span>
                    Dobierz grupę z klubem
                    <a href={club.phoneHref}>515 100 603</a>
                  </span>
                </div>
              </div>
              <div className="schedule">
                <div className="schedule-heading">
                  <h3>Zajęcia i grupy</h3>
                  <label className="select-wrap">
                    <span className="sr-only">Wybierz grupę</span>
                    <select
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                    >
                      <option value="all">Wszystkie grupy</option>
                      {[
                        ...new Set(
                          location.sessions.map((session) => session.group),
                        ),
                      ].map((name) => (
                        <option value={name} key={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown />
                  </label>
                </div>
                <div className="schedule-rows" aria-live="polite">
                  {location.sessions
                    .filter(
                      (session) => group === "all" || session.group === group,
                    )
                    .map((session, index) => (
                      <div
                        className="schedule-row"
                        key={session.group + session.days}
                      >
                        <span className="schedule-index">
                          {session.group.replace("GR ", "")}
                        </span>
                        <div>
                          <h4>{session.group}</h4>
                          <p>{session.days}</p>
                        </div>
                        <span className="schedule-time">{session.time}</span>
                      </div>
                    ))}
                </div>
                <p className="schedule-note">
                  <Clock3 />
                  <span>
                    Grafik według oficjalnej strony klubu. Przed pierwszą wizytą
                    potwierdź termin i dobór grupy — numer grupy nie określa
                    wieku dziecka.
                  </span>
                </p>
                {activeLocation === "centrum" && (
                  <p className="small-hall-note">
                    Mała sala: treningi indywidualne pon.–pt. 17:30–20:00, sob.
                    10:00–13:00.{" "}
                    <a
                      href="http://www.judorybnik.pl/harmonogram/2-centrum-mala-sala.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Szczegóły ↗
                    </a>
                  </p>
                )}
                <div className="schedule-bottom">
                  <a
                    className="text-link"
                    href={location.scheduleUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Oficjalny grafik
                    <ExternalLink />
                  </a>
                  <button className="button button-dark" onClick={openJoin}>
                    Zapytaj o miejsce
                    <ArrowUpRight />
                  </button>
                </div>
              </div>
            </div>
            <div className="training-bottom">
              <span>
                <span className="small-red-square" /> Nabór trwa przez cały rok
              </span>
              <a href="#pytania">
                Pierwszy trening? Sprawdź, co warto wiedzieć
                <ArrowRight />
              </a>
            </div>
          </div>
        </section>

        <section className="section shell news-section" id="aktualnosci">
          <div className="section-heading">
            <div>
              <SectionLabel>Z życia Polonii</SectionLabel>
              <h2 className="editorial-title">Klubowy dziennik</h2>
            </div>
            <a
              className="text-link"
              href={club.facebook}
              target="_blank"
              rel="noreferrer"
            >
              Najnowsze wieści na Facebooku
              <ArrowUpRight />
            </a>
          </div>
          <div className="news-toolbar">
            <div
              className="news-filters"
              role="group"
              aria-label="Filtruj aktualności"
            >
              {["Wszystkie", "Wyniki", "Życie klubu"].map((item) => (
                <button
                  aria-pressed={filter === item}
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
            <span className="news-archive-note">Wybrane historie klubu</span>
          </div>
          <div
            className={`news-grid ${filter === "Wszystkie" ? "news-editorial" : "news-filtered"}`}
            key={filter}
            aria-live="polite"
          >
            {news
              .filter(
                (item) => filter === "Wszystkie" || item.category === filter,
              )
              .map((item) => (
                <article className="news-card" key={item.id}>
                  <button
                    className="news-image-button"
                    onClick={() => setModal({ kind: "news", item })}
                    aria-label={`Czytaj: ${item.title}`}
                  >
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      width="900"
                      height="650"
                    />
                  </button>
                  <div className="news-meta">
                    <span>{item.category}</span>
                    <time>{item.date}</time>
                  </div>
                  <h3>
                    <button onClick={() => setModal({ kind: "news", item })}>
                      {item.title}
                    </button>
                  </h3>
                  <p>{item.excerpt}</p>
                </article>
              ))}
          </div>
        </section>

        <section className="camp-section" id="obozy">
          <div className="shell camp-inner">
            <div>
              <SectionLabel light>Poza szkolną ławką</SectionLabel>
              <h2 className="editorial-title" data-reveal="text">
                Ferie zimowe
                <br />z Polonią
              </h2>
              <p>
                Trening, przyjaźnie i przygoda. Organizujemy obozy sportowe i
                półkolonie dla dzieci — także tych, które jeszcze z nami nie
                trenują.
              </p>
              <button
                className="button button-light"
                onClick={() => setModal({ kind: "camp" })}
              >
                Poznaj zimowe półkolonie
                <ArrowUpRight />
              </button>
            </div>
            <div className="camp-poster">
              <div className="poster-top">
                <span>POLONIA / ZIMA 2027</span>
                <CalendarDays />
              </div>
              <h3>
                FERIE
                <br />
                NA SPORTOWO.
              </h3>
              <div className="poster-details">
                <span>
                  Dla dzieci
                  <br />
                  <strong>6–12 lat</strong>
                </span>
                <span>
                  Dwa turnusy
                  <br />
                  <strong>18–22 i 25–29.01</strong>
                </span>
              </div>
              <button
                onClick={() => setModal({ kind: "camp" })}
                className="poster-footer"
              >
                Sprawdź terminy i szczegóły
                <ArrowUpRight />
              </button>
            </div>
          </div>
        </section>

        <People onJoin={openJoin} />
        <ResultsArchive />
        <section className="shell portrait-archive" id="nasza-druzyna">
          <details>
            <summary>Archiwum portretów klubu</summary>
            <div className="gallery-grid">
              {gallery.map((item, index) => (
                <button
                  key={item.src}
                  onClick={() => setModal({ kind: "gallery", index })}
                  aria-label={`Otwórz zdjęcie: ${item.caption}`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    width="480"
                    height="360"
                  />
                  <span>
                    {item.caption}
                    <ArrowUpRight />
                  </span>
                </button>
              ))}
            </div>
          </details>
        </section>

        <section className="faq-section" id="pytania">
          <div className="shell section faq-inner">
            <div>
              <SectionLabel>Dobry początek</SectionLabel>
              <h2 className="editorial-title">
                Przed pierwszym
                <br />
                treningiem
              </h2>
              <p>
                Masz jeszcze inne pytanie?
                <br />
                <a className="text-link" href={club.phoneHref}>
                  Porozmawiajmy
                  <ArrowUpRight />
                </a>
              </p>
            </div>
            <div className="faq-list">
              {faqs.map((item, index) => (
                <details key={item.question}>
                  <summary>
                    <span className="faq-number">0{index + 1}</span>
                    {item.question}
                    <span className="faq-plus" aria-hidden="true" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="shell documents-strip">
            <span>Przygotuj się do zapisu</span>
            <a href="/documents/deklaracja-czlonkowska.pdf" download>
              Deklaracja członkowska · PDF
              <Download />
            </a>
            <a
              href="http://www.judorybnik.pl/info/29/Zapisy.html"
              target="_blank"
              rel="noreferrer"
            >
              Składki i zasady zapisów
              <ArrowUpRight />
            </a>
          </div>
        </section>

        <section className="contact-section" id="kontakt">
          <div className="shell section contact-inner">
            <div>
              <SectionLabel light>Do zobaczenia na macie</SectionLabel>
              <h2 className="editorial-title" data-reveal="text">
                Porozmawiajmy
                <br />o treningu
              </h2>
              <button className="button button-light" onClick={openJoin}>
                Zapytaj o pierwszy trening
                <ArrowUpRight />
              </button>
            </div>
            <div className="contact-details">
              <a className="contact-phone" href={club.phoneHref}>
                515 100 603
                <ArrowUpRight />
              </a>
              <a href={`mailto:${club.email}`}>
                <Mail />
                {club.email}
              </a>
              <p>
                <MapPin />
                <span>
                  KS Polonia Rybnik
                  <br />
                  ul. Powstańców Śląskich 42
                  <br />
                  44-200 Rybnik
                </span>
              </p>
              <a
                className="contact-social"
                href={club.facebook}
                target="_blank"
                rel="noreferrer"
              >
                <Facebook />
                Śledź życie klubu
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell">
          <div className="footer-top">
            <a className="brand footer-brand" href="#">
              <img src="/images/logo.png" width="52" height="52" alt="" />
              <span>
                POLONIA RYBNIK<small>KLUB SPORTOWY · JUDO OD 1991</small>
              </span>
            </a>
            <p>
              Judo współfinansowane
              <br />
              ze środków Miasta Rybnik
            </p>
            <a
              href="https://www.rybnik.eu/"
              target="_blank"
              rel="noreferrer"
              className="rybnik-wordmark"
            >
              Rybnik<span>miasto z ikrą</span>
              <ArrowUpRight />
            </a>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} KS Polonia Rybnik</span>
            <div>
              <a
                href="http://www.judorybnik.pl/"
                target="_blank"
                rel="noreferrer"
              >
                Oficjalne archiwum
                <ArrowUpRight />
              </a>
              <button onClick={() => setModal({ kind: "privacy" })}>
                Prywatność
              </button>
              <a href="#">Do góry ↑</a>
            </div>
          </div>
        </div>
      </footer>

      <dialog
        ref={dialogRef}
        className={`dialog ${modal?.kind === "gallery" ? "gallery-dialog" : ""}`}
        onCancel={() => closeModal()}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}
        aria-labelledby="dialog-title"
      >
        <div className="dialog-content">
          <button
            className="dialog-close"
            onClick={() => closeModal()}
            aria-label="Zamknij okno"
          >
            <X />
          </button>
          {modal?.kind === "join" && (
            <>
              <SectionLabel>Pierwszy trening</SectionLabel>
              <h2 id="dialog-title">
                ZACZNIJMY
                <br />
                OD ROZMOWY.
              </h2>
              {!formReady ? (
                <>
                  <p>
                    Podaj kilka szczegółów. Przygotujemy wiadomość do klubu,
                    którą wyślesz ze swojej poczty. Termin i miejsce potwierdzi
                    klub.
                  </p>
                  <form onSubmit={prepareMessage} className="join-form">
                    <label>
                      Imię rodzica lub opiekuna
                      <input
                        name="parent"
                        defaultValue={formValues.parent}
                        autoComplete="given-name"
                        required
                        maxLength={80}
                        placeholder="Twoje imię"
                      />
                    </label>
                    <div className="form-row">
                      <label>
                        Wiek dziecka
                        <input
                          name="age"
                          defaultValue={formValues.age}
                          type="number"
                          min="5"
                          max="99"
                          required
                          placeholder="Np. 7"
                        />
                      </label>
                      <label>
                        Telefon kontaktowy
                        <input
                          name="phone"
                          defaultValue={formValues.phone}
                          type="tel"
                          autoComplete="tel"
                          required
                          minLength={9}
                          maxLength={20}
                          title="Wpisz numer telefonu (9–20 znaków)"
                          placeholder="Np. 515 100 603"
                        />
                      </label>
                    </div>
                    <label>
                      Lokalizacja
                      <select
                        aria-label="Lokalizacja"
                        name="location"
                        defaultValue={formValues.location || location.name}
                      >
                        {locations.map((item) => (
                          <option key={item.id}>{item.name}</option>
                        ))}
                        <option>Pomóżcie mi wybrać</option>
                      </select>
                    </label>
                    <label>
                      Dodatkowe informacje <span>(opcjonalnie)</span>
                      <textarea
                        name="note"
                        defaultValue={formValues.note}
                        maxLength={1000}
                        rows={2}
                        placeholder="Czy dziecko trenowało wcześniej judo?"
                      />
                    </label>
                    <p className="form-info">
                      Dane pozostają w tej przeglądarce do zamknięcia
                      formularza. Strona nie zapisuje ani nie wysyła zgłoszeń.
                    </p>
                    <button className="button button-red" type="submit">
                      Przygotuj wiadomość
                      <ArrowRight />
                    </button>
                  </form>
                </>
              ) : (
                <div className="message-ready">
                  <span className="ready-icon">
                    <Check />
                  </span>
                  <h3 ref={readyRef} tabIndex={-1}>
                    Wiadomość jest gotowa
                  </h3>
                  <p>
                    Otwórz swoją pocztę i wyślij zapytanie. Jeśli nie masz
                    skonfigurowanej aplikacji pocztowej, skopiuj treść i wyślij
                    ją na <b>{club.email}</b>.
                  </p>
                  <textarea
                    aria-label="Treść wiadomości do klubu"
                    value={message}
                    readOnly
                    rows={8}
                  />
                  <a className="button button-red" href={mailUrl}>
                    Otwórz pocztę
                    <Mail />
                  </a>
                  <button
                    className="button button-outline"
                    onClick={copyMessage}
                  >
                    {copied ? "Skopiowano wiadomość" : "Kopiuj treść"}
                    {copied ? <Check /> : <Copy />}
                  </button>
                  <span role="status" className="sr-only">
                    {copied ? "Treść wiadomości skopiowana" : ""}
                  </span>
                  <button
                    className="back-button"
                    onClick={() => setFormReady(false)}
                  >
                    Wróć do formularza
                  </button>
                </div>
              )}
              <a className="dialog-phone" href={club.phoneHref}>
                <Phone />
                Wolisz zadzwonić? 515 100 603
              </a>
            </>
          )}
          {modal?.kind === "news" && (
            <>
              <img
                className="dialog-news-image"
                src={modal.item.image}
                alt={modal.item.alt}
              />
              <div className="news-meta">
                <span>{modal.item.category}</span>
                <time>{modal.item.date}</time>
              </div>
              <h2 className="news-dialog-title" id="dialog-title">
                {modal.item.title}
              </h2>
              <p>{modal.item.text}</p>
              <a
                className="button button-dark"
                target="_blank"
                rel="noreferrer"
                href={modal.item.url}
              >
                Oficjalne źródło
                <ArrowUpRight />
              </a>
            </>
          )}
          {modal?.kind === "camp" && (
            <>
              <SectionLabel>Zima z Polonią / 2027</SectionLabel>
              <h2 id="dialog-title">
                FERIE
                <br />
                NA SPORTOWO.
              </h2>
              <p>
                Sportowe półkolonie dla dzieci w wieku 6–12 lat. Ruch i zajęcia
                w gronie rówieśników pod opieką kadry klubu.
              </p>
              <div className="camp-modal-info">
                <div>
                  <CalendarDays />
                  <span>
                    I turnus<strong>18–22 stycznia 2027</strong>
                  </span>
                </div>
                <div>
                  <CalendarDays />
                  <span>
                    II turnus<strong>25–29 stycznia 2027</strong>
                  </span>
                </div>
                <div>
                  <Clock3 />
                  <span>
                    Opieka<strong>7:30–16:00</strong>
                  </span>
                </div>
                <div>
                  <span className="price-label">PLN</span>
                  <span>
                    Cena za turnus<strong>800 zł</strong>
                  </span>
                </div>
              </div>
              <p className="form-info">
                Dostępność miejsc, program i warunki rezerwacji potwierdź
                bezpośrednio z klubem. Informacje pochodzą z opublikowanej
                oferty półkolonii 2027.
              </p>
              <a className="button button-red" href={club.phoneHref}>
                Zapytaj o półkolonie
                <Phone />
              </a>
              <a
                className="text-link camp-source"
                href="http://www.judorybnik.pl/info/46/judo-polkolonie-2026.html"
                target="_blank"
                rel="noreferrer"
              >
                Pełna oferta klubu
                <ExternalLink />
              </a>
              <a
                className="text-link camp-source"
                href="/documents/karta-kwalifikacyjna.doc"
                download
              >
                Karta kwalifikacyjna · DOC
                <Download />
              </a>
            </>
          )}
          {modal?.kind === "gallery" && (
            <>
              <h2 id="dialog-title" className="sr-only">
                {gallery[modal.index].caption}
              </h2>
              <img
                className="gallery-full-image"
                src={gallery[modal.index].src}
                alt={gallery[modal.index].alt}
              />
              <div className="gallery-controls">
                <p>
                  {gallery[modal.index].caption}
                  <small>
                    {modal.index + 1} / {gallery.length}
                  </small>
                </p>
                <button
                  aria-label="Poprzednie zdjęcie"
                  onClick={() =>
                    setModal({
                      kind: "gallery",
                      index:
                        (modal.index + gallery.length - 1) % gallery.length,
                    })
                  }
                >
                  <ChevronLeft />
                </button>
                <button
                  aria-label="Następne zdjęcie"
                  onClick={() =>
                    setModal({
                      kind: "gallery",
                      index: (modal.index + 1) % gallery.length,
                    })
                  }
                >
                  <ChevronRight />
                </button>
              </div>
            </>
          )}
          {modal?.kind === "privacy" && (
            <>
              <SectionLabel>Informacje o stronie</SectionLabel>
              <h2 id="dialog-title">
                TWOJA
                <br />
                PRYWATNOŚĆ.
              </h2>
              <p>
                Ta lokalna wersja strony nie używa plików cookies, narzędzi
                analitycznych ani reklamowych. Fonty i zdjęcia są przechowywane
                lokalnie.
              </p>
              <p>
                Formularz pierwszego treningu wyłącznie przygotowuje treść
                wiadomości. Wpisane dane nie trafiają na serwer. Wiadomość
                wysyłasz samodzielnie we własnej aplikacji pocztowej, zgodnie z
                jej zasadami prywatności.
              </p>
              <p>
                Linki do map, mediów społecznościowych i oficjalnej strony
                otwierają zewnętrzne serwisy, które stosują własne zasady
                prywatności.
              </p>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
export default App;
