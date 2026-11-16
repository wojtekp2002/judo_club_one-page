import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronRight,
  Copy,
  ExternalLink,
  Play,
  Printer,
  Search,
  X,
} from "lucide-react";
import {
  belts,
  requirements,
  danRequirements,
  normalize,
  kyuSource,
  danSource,
  kodokanSource,
  type Technique,
} from "./beltGuideData";
import "./belt-guide.css";

const storageKey = "polonia-belt-review-v1";
function initialBelt() {
  const id = new URLSearchParams(location.hash.split("?")[1]).get("pas");
  return id === "dan" || belts.some((b) => b.id === id) ? id! : "6";
}
function loadNotes(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(saved)
      ? saved.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}
function BeltDrawing({ colors, label }: { colors: string[]; label: string }) {
  const clipId = useId();
  return (
    <svg
      className="guide-belt-drawing"
      viewBox="0 0 640 300"
      role="img"
      aria-label={`Ilustracja pasa: ${label}`}
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M45 92 Q320 72 595 92 L595 144 Q320 124 45 144Z M278 123 L243 264 L298 278 L330 135Z M314 128 L361 272 L417 253 L366 110Z M278 91 L360 84 L380 138 L298 151Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path fill={colors[0]} d="M0 0H640V300H0Z" />
        <path fill={colors[1]} d="M0 118H640V300H0Z" />
        <g fill="none" stroke="#171918" strokeOpacity=".22" strokeWidth="1.5">
          <path d="M45 99Q320 79 595 99M45 108Q320 88 595 108M45 135Q320 115 595 135M286 130L252 261M297 135L265 264M341 137L382 258M352 133L395 255" />
        </g>
        <path d="M304 130L300 150L369 134L361 114Z" fill="#000" opacity=".12" />
      </g>
      <g fill="none" stroke="#171918" strokeOpacity=".2" strokeWidth="1.5">
        <path d="M45 92Q320 72 595 92L595 144Q320 124 45 144ZM278 123L243 264L298 278L330 135M314 128L361 272L417 253L366 110M278 91L360 84L380 138L298 151Z" />
      </g>
      <path d="M256 235L307 248L302 269L251 256Z" fill="#171918" />
      <path
        key={label}
        className="guide-belt-stitch"
        pathLength="1"
        d="M267 241L285 246M265 247L283 252"
        stroke="#d3333d"
        strokeWidth="3"
      />
    </svg>
  );
}

