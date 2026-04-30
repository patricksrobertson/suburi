import type { Suburi } from "./suburi";
import { shuffle } from "./shuffle";

export function pickOptions(
  correct: Suburi,
  pool: readonly Suburi[],
  count: number,
): Suburi[] {
  const others = pool.filter((s) => s.number !== correct.number);
  const distractors = shuffle(others).slice(0, Math.max(0, count - 1));
  return shuffle([correct, ...distractors]);
}
