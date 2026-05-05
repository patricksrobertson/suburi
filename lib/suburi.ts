export type SeriesId = "tsuki" | "shomen" | "katate" | "hasso" | "nagare";

export type Series = {
  id: SeriesId;
  nameJa: string;
  nameEn: string;
  range: readonly [number, number];
};

export const SERIES: readonly Series[] = [
  { id: "tsuki", nameJa: "tsuki no bu", nameEn: "thrusting series", range: [1, 5] },
  { id: "shomen", nameJa: "shomen no bu", nameEn: "front strike series", range: [6, 10] },
  { id: "katate", nameJa: "katate no bu", nameEn: "wrist series", range: [11, 13] },
  { id: "hasso", nameJa: "hasso no bu", nameEn: "figure eight series", range: [14, 18] },
  { id: "nagare", nameJa: "nagare no bu", nameEn: "flowing series", range: [19, 20] },
] as const;

export const SERIES_BY_ID: Record<SeriesId, Series> = SERIES.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<SeriesId, Series>,
);

export type Suburi = {
  number: number;
  numberJa: string;
  nameEn: string;
  nameJa: string;
  series: SeriesId;
};

export const SUBURI: readonly Suburi[] = [
  { number: 1, numberJa: "ichi", nameEn: "straight thrust", nameJa: "choku tsuki", series: "tsuki" },
  { number: 2, numberJa: "ni", nameEn: "turn and thrust", nameJa: "kaeshi tsuki", series: "tsuki" },
  { number: 3, numberJa: "san", nameEn: "rear thrust", nameJa: "ushiro tsuki", series: "tsuki" },
  { number: 4, numberJa: "shi", nameEn: "thrust downward turn", nameJa: "tsuki gedan gaeshi", series: "tsuki" },
  { number: 5, numberJa: "go", nameEn: "thrust upward turn and strike", nameJa: "tsuki jodan gaeshi", series: "tsuki" },
  { number: 6, numberJa: "roku", nameEn: "front strike", nameJa: "shomen uchi komi", series: "shomen" },
  { number: 7, numberJa: "shichi", nameEn: "continuous front strike", nameJa: "renzoku uchi komi", series: "shomen" },
  { number: 8, numberJa: "hachi", nameEn: "front strike downward turn", nameJa: "shomen uchi gedan gaeshi", series: "shomen" },
  { number: 9, numberJa: "kyu", nameEn: "front strike rear thrust", nameJa: "shomen uchi ushiro tsuki", series: "shomen" },
  { number: 10, numberJa: "ju", nameEn: "opposite side strike rear thrust", nameJa: "gyaku yokomen ushiro tsuki", series: "shomen" },
  { number: 11, numberJa: "ju ichi", nameEn: "wrist downward turn", nameJa: "katate gedan gaeshi", series: "katate" },
  { number: 12, numberJa: "ju ni", nameEn: "wrist bridging strike", nameJa: "katate toma uchi", series: "katate" },
  { number: 13, numberJa: "ju san", nameEn: "wrist figure eight turn", nameJa: "katate hachi no ji gaeshi", series: "katate" },
  { number: 14, numberJa: "ju shi", nameEn: "figure eight turn and strike", nameJa: "hasso gaeshi uchi", series: "hasso" },
  { number: 15, numberJa: "ju go", nameEn: "figure eight turn and thrust", nameJa: "hasso gaeshi tsuki", series: "hasso" },
  { number: 16, numberJa: "ju roku", nameEn: "figure eight turn rear thrust", nameJa: "hasso gaeshi ushiro tsuki", series: "hasso" },
  { number: 17, numberJa: "ju shichi", nameEn: "figure eight turn rear strike", nameJa: "hasso gaeshi ushiro uchi", series: "hasso" },
  { number: 18, numberJa: "ju hachi", nameEn: "figure eight turn rear sweep", nameJa: "hasso gaeshi ushiro barai", series: "hasso" },
  { number: 19, numberJa: "ju kyu", nameEn: "left turn flowing strike", nameJa: "hidari nagare gaeshi uchi", series: "nagare" },
  { number: 20, numberJa: "ni ju", nameEn: "right turn flowing thrust", nameJa: "migi nagare gaeshi tsuki", series: "nagare" },
] as const;

export type Mode = "A" | "B" | "C";

export const MODE_LABEL: Record<Mode, string> = {
  A: "Easy — pick from 3",
  B: "Medium — pick from 10",
  C: "Hard — type the answer",
};

export type Direction = "name" | "number";

export const DIRECTION_LABEL: Record<Direction, string> = {
  name: "Name",
  number: "Number",
};

export const DIRECTION_HELP: Record<Direction, string> = {
  name: "Guess the correct technique name.",
  number: "Guess the correct technique number.",
};

export const DIRECTION_HEADER: Record<Direction, string> = {
  name: "answering name",
  number: "answering number",
};

// Accepted romaji forms per number. The first entry is the canonical form
// shown in prompts, dropdowns, and feedback (matches each card's `numberJa`).
// Subsequent entries are accepted alternates for typed answers.
const NUMBER_FORMS: Record<number, readonly string[]> = {
  1: ["ichi"],
  2: ["ni"],
  3: ["san"],
  4: ["shi", "yon", "yo"],
  5: ["go"],
  6: ["roku"],
  7: ["shichi", "nana"],
  8: ["hachi"],
  9: ["kyu", "ku"],
  10: ["ju"],
  11: ["ju ichi"],
  12: ["ju ni"],
  13: ["ju san"],
  14: ["ju shi", "ju yon"],
  15: ["ju go"],
  16: ["ju roku"],
  17: ["ju shichi", "ju nana"],
  18: ["ju hachi"],
  19: ["ju kyu", "ju ku"],
  20: ["ni ju"],
};

export function numberFormsFor(n: number): readonly string[] {
  return NUMBER_FORMS[n] ?? [];
}

export function deckForSelection(selected: readonly SeriesId[]): Suburi[] {
  const set = new Set(selected);
  return SUBURI.filter((s) => set.has(s.series));
}

export function describeSelection(selected: readonly SeriesId[]): string {
  if (selected.length === 0) return "no series";
  if (selected.length === SERIES.length) return "all series";
  return SERIES.filter((s) => selected.includes(s.id))
    .map((s) => s.nameJa)
    .join(" + ");
}