function TechniqueMedia({ technique }: { technique: Technique }) {
  const [loaded, setLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    setLoaded(false);
    setImageFailed(false);
  }, [technique.id]);
  return (
    <aside
      className="guide-media"
      data-player-loaded={loaded}
      aria-label="Materiał wybranej techniki"
    >
      <div className="guide-media-heading">
        <span>Obejrzyj i wróć na matę</span>
        <span>Kodokan / materiał źródłowy</span>
      </div>
      <div className="guide-video-stage">
        {technique.videoId ? (
          loaded ? (
            <iframe
              key={technique.videoId}
              title={`Kodokan: ${technique.name}`}
              src={`https://www.youtube-nocookie.com/embed/${technique.videoId}?rel=0`}
              allow="fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              className="guide-video-cover"
              onClick={() => setLoaded(true)}
              aria-label={`Wczytaj film Kodokan: ${technique.name}`}
            >
              {!imageFailed && (
                <img
                  src={`https://i.ytimg.com/vi/${technique.videoId}/hqdefault.jpg`}
                  width="480"
                  height="360"
                  alt={`Podgląd filmu Kodokan: ${technique.name}`}
                  onError={() => setImageFailed(true)}
                />
              )}
              <span className="guide-play">
                <Play aria-hidden="true" />
                Wczytaj film
              </span>
            </button>
          )
        ) : (
          <div className="guide-tech-note">
            <span>
              {technique.group === "Podstawy"
                ? "Dojo / podstawy"
                : "Program / nazewnictwo"}
            </span>
            <strong>{technique.name}</strong>
            <p>
              {technique.group === "Podstawy"
                ? "Ten element omówisz i przećwiczysz podczas zajęć w klubie."
                : "Wymaganie z programu PZ Judo. Ten atlas obejmuje nazwę; wykonanie i wariant ustalasz na macie z trenerem."}
            </p>
            <a
              href={`${kyuSource}#page=${technique.page}`}
              target="_blank"
              rel="noreferrer"
            >
              Zobacz wymaganie w PDF <ArrowUpRight />
            </a>
          </div>
        )}
      </div>
      <div className="guide-media-caption">
        <div>
          <p>
            {technique.group} / {technique.grade}
          </p>
          <h3 aria-live="polite">{technique.name}</h3>
        </div>
        {technique.videoId && (
          <a
            href={`https://www.youtube.com/watch?v=${technique.videoId}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Otwórz film ${technique.name} na YouTube`}
          >
            <ExternalLink />
          </a>
        )}
      </div>
      {technique.videoId && (
        <p className="guide-video-note">
          Podgląd: Kodokan / YouTube. Odtwarzacz zewnętrzny wczytasz
          przyciskiem. Gdy film się nie otwiera, użyj odnośnika YouTube.
        </p>
      )}
      {technique.videoId === "VoktcQAxEPg" && (
        <p className="guide-video-note">
          Film pokazuje ogólny zestaw ukemi. Zakres dla wybranego stopnia
          określa program i trener.
        </p>
      )}
      <div className="guide-dojo-note">
        <span className="belt-mark" aria-hidden="true" />
        <p>Na ekranie poznajesz nazwy. Na macie ćwiczysz z trenerem.</p>
        <a href="/#kontakt">
          Zapytaj w klubie <ArrowUpRight />
        </a>
      </div>
    </aside>
  );
}

