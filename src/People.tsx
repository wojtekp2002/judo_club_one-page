import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Maximize2,
} from "lucide-react";
import { coaches } from "./teamData";
import { profiles as athletes } from "./athleteProfiles";

export default function People({ onJoin }: { onJoin: () => void }) {
  const [selected, setSelected] = useState(0);
  const [photo, setPhoto] = useState(0);
  const [period, setPeriod] = useState("Najważniejsze");
  const [resultPage, setResultPage] = useState(1);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const photoOpener = useRef<HTMLButtonElement | null>(null);
  const athlete = athletes[selected];
  const photograph = athlete.photos[photo];
  const highlighted = athlete.results
    .filter((r) => r.highlight)
    .sort(
      (a, b) =>
        b.significance - a.significance || b.isoDate.localeCompare(a.isoDate),
    );
  const shownResults =
    period === "Najważniejsze"
      ? highlighted.length
        ? highlighted
        : athlete.results.slice(0, 6)
      : athlete.results.filter(
          (r) => period === "Wszystkie" || r.year === period,
        );
  const resultPages = Math.max(1, Math.ceil(shownResults.length / 8));
  const safeResultPage = Math.min(resultPage, resultPages);
  useEffect(() => setResultPage(1), [selected, period]);
  useEffect(() => {
    if (expanded) dialog.current?.showModal();
    else {
      dialog.current?.close();
      photoOpener.current?.focus({ preventScroll: true });
    }
    if (expanded) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);
  const normalize = (value: string) =>
    value
      .toLocaleLowerCase("pl")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replaceAll("ł", "l");
  const filtered = coaches.filter((coach) =>
    normalize(coach.name + coach.role).includes(normalize(query)),
  );
  function choose(index: number) {
    setSelected(index);
    setPhoto(0);
    setPeriod("Najważniejsze");
  }
  return (
    <>
      <section
        className="people-section"
        id="zawodnicy"
        aria-labelledby="people-title"
      >
        <div className="shell section">
          <div className="people-heading">
            <div>
              <p className="people-kicker">Polonia / na światowych matach</p>
              <h2 id="people-title">
                Nazwiska z Rybnika.
                <br />
                Judo bez granic.
              </h2>
            </div>
            <p>
              Dziesięć nazwisk, różne etapy sportowej drogi.
              <br />
              Największe osiągnięcia i pełne starty zapisane w IJF.
            </p>
          </div>
          <div
            className="athlete-tabs"
            role="tablist"
            aria-label="Wybierz zawodnika"
          >
            {athletes.map((person, index) => (
              <button
                key={person.id}
                id={`athlete-tab-${person.id}`}
                role="tab"
                aria-selected={selected === index}
                aria-controls="athlete-panel"
                tabIndex={selected === index ? 0 : -1}
                onClick={() => choose(index)}
                onKeyDown={(event) => {
                  if (
                    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                      event.key,
                    )
                  ) {
                    event.preventDefault();
                    const next =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? athletes.length - 1
                          : (index +
                              (event.key === "ArrowLeft"
                                ? athletes.length - 1
                                : 1)) %
                            athletes.length;
                    choose(next);
                    document
                      .getElementById(`athlete-tab-${athletes[next].id}`)
                      ?.focus();
                  }
                }}
              >
                <span>{person.number}</span>
                {person.name}
                <ArrowUpRight />
              </button>
            ))}
          </div>
          <div
            className="athlete-panel"
            id="athlete-panel"
            role="tabpanel"
            aria-labelledby={`athlete-tab-${athlete.id}`}
            key={athlete.id}
          >
            <div className="athlete-visual" data-kind={athlete.photoKind}>
              {athlete.hasPhoto ? (
                <img
                  src={athlete.leadPhoto}
                  alt={athlete.photos[0].caption}
                  loading="lazy"
                  width="848"
                  height="1200"
                />
              ) : (
                <div
                  className="athlete-monogram"
                  aria-label="Portret nieudostępniony"
                >
                  {athlete.monogram}
                </div>
              )}
              <span className="athlete-number" aria-hidden="true">
                {athlete.number}
              </span>
              <div className="athlete-name">
                <span>{athlete.given}</span>
                <strong>{athlete.surname}</strong>
                <small>POL / {athlete.category}</small>
              </div>
            </div>
            <div className="athlete-story">
              <p className="people-kicker">
                Profil zawodnika / {athlete.number}
              </p>
              <h3>{athlete.headline}</h3>
              <p className="profile-achievement">{athlete.highlightSummary}</p>
              <div className="result-heading">
                <span>
                  Wyniki zawodnika · {athlete.results.length} startów IJF
                </span>
                <div role="group" aria-label="Okres wyników">
                  {["Najważniejsze", "2026", "Wszystkie"].map((value) => (
                    <button
                      key={value}
                      aria-pressed={period === value}
                      onClick={() => setPeriod(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <ol className="athlete-results">
                {shownResults
                  .slice((safeResultPage - 1) * 8, safeResultPage * 8)
                  .map((result) => (
                    <li key={result.isoDate + result.event}>
                      <span className={`result-place place-${result.place}`}>
                        {result.place}
                        <small>
                          {result.place === "—" ? "udział" : "miejsce"}
                        </small>
                      </span>
                      <span>
                        <strong>{result.event}</strong>
                        <span>
                          {result.weight} /{" "}
                          <time dateTime={result.isoDate}>{result.date}</time>
                          <a
                            className="profile-result-source"
                            href={result.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Źródło: ${result.event}`}
                          >
                            <ArrowUpRight />
                          </a>
                        </span>
                      </span>
                    </li>
                  ))}
              </ol>
              {!shownResults.length && (
                <p className="profile-result-note">
                  Brak startów IJF dla wybranego sezonu. Wybierz „Wszystkie”.
                </p>
              )}
              {period === "Najważniejsze" && !highlighted.length && (
                <p className="profile-result-note">
                  Pokazujemy ostatnie udokumentowane starty. Całą historię
                  znajdziesz w zakładce „Wszystkie”.
                </p>
              )}
              {resultPages > 1 && (
                <div className="profile-result-pages">
                  <button
                    disabled={safeResultPage === 1}
                    onClick={() => setResultPage(safeResultPage - 1)}
                  >
                    Poprzednie
                  </button>
                  <span>
                    {safeResultPage} / {resultPages}
                  </span>
                  <button
                    disabled={safeResultPage === resultPages}
                    onClick={() => setResultPage(safeResultPage + 1)}
                  >
                    Kolejne
                  </button>
                </div>
              )}
              <a className="archive-cta" href={`?judoka=${athlete.id}#wyniki`}>
                Pełne archiwum startów
                <ArrowRight />
              </a>
              <div className="athlete-source">
                <a
                  href={`https://www.ijf.org/judoka/${athlete.ijf}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Profil i bieżące wyniki IJF
                  <ArrowUpRight />
                </a>
                <a
                  href={`https://judotv.com/judoka/ijf%3A${athlete.ijf}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Obejrzyj walki na JudoTV
                  <ArrowUpRight />
                </a>
              </div>
              <p className="people-date">
                {athlete.photos[0].caption} · Wyniki IJF: 16.11.2026
              </p>
            </div>
          </div>
          {athlete.hasPhoto ? (
            <div className="athlete-photo-strip">
              <button
                className="athlete-action-photo"
                onClick={(event) => {
                  photoOpener.current = event.currentTarget;
                  setExpanded(true);
                }}
                aria-label={`Powiększ zdjęcie: ${athlete.name}`}
              >
                <img
                  key={photograph.src}
                  src={photograph.src}
                  alt={photograph.caption}
                  loading="lazy"
                  width="900"
                  height="650"
                />
                <span>
                  <Maximize2 />
                  Powiększ
                </span>
              </button>
              <div className="photo-desk">
                <span className="people-kicker">
                  Z klubowego archiwum / {String(photo + 1).padStart(2, "0")}
                </span>
                <p>{photograph.caption}</p>
                <div className="photo-controls">
                  <button
                    aria-label="Poprzednie zdjęcie zawodnika"
                    onClick={() =>
                      setPhoto(
                        (photo + athlete.photos.length - 1) %
                          athlete.photos.length,
                      )
                    }
                  >
                    <ChevronLeft />
                  </button>
                  <span>
                    {photo + 1} / {athlete.photos.length}
                  </span>
                  <button
                    aria-label="Następne zdjęcie zawodnika"
                    onClick={() =>
                      setPhoto((photo + 1) % athlete.photos.length)
                    }
                  >
                    <ChevronRight />
                  </button>
                </div>
                <a
                  href={`https://www.ijf.org/judoka/${athlete.ijf}/pictures`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Więcej zdjęć w galerii IJF
                  <ArrowUpRight />
                </a>
                <small>
                  Fotografie na stronie: materiały klubu. Galerie IJF otwierają
                  się w serwisie federacji.
                </small>
              </div>
            </div>
          ) : (
            <p className="profile-photo-missing">
              Klub nie udostępnia jeszcze portretu {athlete.name}.{" "}
              <a
                href={`https://www.ijf.org/judoka/${athlete.ijf}/pictures`}
                target="_blank"
                rel="noreferrer"
              >
                Sprawdź galerię IJF <ArrowUpRight />
              </a>
            </p>
          )}
          <div className="people-next">
            <span>Zawodnicy są częścią tej samej klubowej społeczności</span>
            <a href="#kadra">
              Poznaj kadrę klubu
              <ArrowRight />
            </a>
          </div>
        </div>
      </section>
      <section
        className="coaches-section"
        id="kadra"
        aria-labelledby="coaches-title"
      >
        <div className="shell section">
          <div className="people-heading">
            <div>
              <p className="people-kicker">
                Ludzie po drugiej stronie treningu
              </p>
              <h2 id="coaches-title">Poznaj kadrę klubu</h2>
            </div>
            <p>
              Od pierwszych zajęć po przygotowanie do startów.
              <br />
              Grupę i prowadzącego potwierdzisz w klubie.
            </p>
          </div>
          <div className="coach-toolbar">
            <label>
              <Search />
              <span className="sr-only">Szukaj trenera</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nazwisko lub rola"
              />
            </label>
            <span aria-live="polite">
              {filtered.length} / {coaches.length} osób
            </span>
          </div>
          <div className="coach-grid">
            {filtered.map((coach) => (
              <article className="coach-card" key={coach.name}>
                {coach.image ? (
                  <img
                    src={coach.image}
                    alt={coach.name}
                    loading="lazy"
                    width="320"
                    height="400"
                  />
                ) : (
                  <div className="coach-monogram" aria-hidden="true">
                    {coach.name
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")}
                  </div>
                )}
                <div>
                  <h3>{coach.name}</h3>
                  <p>{coach.role}</p>
                  <button onClick={onJoin}>
                    Zapytaj o trening
                    <ArrowUpRight />
                  </button>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="coach-empty">
              <p>Nie znaleziono takiej osoby</p>
              <button onClick={() => setQuery("")}>Pokaż całą kadrę</button>
            </div>
          )}
          <div className="coach-footnote">
            <p>
              Sztab według zestawienia MOSiR Rybnik. Portrety z oficjalnych
              materiałów klubu; daty ich wykonania nie są podane.
            </p>
            <a
              href="https://mosir.rybnik.pl/aktywny-rybnik/sport-i-rekreacja/dyscypliny-indywidualne"
              target="_blank"
              rel="noreferrer"
            >
              Źródło kadry
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>
      <dialog
        ref={dialog}
        className="people-photo-dialog"
        onCancel={(event) => {
          event.preventDefault();
          setExpanded(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setExpanded(false);
        }}
        aria-label={`Fotografia zawodnika: ${athlete.name}`}
      >
        <button
          className="people-photo-close"
          onClick={() => setExpanded(false)}
          aria-label="Zamknij fotografię"
        >
          <X />
        </button>
        {photograph.src && (
          <img src={photograph.src} alt={photograph.caption} />
        )}
        <p>{photograph.caption}</p>
      </dialog>
    </>
  );
}
