import { shuffle } from "./shuffle";

export function pickOptions<T extends { number: number }>(
  correct: T,
  pool: readonly T[],
  count: number,
): T[] {
  const others = pool.filter((s) => s.number !== correct.number);
  const distractors = shuffle(others).slice(0, Math.max(0, count - 1));
  return shuffle([correct, ...distractors]);
}
