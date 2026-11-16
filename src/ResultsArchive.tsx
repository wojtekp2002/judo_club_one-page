import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Download, Search, Link, Check } from "lucide-react";
import raw from "./ijf-results.json";

type Result = {
  competitionId: number;
  event: string;
  date: string;
  year: string;
  dateEnd?: string;
  ageCategory: string;
  weight: string;
  level: string;
  kind: string;
  place: number | null;
  status: string;
  sourceUrl: string;
};
type Athlete = {
  id: string;
  name: string;
  ijfId: number;
  sourceUrl: string;
  currentWeight: string;
  counts: {
    allRows: number;
    competitionRows: number;
    trainingRows: number;
    placedRows: number;
  };
  results: Result[];
  note?: string;
};
const dataset = raw as unknown as { fetchedAt: string; athletes: Athlete[] };
const normalize = (text: string) =>
  text
    .toLocaleLowerCase("pl")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("ł", "l");

export default function ResultsArchive() {
  const initial = new URLSearchParams(window.location.search);
  const [person, setPerson] = useState(
    dataset.athletes.some((a) => a.id === initial.get("judoka"))
      ? initial.get("judoka")!
      : "szymon",
  );
  const [year, setYear] = useState(initial.get("sezon") || "all");
  const [kind, setKind] = useState("competition");
  const [podium, setPodium] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const athlete = dataset.athletes.find((a) => a.id === person)!;
  const years = [...new Set(athlete.results.map((r) => r.year))]
    .sort()
    .reverse();
  const results = useMemo(
    () =>
      athlete.results
        .filter(
          (r) =>
            (year === "all" || r.year === year) &&
            (kind === "all" || r.kind === kind) &&
            (!podium ||
              (r.kind === "competition" && r.place !== null && r.place <= 3)) &&
            normalize(r.event + " " + r.ageCategory + " " + r.weight).includes(
              normalize(query),
            ),
        )
        .sort(
          (a, b) =>
            b.date.localeCompare(a.date) || a.event.localeCompare(b.event),
        ),
    [athlete, year, kind, podium, query],
  );
  const pageCount = Math.max(1, Math.ceil(results.length / 10));
  const safePage = Math.min(page, pageCount);
  useEffect(() => {
    setPage(1);
    setCopied(false);
  }, [person, year, kind, podium, query]);
  function choose(id: string) {
    setPerson(id);
    setYear("all");
    setQuery("");
    setPodium(false);
  }
  function reset() {
    setYear("all");
    setKind("competition");
    setPodium(false);
    setQuery("");
  }
  async function share() {
    const url = new URL(location.href);
    url.searchParams.set("judoka", person);
    if (year !== "all") url.searchParams.set("sezon", year);
    else url.searchParams.delete("sezon");
    url.hash = "wyniki";
    history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  function exportCsv() {
    const cell = (value: unknown) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;
    const lines = [
      [
        "Zawodnik",
        "Data",
        "Zawody",
        "Kategoria",
        "Waga",
        "Lokata",
        "Rodzaj",
        "Źródło",
      ],
      ...results.map((r) => [
        athlete.name,
        r.date,
        r.event,
        r.ageCategory,
        r.weight,
        r.place ?? "Brak opublikowanej lokaty",
        r.kind,
        r.sourceUrl,
      ]),
    ];
    const blob = new Blob(
      ["\ufeff" + lines.map((row) => row.map(cell).join(";")).join("\r\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wyniki-${person}-${year}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const medals = athlete.results.filter(
    (r) => r.kind === "competition" && r.place !== null && r.place <= 3,
  );
  return (
    <section
      className="results-archive"
      id="wyniki"
      aria-labelledby="results-title"
    >
      <div className="shell section">
        <div className="archive-heading">
          <div>
            <p className="people-kicker">Klubowe archiwum / źródło IJF</p>
            <h2 id="results-title">
              Każdy start
              <br />
              ma swoją historię.
            </h2>
          </div>
          <p>
            Pełne tabele opublikowane przez IJF.
            <br />
            Zawody, lokaty i udział bez klasyfikacji — z datą i źródłem.
          </p>
        </div>
        <div
          className="archive-athletes"
          role="group"
          aria-label="Zawodnik w archiwum"
        >
          {dataset.athletes.map((a) => (
            <button
              key={a.id}
              aria-pressed={person === a.id}
              onClick={() => choose(a.id)}
            >
              {a.name}
            </button>
          ))}
        </div>
        <div className="archive-summary">
          <div>
            <span>Historia zawodnika</span>
            <h3>{athlete.name}</h3>
            <a
              href={`https://www.ijf.org/judoka/${athlete.ijfId}`}
              target="_blank"
              rel="noreferrer"
            >
              Oficjalny profil IJF
              <ArrowUpRight />
            </a>
          </div>
          <div>
            <strong>{athlete.counts.competitionRows}</strong>
            <span>wpisów zawodów w tabeli IJF</span>
          </div>
          <div>
            <strong>{medals.length}</strong>
            <span>opublikowanych miejsc na podium</span>
          </div>
          <div>
            <strong>{athlete.counts.trainingRows}</strong>
            <span>wpisów zgrupowań / oddzielnie</span>
          </div>
        </div>
        <div className="archive-filters">
          <label>
            <span>Sezon</span>
            <select
              aria-label="Sezon wyników"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="all">Wszystkie sezony</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Rodzaj</span>
            <select
              aria-label="Rodzaj wpisu"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
            >
              <option value="competition">Zawody</option>
              <option value="training">Zgrupowania</option>
              <option value="all">Cała historia IJF</option>
            </select>
          </label>
          <label className="archive-search">
            <span>Szukaj zawodów</span>
            <div>
              <Search />
              <input
                aria-label="Szukaj zawodów"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Miasto, turniej, waga…"
              />
            </div>
          </label>
          <label className="archive-podium">
            <input
              type="checkbox"
              checked={podium}
              onChange={(e) => setPodium(e.target.checked)}
            />
            Tylko podium
          </label>
        </div>
        <div className="archive-toolbar">
          <span role="status">
            {results.length} wpisów · {athlete.name}
          </span>
          <div>
            <button onClick={share}>
              {copied ? <Check /> : <Link />}
              {copied ? "Link skopiowany" : "Udostępnij zawodnika"}
            </button>
            <button onClick={exportCsv} disabled={!results.length}>
              <Download />
              Eksport CSV
            </button>
          </div>
        </div>
        <div className="archive-table-wrap">
          <table className="archive-table">
            <caption className="sr-only">Historia IJF: {athlete.name}</caption>
            <thead>
              <tr>
                <th>Data</th>
                <th>Zawody / wydarzenie</th>
                <th>Kategoria / waga</th>
                <th>Wynik</th>
                <th>
                  <span className="sr-only">Źródło</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {results
                .slice((safePage - 1) * 10, safePage * 10)
                .map((r, index) => (
                  <tr key={`${r.competitionId}-${r.date}-${index}`}>
                    <td>
                      <time dateTime={r.date}>
                        {new Date(r.date + "T12:00:00Z").toLocaleDateString(
                          "pl-PL",
                          { timeZone: "UTC" },
                        )}
                      </time>
                    </td>
                    <td>
                      <strong>{r.event}</strong>
                      <small>
                        {r.kind === "training" ? "Zgrupowanie" : r.level}
                      </small>
                    </td>
                    <td>
                      {r.ageCategory}
                      <small>{r.weight ? r.weight : "—"}</small>
                    </td>
                    <td>
                      <span
                        className={
                          r.place !== null && r.place <= 3
                            ? "archive-place medal"
                            : "archive-place"
                        }
                      >
                        {r.kind === "training"
                          ? "Udział"
                          : r.place !== null
                            ? `${r.place}. miejsce`
                            : "Bez lokaty w IJF"}
                      </span>
                    </td>
                    <td>
                      <a
                        href={r.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Źródło: ${r.event}`}
                      >
                        <ArrowUpRight />
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {!results.length && (
          <div className="archive-empty">
            <h3>
              {athlete.results.length
                ? "Brak wpisów dla tych filtrów"
                : "IJF nie publikuje tabeli lokat tego zawodnika"}
            </h3>
            <p>
              {athlete.results.length
                ? "Zmień sezon lub wyczyść filtry."
                : "Nie oznacza to braku startów. Walki i udział w zawodach można sprawdzić w oficjalnym profilu."}
            </p>
            <button onClick={reset}>Wyczyść filtry</button>
            <a
              href={`https://www.ijf.org/judoka/${athlete.ijfId}/contests`}
              target="_blank"
              rel="noreferrer"
            >
              Przejdź do walk IJF
              <ArrowUpRight />
            </a>
          </div>
        )}
        <div className="archive-pagination">
          <button
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
          >
            Poprzednie 10
          </button>
          <span>
            {safePage} / {pageCount}
          </span>
          <button
            disabled={safePage === pageCount}
            onClick={() => setPage(safePage + 1)}
          >
            Kolejne 10
          </button>
        </div>
        <p className="archive-footnote">
          Zapis źródeł: {dataset.fetchedAt}. „Bez lokaty” oznacza brak miejsca w
          tabeli IJF. Zgrupowania nie są liczone jako zawody ani medale.
          Archiwum obejmuje wpisy udostępnione przez IJF, nie wszystkie turnieje
          krajowe i klubowe.
        </p>
      </div>
    </section>
  );
}
