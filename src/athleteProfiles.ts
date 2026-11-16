import data from "./ijf-results.json";
import { athletes as originals } from "./teamData";

const portraits: Record<string, string> = {
  "szymon-panek": "szymon-panek.jpg",
  "patryk-zemla": "patryk-zemla.jpg",
  "wiktoria-moldrzyk": "wiktoria-moldrzyk.jpg",
  "igor-gabriel": "igor-gabriel.png",
  "adrian-stefanski": "adrian-stefanski.jpg",
};

function significance(result: {
  level: string;
  event: string;
  place: number | null;
  date: string;
}) {
  if (result.place === null) return 0;
  const level = result.level.toLowerCase(),
    name = result.event.toLowerCase();
  const tier = name.includes("olympic")
    ? 100
    : level.includes("world championships")
      ? 110
      : level.includes("continental championships")
        ? 80
        : level.includes("grand slam")
          ? 60
          : level.includes("grand prix")
            ? 50
            : level.includes("open")
              ? 30
              : 20;
  return (
    tier +
    (result.place === 1
      ? 5
      : result.place === 2
        ? 3
        : result.place === 3
          ? 1
          : 0)
  );
}

export const profiles = data.athletes.map((record, index) => {
  const original = originals.find((a) => a.id === record.id);
  const nameParts = record.name.split(" ");
  const competitions = record.results.filter((r) => r.kind === "competition");
  const major = competitions
    .filter(
      (r) =>
        r.place !== null &&
        (r.place <= 3 || (/olympic/i.test(r.event) && r.place <= 7)),
    )
    .sort(
      (a, b) =>
        significance(b) - significance(a) || b.date.localeCompare(a.date),
    );
  const highlightKeys = new Set(major.map((r) => r.competitionId));
  const monogram = record.name
    .split(" ")
    .map((word) => word[0])
    .join("");
  const hasPhoto = Boolean(original || portraits[record.id]);
  const photos = original?.photos || [
    {
      src: portraits[record.id]
        ? `/images/athletes/${portraits[record.id]}`
        : "",
      caption: portraits[record.id]
        ? `${record.name} · oficjalne materiały klubowe, data zdjęcia niepodana`
        : `${record.name} · portret nieudostępniony`,
    },
  ];
  if (record.id === "wiktoria-moldrzyk")
    photos.unshift({
      src: "/images/wiktoria-medal.jpg",
      caption:
        "Wiktoria Mołdrzyk · medal Ogólnopolskiej Olimpiady Młodzieży 2025",
    });
  const results = competitions
    .map((r) => ({
      year: r.year,
      place: r.place === null ? "—" : String(r.place),
      event: r.event,
      weight: r.weight,
      date: new Date(r.date + "T12:00:00Z").toLocaleDateString("pl-PL", {
        timeZone: "UTC",
      }),
      isoDate: r.date,
      sourceUrl: r.sourceUrl,
      highlight: highlightKeys.has(r.competitionId),
      significance: significance(r),
    }))
    .sort((a, b) => b.isoDate.localeCompare(a.isoDate));
  return {
    id: record.id,
    name: record.name,
    given: nameParts[0],
    surname: nameParts.slice(1).join(" ").toLocaleUpperCase("pl"),
    number: String(index + 1).padStart(2, "0"),
    ijf: String(record.ijfId),
    category: record.currentWeight,
    headline:
      record.id === "szymon"
        ? "Mistrz świata kadetów. Medalista mistrzostw Europy."
        : record.id === "julia"
          ? "Medalistka mistrzostw świata. Olimpijka."
          : record.id === "dawid"
            ? "Od medalu mistrzostw Europy do startów seniorów."
            : "Z Polonią na międzynarodowych matach",
    photos,
    results,
    highlightSummary: major[0]
      ? `${major[0].place}. miejsce · ${major[0].event}`
      : "Międzynarodowe starty zapisane w IJF",
    leadPhoto: photos[0].src,
    photoKind:
      original || record.id === "wiktoria-moldrzyk" ? "event" : "portrait",
    hasPhoto,
    monogram,
  };
});