export default function BeltGuide() {
  const [beltId, setBeltId] = useState(initialBelt);
  const [cumulative, setCumulative] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("Wszystkie");
  const [reviewed, setReviewed] = useState<string[]>(loadNotes);
  const [saveFailed, setSaveFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const resetDialog = useRef<HTMLDialogElement>(null);
  const [selectedId, setSelectedId] = useState("ukemi-z-pozycji-kucznej");
  const belt = belts.find((b) => b.id === beltId) || belts[0];
  const isDan = beltId === "dan";
  const list = requirements(beltId, cumulative);
  const selected =
    list.find((t) => t.id === selectedId) ||
    list.find((t) => t.videoId) ||
    list[0];
  const visible = list.filter(
    (t) =>
      (group === "Wszystkie" || t.group === group) &&
      normalize(t.name).includes(normalize(query)),
  );
  const done = list.filter((t) => reviewed.includes(t.id)).length;
  const allProgram = requirements(beltId, true);
  const colors = isDan ? ["#242522", "#242522"] : belt.colors;
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content");
    document.title =
      "Droga po pas — wymagania judo KYU i DAN | KS Polonia Rybnik";
    meta?.setAttribute(
      "content",
      "Wybierz pas judo, poznaj program PZ Judo, obejrzyj materiały Kodokan i zapisz własną listę powtórek.",
    );
    return () => {
      document.title = previousTitle;
      if (previousDescription)
        meta?.setAttribute("content", previousDescription);
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviewed));
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  }, [reviewed]);
  useEffect(() => {
    const sync = () => {
      setBeltId(initialBelt());
      setQuery("");
      setGroup("Wszystkie");
      setSelectedId("");
      setCopied(false);
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  function choose(id: string) {
    setBeltId(id);
    setQuery("");
    setGroup("Wszystkie");
    setCumulative(false);
    setSelectedId(id === "6" ? "ukemi-z-pozycji-kucznej" : "");
    setCopied(false);
    setCopyFailed(false);
    history.replaceState(
      null,
      "",
      `${location.pathname}${location.search}#/droga-po-pas?pas=${id}`,
    );
  }
  async function share() {
    const url = new URL(location.href);
    url.hash = `/droga-po-pas?pas=${beltId}`;
    try {
      await navigator.clipboard.writeText(url.href);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  }
  function toggle(id: string) {
    setReviewed((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  }
  function selectTechnique(id: string) {
    setSelectedId(id);
    if (matchMedia("(max-width:600px)").matches)
      requestAnimationFrame(() =>
        document.querySelector(".guide-media")?.scrollIntoView({
          block: "start",
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        }),
      );
  }
  return (
    <div className="belt-guide">
      <a
        className="skip-link"
        href="#guide-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("guide-main")?.focus();
        }}
      >
        Przejdź do programu
      </a>
      <header className="guide-header">
        <div className="shell">
          <a href="/" className="guide-brand">
            <img src="/images/logo.png" alt="" width="40" height="40" />
            <span>
              POLONIA RYBNIK<small>Klubowy atlas judo</small>
            </span>
          </a>
          <a className="guide-back" href="/">
            <ArrowLeft />
            Wróć do klubu
          </a>
        </div>
      </header>
      <main id="guide-main" tabIndex={-1}>
        <section className="guide-intro shell" aria-labelledby="guide-title">
          <div>
            <p className="guide-kicker">
              <span className="belt-mark" aria-hidden="true" />
              Od pierwszego treningu do kolejnego stopnia
            </p>
            <h1 id="guide-title">
              Droga <br />
              po pas<span>.</span>
            </h1>
            <p className="guide-intro-copy">
              Każdy kolor ma swój program. Wybierz stopień, poznaj nazwy technik
              i ułóż własne powtórki przed treningiem.
            </p>
            <a
              href="#guide-program"
              className="guide-inline-link"
              onClick={(event) => {
                event.preventDefault();
                const section = document.getElementById("guide-program");
                section?.focus({ preventScroll: true });
                section?.scrollIntoView({
                  block: "start",
                  behavior: matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "instant"
                    : "smooth",
                });
              }}
            >
              Wybierz swój pas <ArrowRight />
            </a>
          </div>
          <div className="guide-belt-showcase">
            <div className="guide-belt-label">
              <span>{isDan ? "DAN" : belt.grade}</span>
              <span>
                {isDan ? "Stopnie mistrzowskie" : `Pas ${belt.color}`}
              </span>
            </div>
            <BeltDrawing
              colors={colors}
              label={isDan ? "czarny — DAN" : belt.color}
            />
            <p>Pas się zmienia. Praca na macie trwa.</p>
            <span className="guide-showcase-index" aria-hidden="true">
              {isDan ? "DAN" : belt.grade.replace(" KYU", "")}
              <small>{isDan ? "Mistrzowskie" : "KYU"}</small>
            </span>
          </div>
        </section>
        <section
          className="guide-workspace shell"
          id="guide-program"
          tabIndex={-1}
          aria-label="Program na wybrany pas"
        >
          <nav className="guide-belt-nav" aria-label="Wybierz stopień judo">
            <p className="guide-kicker">01 / Wybierz stopień</p>
            <div>
              {belts.map((item, index) => (
                <button
                  key={item.id}
                  aria-pressed={beltId === item.id}
                  onClick={() => choose(item.id)}
                >
                  <span
                    className="guide-belt-swatch"
                    style={
                      {
                        "--belt-one": item.colors[0],
                        "--belt-two": item.colors[1],
                      } as CSSProperties
                    }
                  />
                  <span>
                    <strong>{item.grade}</strong>
                    <small>{item.color}</small>
                  </span>
                  {beltId === item.id ? <Check /> : <ChevronRight />}
                  <span className="sr-only">{index + 1} z 10</span>
                </button>
              ))}
              <button aria-pressed={isDan} onClick={() => choose("dan")}>
                <span
                  className="guide-belt-swatch"
                  style={
                    {
                      "--belt-one": "#242522",
                      "--belt-two": "#242522",
                    } as CSSProperties
                  }
                />
                <span>
                  <strong>DAN</strong>
                  <small>stopnie mistrzowskie</small>
                </span>
                {isDan ? <Check /> : <ChevronRight />}
              </button>
            </div>
            <a
              href="https://pzjudo.pl/strefa-sportowa/rejestr-stopni/zgloszenia/"
              target="_blank"
              rel="noreferrer"
            >
              Dokumenty PZ Judo <ArrowUpRight />
            </a>
          </nav>
          <div className="guide-current">
            <div className="guide-current-title">
              <div>
                <p className="guide-kicker">02 / Program PZ Judo</p>
                <h2 aria-live="polite">
                  {isDan ? "Dalej jest DAN." : `Pas ${belt.color}`}
                  <span>
                    {isDan ? "Odrębna ścieżka mistrzowska" : belt.grade}
                  </span>
                </h2>
              </div>
              <div className="guide-tools">
                <button
                  onClick={share}
                  aria-label="Kopiuj link do wybranego pasa"
                >
                  {copied ? <Check /> : <Copy />}
                  <span>{copied ? "Skopiowano" : "Kopiuj link"}</span>
                </button>
                <button onClick={() => window.print()}>
                  <Printer />
                  <span>Drukuj program</span>
                </button>
              </div>
            </div>
            {copyFailed && (
              <label className="guide-copy-fallback">
                Skopiuj adres ręcznie
                <input
                  readOnly
                  value={`${location.origin}${location.pathname}#/droga-po-pas?pas=${beltId}`}
                  onFocus={(event) => event.currentTarget.select()}
                />
              </label>
            )}
            {isDan ? (
              <>
                <p className="guide-program-note">
                  DAN to osobny regulamin i procedura Komisji DAN. Zestawienie
                  poniżej obejmuje kata; pełne warunki techniczne, sportowe i
                  formalne sprawdzisz w źródle.
                </p>
                <div className="guide-dan-table" role="list">
                  {danRequirements.map((item) => (
                    <div role="listitem" key={item.grade}>
                      <span
                        className="guide-belt-swatch"
                        style={
                          {
                            "--belt-one": item.colors[0],
                            "--belt-two": item.colors[1],
                          } as CSSProperties
                        }
                      />
                      <div>
                        <h3>
                          {item.grade}
                          <small>Pas {item.color}</small>
                        </h3>
                        <p>{item.kata}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="guide-program-note">
                  Przed kata komisja wybiera również techniki nage-waza i
                  katame-waza. To zestawienie nie zastępuje pełnych warunków
                  uzyskania stopnia.
                </p>
                <a
                  className="guide-source-link"
                  href={danSource}
                  target="_blank"
                  rel="noreferrer"
                >
                  Regulamin DAN · dokument z 2025 r. <ArrowUpRight />
                </a>
              </>
            ) : (
              <>
                <p className="guide-program-note">
                  Poniżej materiał przypisany do {belt.grade}. Na egzaminie
                  obowiązują też wcześniejsze stopnie. Zakres ćwiczeń i
                  przygotowanie do egzaminu potwierdzasz z trenerem. Regulamin
                  określa również wymagania sportowe dla stopni 4–1 KYU.
                </p>
                <div
                  className="guide-scope"
                  role="group"
                  aria-label="Zakres programu"
                >
                  <button
                    aria-pressed={!cumulative}
                    onClick={() => setCumulative(false)}
                  >
                    Nowy materiał
                  </button>
                  <button
                    aria-pressed={cumulative}
                    onClick={() => setCumulative(true)}
                  >
                    Z wcześniejszymi stopniami
                  </button>
                </div>
                <div className="guide-study-grid">
                  <div className="guide-techniques">
                    <div className="guide-search">
                      <Search />
                      <label className="sr-only" htmlFor="guide-search">
                        Szukaj techniki
                      </label>
                      <input
                        id="guide-search"
                        type="search"
                        placeholder="Nazwa techniki"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      {query && (
                        <button
                          onClick={() => setQuery("")}
                          aria-label="Wyczyść wyszukiwanie"
                        >
                          <X />
                        </button>
                      )}
                    </div>
                    <div
                      className="guide-group-filter"
                      role="group"
                      aria-label="Rodzaj materiału"
                    >
                      {[
                        "Wszystkie",
                        "Podstawy",
                        "Nage-waza",
                        "Katame-waza",
                      ].map((item) => (
                        <button
                          key={item}
                          aria-pressed={group === item}
                          onClick={() => setGroup(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    <div className="guide-list-meta">
                      <span>
                        {visible.length} / {list.length} pozycji
                      </span>
                      <span>Nazwa / wybierz materiał</span>
                    </div>
                    {["Podstawy", "Nage-waza", "Katame-waza"].map(
                      (category) => {
                        const items = visible.filter(
                          (t) => t.group === category,
                        );
                        return items.length ? (
                          <section
                            className="guide-tech-group"
                            key={category}
                            aria-label={category}
                          >
                            <h3>
                              {category}
                              <small>
                                {category === "Podstawy"
                                  ? "Słownictwo i zasady"
                                  : category === "Nage-waza"
                                    ? "Nazwy technik rzutów"
                                    : "Nazwy technik w parterze"}
                              </small>
                            </h3>
                            <ul>
                              {items.map((item) => (
                                <li
                                  key={item.id}
                                  data-active={selected?.id === item.id}
                                >
                                  <label className="guide-review-check">
                                    <input
                                      type="checkbox"
                                      checked={reviewed.includes(item.id)}
                                      onChange={() => toggle(item.id)}
                                      aria-label={`Powtórzone: ${item.name}`}
                                    />
                                    <span aria-hidden="true">
                                      <Check />
                                    </span>
                                  </label>
                                  <button
                                    className="guide-tech-select"
                                    aria-pressed={selected?.id === item.id}
                                    onClick={() => selectTechnique(item.id)}
                                  >
                                    <span>
                                      {item.name}
                                      <small>
                                        {item.grade}
                                        {item.videoId ? " · film Kodokan" : ""}
                                      </small>
                                    </span>
                                    {item.videoId ? <Play /> : <ArrowUpRight />}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </section>
                        ) : null;
                      },
                    )}
                    {!visible.length && (
                      <div className="guide-empty">
                        <p>Nie ma takiej pozycji w tym zakresie.</p>
                        <button
                          onClick={() => {
                            setQuery("");
                            setGroup("Wszystkie");
                          }}
                        >
                          Pokaż cały wybrany materiał <ArrowRight />
                        </button>
                      </div>
                    )}
                    <a
                      className="guide-source-link"
                      href={`${kyuSource}#page=${belt.page}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Źródło programu · PZ Judo, strona {belt.page}{" "}
                      <ArrowUpRight />
                    </a>
                  </div>
                  {selected && (
                    <TechniqueMedia key={selected.id} technique={selected} />
                  )}
                </div>
                <div className="guide-review-summary">
                  <div>
                    <CheckCheck />
                    <div>
                      <h3>Twój notes powtórek</h3>
                      <p>
                        {done} z {list.length} pozycji w tym zakresie
                        zaznaczonych jako powtórzone
                      </p>
                      <small>
                        {saveFailed
                          ? "Przeglądarka nie zapisała zaznaczeń. Pozostaną dostępne tylko w tej sesji."
                          : "Zapis na tym urządzeniu. Twoje zaznaczenia nie są oceną ani zaliczeniem egzaminu."}
                      </small>
                    </div>
                  </div>
                  <button
                    disabled={!reviewed.length}
                    onClick={() => resetDialog.current?.showModal()}
                  >
                    Wyczyść notes
                  </button>
                </div>
                <div className="guide-next">
                  <span>Nauka obejmuje też wcześniejsze stopnie.</span>
                  {belts.findIndex((b) => b.id === beltId) < 8 && (
                    <button
                      onClick={() =>
                        choose(
                          belts[belts.findIndex((b) => b.id === beltId) + 1].id,
                        )
                      }
                    >
                      Poznaj kolejny pas <ArrowRight />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
        <section
          className="guide-sources shell"
          id="guide-privacy"
          tabIndex={-1}
        >
          <div>
            <p className="guide-kicker">Źródła i zakres</p>
            <h2>
              Program jest punktem wyjścia.
              <br />
              Trener prowadzi dalej.
            </h2>
          </div>
          <div>
            <p>
              Odczyt źródeł: 16.11.2026. Program KYU: regulamin aktualizowany
              01.07.2021, nadal publikowany przez PZ Judo. DAN: odrębny dokument
              z 2025 r. To przewodnik po programie związku, bez deklaracji
              zatwierdzenia odrębnego programu egzaminacyjnego Polonii.
            </p>
            <p>
              Wymaganie na stopień nie oznacza dopuszczenia techniki w każdych
              zawodach. Praktykę i warianty dobierasz z trenerem. Przy pozycjach
              bez materiału wizualnego pokazujemy odnośnik do programu, bez
              przypisywania podobnego filmu.
            </p>
            <p>
              Miniatury wczytują się z YouTube wraz z podstroną. Odtwarzacz
              zewnętrzny uruchamiasz przyciskiem; korzystając z niego,
              akceptujesz warunki YouTube i zasady Google. Notes powtórek jest
              przechowywany wyłącznie w tej przeglądarce i możesz go usunąć
              przyciskiem „Wyczyść notes”.
            </p>
            <div>
              <a href={kyuSource} target="_blank" rel="noreferrer">
                Program KYU <ArrowUpRight />
              </a>
              <a href={danSource} target="_blank" rel="noreferrer">
                Regulamin DAN <ArrowUpRight />
              </a>
              <a href={kodokanSource} target="_blank" rel="noreferrer">
                Wykaz Kodokan <ArrowUpRight />
              </a>
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noreferrer"
              >
                Warunki YouTube <ArrowUpRight />
              </a>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
              >
                Prywatność Google <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>
        <section className="guide-print-only">
          <h1>KS Polonia Rybnik · Droga po pas</h1>
          <h2>
            {isDan
              ? "DAN — zestawienie kata"
              : `${belt.grade} · pas ${belt.color}`}
          </h2>
          {isDan ? (
            <ul>
              {danRequirements.map((item) => (
                <li key={item.grade}>
                  {item.grade} — {item.kata}
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p>
                Zakres z wcześniejszymi stopniami. Zaznaczenia są prywatną listą
                powtórek.
              </p>
              <ul>
                {allProgram.map((item) => (
                  <li key={item.id}>
                    {reviewed.includes(item.id) ? "☑" : "☐"} {item.name} —{" "}
                    {item.grade}
                  </li>
                ))}
              </ul>
            </>
          )}
          <p>
            Źródło PZ Judo, odczyt16.11.2026. {isDan ? danSource : kyuSource}
          </p>
        </section>
      </main>
      <footer className="guide-footer shell">
        <span>KS Polonia Rybnik / Droga po pas</span>
        <a
          href="#guide-privacy"
          onClick={(event) => {
            event.preventDefault();
            document.getElementById("guide-privacy")?.focus();
          }}
        >
          Źródła i prywatność
        </a>
        <a href="/">
          Wróć na stronę klubu <ArrowRight />
        </a>
      </footer>
      <dialog
        ref={resetDialog}
        className="guide-reset-dialog"
        aria-labelledby="guide-reset-title"
        onClick={(event) => {
          if (event.target === event.currentTarget)
            resetDialog.current?.close();
        }}
      >
        <h2 id="guide-reset-title">Wyczyścić notes powtórek?</h2>
        <p>
          Usuniesz wszystkie zaznaczenia zapisane na tym urządzeniu, dla każdego
          pasa.
        </p>
        <div>
          <button
            onClick={() => {
              setReviewed([]);
              resetDialog.current?.close();
            }}
          >
            Usuń zaznaczenia
          </button>
          <button autoFocus onClick={() => resetDialog.current?.close()}>
            Zachowaj
          </button>
        </div>
      </dialog>
    </div>
  );
}
