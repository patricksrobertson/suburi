import { numberFormsFor } from "./suburi";

export type NumbersDeckId = "1-10" | "1-31";

export type NumbersCard = {
  number: number;
  numberJa: string;
};

export const NUMBERS_DECKS: readonly NumbersDeckId[] = ["1-10", "1-31"];

export const NUMBERS_DECK_LABEL: Record<NumbersDeckId, string> = {
  "1-10": "1–10",
  "1-31": "1–31 (jo kata)",
};

export function numbersDeckFor(id: NumbersDeckId): NumbersCard[] {
  const max = id === "1-10" ? 10 : 31;
  return Array.from({ length: max }, (_, i) => {
    const n = i + 1;
    const forms = numberFormsFor(n);
    return { number: n, numberJa: forms[0] ?? String(n) };
  });
}

export type NumbersDirection = "japanese" | "english";

export const NUMBERS_DIRECTIONS: readonly NumbersDirection[] = [
  "japanese",
  "english",
];

export const NUMBERS_DIRECTION_LABEL: Record<NumbersDirection, string> = {
  japanese: "Japanese",
  english: "English",
};

export const NUMBERS_DIRECTION_HELP: Record<NumbersDirection, string> = {
  japanese: "Given the arabic number, give the romaji.",
  english: "Given the romaji, give the arabic number.",
};

export const NUMBERS_DIRECTION_HEADER: Record<NumbersDirection, string> = {
  japanese: "answering japanese",
  english: "answering english",
};
