interface Named {
  id: string;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Ranks items by how well their `getLabel` text matches the query:
 * exact match first, then substring, then word-overlap. Returns items
 * sorted best-first; caller decides how to handle ties/ambiguity.
 */
export function fuzzyMatch<T extends Named>(query: string, items: T[], getLabel: (item: T) => string): T[] {
  const q = normalize(query);
  if (!q) return [];

  const qWords = new Set(q.split(' ').filter(Boolean));

  const scored = items
    .map((item) => {
      const label = normalize(getLabel(item));
      let score = 0;
      if (label === q) score = 100;
      else if (label.includes(q) || q.includes(label)) score = 70;
      else {
        const labelWords = label.split(' ').filter(Boolean);
        const overlap = labelWords.filter((w) => qWords.has(w)).length;
        score = overlap > 0 ? 30 + overlap * 10 : 0;
      }
      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((x) => x.item);
}
