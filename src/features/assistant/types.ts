export type QueryKind =
  | 'today'
  | 'overdue'
  | 'upcoming'
  | 'streak'
  | 'week_completed'
  | 'projects_list'
  | 'project_progress'
  | 'task_count'
  | 'help';

export type AssistantIntent =
  | { type: 'create_task'; title: string; dueDate?: string; projectQuery?: string }
  | { type: 'create_project'; name: string }
  | { type: 'delete_task'; query: string }
  | { type: 'complete_task'; query: string }
  | { type: 'uncomplete_task'; query: string }
  | { type: 'delete_project'; query: string }
  | { type: 'query'; kind: QueryKind; projectQuery?: string }
  | { type: 'unknown'; text: string };

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
}
