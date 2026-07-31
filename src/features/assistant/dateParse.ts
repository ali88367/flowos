import { addDays, nextDay, type Day } from 'date-fns';
import { todayKey } from '@/utils/date';

const WEEKDAYS: Record<string, Day> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

interface ExtractedDate {
  date?: string;
  /** Input text with the matched date phrase removed. */
  rest: string;
}

/**
 * Pulls a due-date phrase (today, tomorrow, next friday, in 3 days, ...)
 * out of free text and returns the remainder with that phrase stripped,
 * so the caller can treat what's left as the task title.
 */
export function extractDueDate(text: string): ExtractedDate {
  const now = new Date();

  const patterns: Array<{ regex: RegExp; resolve: (match: RegExpMatchArray) => Date }> = [
    { regex: /\btoday\b/i, resolve: () => now },
    { regex: /\btomorrow\b/i, resolve: () => addDays(now, 1) },
    { regex: /\bin (\d+) days?\b/i, resolve: (m) => addDays(now, Number(m[1])) },
    { regex: /\bnext week\b/i, resolve: () => addDays(now, 7) },
    {
      regex: /\bnext (sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
      resolve: (m) => addDays(nextDay(now, WEEKDAYS[m[1].toLowerCase()]), 7),
    },
    {
      regex: /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
      resolve: (m) => {
        const target = WEEKDAYS[m[1].toLowerCase()];
        return target === now.getDay() ? now : nextDay(now, target);
      },
    },
  ];

  for (const { regex, resolve } of patterns) {
    const match = text.match(regex);
    if (match) {
      const date = resolve(match);
      const rest = text.replace(regex, ' ').replace(/\s+/g, ' ').trim();
      return { date: todayKey(date), rest };
    }
  }

  return { rest: text };
}
