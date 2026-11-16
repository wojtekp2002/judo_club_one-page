import program from "./belt-program.json";
import media from "./belt-media.json";

export const belts = program;
export const kyuSource =
  "https://pzjudo.pl/wp-content/uploads/2026/06/regulamin_uzyskiwania_stopni_kyu_-_aktualizacja_uchwala_29_z_dnia_01.07.2021.pdf";
export const danSource =
  "https://pzjudo.pl/wp-content/uploads/2026/06/regulamin_uzyskiwania_stopni_dan_1.pdf";
export const kodokanSource =
  "https://www.kodokan.org/en/techniques/names-of-judo-techniques/";
export const normalize = (text: string) =>
  text
    .toLocaleLowerCase("pl")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("ł", "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export type Technique = {
  id: string;
  name: string;
  group: string;
  grade: string;
  page: number;
  videoId?: string;
};
const aliases: Record<string, string> = { "hon-kesa-gatame": "kesa-gatame" };
const videos = new Map(
  media.map((item) => [normalize(item.name), item.videoId]),
);

export function requirements(beltId: string, cumulative = false): Technique[] {
  const index = belts.findIndex((belt) => belt.id === beltId);
  if (index < 0) return [];
  const chosen = cumulative ? belts.slice(0, index + 1) : [belts[index]];
  const items = new Map<string, Technique>();
  for (const belt of chosen)
    for (const [key, group] of [
      ["basics", "Podstawy"],
      ["throws", "Nage-waza"],
      ["ground", "Katame-waza"],
    ] as const) {
      for (const name of belt[key]) {
        const id = normalize(name);
        const restricted =
          /jime|garami|ude-hishigi|sode-guruma|kata-gatame/.test(id);
        const videoId = restricted
          ? undefined
          : videos.get(name.startsWith("Ukemi") ? "ukemi" : aliases[id] || id);
        items.set(id, {
          id,
          name,
          group,
          grade: belt.grade,
          page: belt.page,
          videoId,
        });
      }
    }
  return [...items.values()];
}

export const danRequirements = [
  {
    grade: "1 DAN",
    kata: "Nage-no-kata · 3 grupy",
    color: "czarny",
    colors: ["#242522", "#242522"],
  },
  {
    grade: "2 DAN",
    kata: "Nage-no-kata · 5 grup",
    color: "czarny",
    colors: ["#242522", "#242522"],
  },
  {
    grade: "3 DAN",
    kata: "Katame-no-kata",
    color: "czarny",
    colors: ["#242522", "#242522"],
  },
  {
    grade: "4 DAN",
    kata: "Nage-no-kata oraz Katame-no-kata",
    color: "czarny",
    colors: ["#242522", "#242522"],
  },
  {
    grade: "5 DAN",
    kata: "Kodokan Goshin Jutsu; dla kobiet także możliwość wyboru Ju-no-kata",
    color: "czarny",
    colors: ["#242522", "#242522"],
  },
  {
    grade: "6 DAN",
    kata: "Kime-no-kata",
    color: "biało-czerwony",
    colors: ["#eeeae1", "#b82932"],
  },
  {
    grade: "7 DAN",
    kata: "Itsutsu-no-kata",
    color: "biało-czerwony",
    colors: ["#eeeae1", "#b82932"],
  },
  {
    grade: "8 DAN",
    kata: "Koshiki-no-kata",
    color: "biało-czerwony",
    colors: ["#eeeae1", "#b82932"],
  },
  {
    grade: "9–10 DAN",
    kata: "Regulamin nie przypisuje odrębnego kata w zestawieniu wymagań technicznych",
    color: "czerwony",
    colors: ["#b82932", "#b82932"],
  },
];
