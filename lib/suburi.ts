export type Suburi = {
  number: number;
  numberJa: string;
  nameEn: string;
  nameJa: string;
};

export const SUBURI: readonly Suburi[] = [
  { number: 1, numberJa: "ichi", nameEn: "straight thrust", nameJa: "choku tsuki" },
  { number: 2, numberJa: "ni", nameEn: "turn and thrust", nameJa: "kaeshi tsuki" },
  { number: 3, numberJa: "san", nameEn: "rear thrust", nameJa: "ushiro tsuki" },
  { number: 4, numberJa: "shi", nameEn: "thrust downward turn", nameJa: "tsuki gedan gaeshi" },
  { number: 5, numberJa: "go", nameEn: "thrust upward turn and strike", nameJa: "tsuki jodan gaeshi" },
  { number: 6, numberJa: "roku", nameEn: "front strike", nameJa: "shomen uchi komi" },
  { number: 7, numberJa: "shichi", nameEn: "continuous front strike", nameJa: "renzoku uchi komi" },
  { number: 8, numberJa: "hachi", nameEn: "front strike downward turn", nameJa: "shomen uchi gedan gaeshi" },
  { number: 9, numberJa: "kyu", nameEn: "front strike rear thrust", nameJa: "shomen uchi ushiro tsuki" },
  { number: 10, numberJa: "ju", nameEn: "opposite side strike rear thrust", nameJa: "gyaku yokomen ushiro tsuki" },
  { number: 11, numberJa: "ju ichi", nameEn: "wrist downward turn", nameJa: "katate gedan gaeshi" },
  { number: 12, numberJa: "ju ni", nameEn: "wrist bridging strike", nameJa: "katate toma uchi" },
  { number: 13, numberJa: "ju san", nameEn: "wrist figure eight turn", nameJa: "katate hachi no ji gaeshi" },
  { number: 14, numberJa: "ju shi", nameEn: "figure eight turn and strike", nameJa: "hasso gaeshi uchi" },
  { number: 15, numberJa: "ju go", nameEn: "figure eight turn and thrust", nameJa: "hasso gaeshi tsuki" },
  { number: 16, numberJa: "ju roku", nameEn: "figure eight turn rear thrust", nameJa: "hasso gaeshi ushiro tsuki" },
  { number: 17, numberJa: "ju shichi", nameEn: "figure eight turn rear strike", nameJa: "hasso gaeshi ushiro uchi" },
  { number: 18, numberJa: "ju hachi", nameEn: "figure eight turn rear sweep", nameJa: "hasso gaeshi ushiro barai" },
  { number: 19, numberJa: "ju kyu", nameEn: "left turn flowing strike", nameJa: "hidari nagare gaeshi uchi" },
  { number: 20, numberJa: "ni ju", nameEn: "right turn flowing thrust", nameJa: "migi nagare gaeshi tsuki" },
] as const;

export type Level = "4-kyu" | "3-kyu";
export type Mode = "A" | "B" | "C";

export const LEVEL_LABEL: Record<Level, string> = {
  "4-kyu": "4th kyu (1–5)",
  "3-kyu": "3rd kyu (1–20)",
};

export const MODE_LABEL: Record<Mode, string> = {
  A: "Easy — pick from 3",
  B: "Medium — pick from full list",
  C: "Hard — type the name",
};

export function deckFor(level: Level): readonly Suburi[] {
  return level === "4-kyu" ? SUBURI.slice(0, 5) : SUBURI;
}
