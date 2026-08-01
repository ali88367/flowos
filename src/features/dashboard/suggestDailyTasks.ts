import type { Project, Task } from '@/types';
import { isOverdue, isToday } from '@/utils/date';

export interface DailySuggestion {
  key: string;
  title: string;
  reason: string;
  kind: 'reschedule' | 'create';
  taskId?: string;
  projectId?: string;
}

const FALLBACK_TITLES = [
  "Review today's priorities",
  'Plan tomorrow in 5 minutes',
  'Clear out old notes or ideas',
];

/**
 * Rule-based "what should I work on today" generator — no external AI call,
 * just reads overdue tasks and stalled projects from local data.
 */
export function suggestDailyTasks(tasks: Task[], projects: Project[], max = 5): DailySuggestion[] {
  const suggestions: DailySuggestion[] = [];

  const overdue = tasks.filter((t) => !t.completed && isOverdue(t.dueDate));
  for (const t of overdue) {
    if (suggestions.length >= max) break;
    suggestions.push({
      key: `reschedule-${t.id}`,
      title: t.title,
      reason: 'Overdue — move to today',
      kind: 'reschedule',
      taskId: t.id,
    });
  }

  const activeProjects = projects.filter((p) => !p.archived);
  for (const project of activeProjects) {
    if (suggestions.length >= max) break;

    const projectTasks = tasks.filter((t) => t.projectId === project.id && !t.completed);
    if (projectTasks.some((t) => isToday(t.dueDate))) continue;

    const candidate = projectTasks.find((t) => !isOverdue(t.dueDate));
    if (candidate) {
      suggestions.push({
        key: `project-${project.id}`,
        title: candidate.title,
        reason: `Keep momentum on ${project.name}`,
        kind: 'reschedule',
        taskId: candidate.id,
      });
    } else if (projectTasks.length === 0) {
      suggestions.push({
        key: `new-${project.id}`,
        title: `Plan the next step for ${project.name}`,
        reason: 'No open tasks in this project yet',
        kind: 'create',
        projectId: project.id,
      });
    }
  }

  if (suggestions.length === 0) {
    const title = FALLBACK_TITLES[Math.floor(Math.random() * FALLBACK_TITLES.length)];
    suggestions.push({
      key: 'fallback',
      title,
      reason: "You're all caught up — pick your next focus",
      kind: 'create',
    });
  }

  return suggestions.slice(0, max);
}
