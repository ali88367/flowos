import { extractDueDate } from './dateParse';
import type { AssistantIntent } from './types';

function cleanTitle(raw: string): string {
  return raw
    .replace(/^(?:a\s+|the\s+)/i, '')
    .replace(/^(?:task|todo|reminder)\s+(?:called|named|to)?\s*/i, '')
    .replace(/^called\s+/i, '')
    .replace(/[.!]+$/, '')
    .trim();
}

/** Strips a "for/in/to <name> project" phrase and returns the project name + remaining text. */
function extractProject(text: string): { projectQuery?: string; rest: string } {
  const match = text.match(/\b(?:for|in|to)\s+(?:the\s+)?(.+?)\s+project\b/i);
  if (!match) return { rest: text };
  const rest = text.replace(match[0], ' ').replace(/\s+/g, ' ').trim();
  return { projectQuery: match[1].trim(), rest };
}

export function parseIntent(rawText: string): AssistantIntent {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  // --- Explicit action triggers, most specific first ---

  let m = text.match(/^remind me to\s+(.+)$/i);
  if (m) return buildCreateTask(m[1]);

  m = text.match(/^(?:add|create|new)\s+(?:a\s+)?project\s+(?:called\s+)?(.+)$/i);
  if (m) return { type: 'create_project', name: cleanTitle(m[1]) };

  m = text.match(/^(?:delete|remove|archive)\s+(?:the\s+)?project\s+(.+)$/i);
  if (m) return { type: 'delete_project', query: cleanTitle(m[1]) };

  m = text.match(/^mark\s+(.+?)\s+as\s+done$/i);
  if (m) return { type: 'complete_task', query: cleanTitle(m[1]) };

  m = text.match(/^(?:complete|finish|check off|done with)\s+(?:task\s+)?(.+)$/i);
  if (m) return { type: 'complete_task', query: cleanTitle(m[1]) };

  m = text.match(/^(?:uncomplete|reopen|undo)\s+(?:task\s+)?(.+)$/i);
  if (m) return { type: 'uncomplete_task', query: cleanTitle(m[1]) };

  m = text.match(/^(?:delete|remove|cancel)\s+(?:task\s+)?(.+)$/i);
  if (m) return { type: 'delete_task', query: cleanTitle(m[1]) };

  m = text.match(/^(?:add|create|new)\s+(?:a\s+)?(?:task|todo)?\s*(.+)$/i);
  if (m) return buildCreateTask(m[1]);

  // --- Queries (keyword-based, order matters) ---

  if (/help|what can you do|examples?/.test(lower)) return { type: 'query', kind: 'help' };
  if (/streak/.test(lower)) return { type: 'query', kind: 'streak' };
  if (/overdue|late\b/.test(lower)) return { type: 'query', kind: 'overdue' };
  if (/this week.*complet|complet.*this week/.test(lower)) return { type: 'query', kind: 'week_completed' };
  if (/\btoday\b/.test(lower)) return { type: 'query', kind: 'today' };
  if (/upcoming|this week|next few days/.test(lower)) return { type: 'query', kind: 'upcoming' };
  if (/how many|count/.test(lower)) return { type: 'query', kind: 'task_count' };
  if (/(list|show|all).*projects?|projects?.*(list|show)/.test(lower)) {
    return { type: 'query', kind: 'projects_list' };
  }
  if (/project/.test(lower)) {
    const projectQuery = text.replace(/project|progress|how'?s|how is|going|doing|\?/gi, ' ').replace(/\s+/g, ' ').trim();
    return { type: 'query', kind: 'project_progress', projectQuery };
  }

  return { type: 'unknown', text };
}

function buildCreateTask(remainder: string): AssistantIntent {
  const { projectQuery, rest: afterProject } = extractProject(remainder);
  const { date, rest: afterDate } = extractDueDate(afterProject);
  const title = cleanTitle(afterDate);
  return { type: 'create_task', title, dueDate: date, projectQuery };
}
