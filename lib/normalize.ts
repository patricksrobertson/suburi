export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[\s\-_]+/g, "");
}

export function answersMatch(typed: string, canonical: string): boolean {
  return normalize(typed) === normalize(canonical);
}
