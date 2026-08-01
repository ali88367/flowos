import { extractDueDate } from '@/features/assistant/dateParse';

/**
 * Parses a free-text "command" like "Website Redesign due next friday" into
 * a project name plus an optional deadline, reusing the assistant's date parser.
 */
export function parseProjectCommand(raw: string): { name: string; deadline?: string } {
  const { date, rest } = extractDueDate(raw);
  const name = rest
    .replace(/\b(?:due|by|on)\s*$/i, '')
    .replace(/[.!]+$/, '')
    .trim();
  return { name, deadline: date };
}
