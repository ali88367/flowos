import { fuzzyMatch } from './fuzzyMatch';

/**
 * Fuzzy-resolves `query` against `items` and either performs `action` on a
 * single confident match, or returns a clarifying message — never guesses
 * on ambiguous or missing matches, since these actions (delete, complete)
 * aren't easily undoable from the chat.
 */
export async function resolveAndAct<T extends { id: string }>(
  query: string,
  items: T[],
  getLabel: (item: T) => string,
  action: (item: T) => Promise<string>,
  noun: string,
): Promise<string> {
  const trimmed = query.trim();
  if (!trimmed) return `Which ${noun} did you mean?`;

  const matches = fuzzyMatch(trimmed, items, getLabel);

  if (matches.length === 0) {
    return `No ${noun} matches "${trimmed}".`;
  }

  if (matches.length > 1 && matches.length <= 8) {
    const top = matches[0];
    const runnerUp = matches[1];
    // Only proceed automatically when the top match is a clear substring hit
    // and clearly better than the next candidate — otherwise ask.
    const topLabel = getLabel(top).toLowerCase();
    const isConfident = topLabel.includes(trimmed.toLowerCase()) && topLabel !== getLabel(runnerUp).toLowerCase();
    if (!isConfident) {
      const list = matches
        .slice(0, 5)
        .map((m) => `"${getLabel(m)}"`)
        .join(', ');
      return `That matches a few ${noun}s: ${list}. Which one did you mean?`;
    }
  }

  return action(matches[0]);
}
