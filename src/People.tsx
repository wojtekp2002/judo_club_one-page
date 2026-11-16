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
import { athletes, coaches } from "./teamData";

export default function People({ onJoin }: { onJoin: () => void }) {
  const [selected, setSelected] = useState(0);
  const [photo, setPhoto] = useState(0);
  const [period, setPeriod] = useState("2026");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const photoOpener = useRef<HTMLButtonElement | null>(null);
  const athlete = athletes[selected];
  const photograph = athlete.photos[photo];
  useEffect(() => {
    if (expanded) dialog.current?.showModal();
    else { dialog.current?.close(); photoOpener.current?.focus({ preventScroll: true }); }
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
              Trzy sportowe historie.
              <br />
              Poznaj zawodników naszego klubu.
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
                          ? 2
                          : (index + (event.key === "ArrowLeft" ? 2 : 1)) % 3;
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
            <div className="athlete-visual">
              <img
                src={athlete.portrait}
                alt={`${athlete.name} — oficjalny portret klubu`}
                loading="lazy"
                width="848"
                height="1200"
              />
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
              <div className="result-heading">
                <span>Wybrane wyniki</span>
                <div role="group" aria-label="Okres wyników">
                  {["2026", "Wszystkie"].map((value) => (
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
                {athlete.results
                  .filter(
                    (result) =>
                      period === "Wszystkie" || result.year === period,
                  )
                  .map((result) => (
                    <li key={result.date}>
                      <span className={`result-place place-${result.place}`}>
                        {result.place}
                        <small>miejsce</small>
                      </span>
                      <span>
                        <strong>{result.event}</strong>
                        <span>
                          {result.city} / <time>{result.date}</time>
                        </span>
                      </span>
                    </li>
                  ))}
              </ol>
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
                Wyniki zweryfikowane 16.11.2026 · bez rankingu na żywo
              </p>
            </div>
          </div>
          <div className="athlete-photo-strip">
            <button
              className="athlete-action-photo"
            onClick={(event) => { photoOpener.current = event.currentTarget; setExpanded(true); }}
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
                  onClick={() => setPhoto((photo + 1) % athlete.photos.length)}
                >
                  <ChevronRight />
                </button>
              </div>
              <a
                href={`https://www.ijf.org/judoka/${athlete.ijf}/photos`}
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
        onCancel={(event) => { event.preventDefault(); setExpanded(false); }}
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
        <img src={photograph.src} alt={photograph.caption} />
        <p>{photograph.caption}</p>
      </dialog>
    </>
  );
}
