import type { Idea, Project, Task } from '@/types';
import { formatDueDate, isOverdue, isToday, isUpcoming } from '@/utils/date';
import { currentStreak, tasksCompletedInRange, weekRange } from '@/features/analytics/utils';
import { fuzzyMatch } from './fuzzyMatch';
import type { AssistantIntent } from './types';

function listTitles(tasks: Task[]): string {
  return tasks.map((t) => `• ${t.title}`).join('\n');
}

export function answerQuery(
  intent: Extract<AssistantIntent, { type: 'query' }>,
  tasks: Task[],
  projects: Project[],
  ideas: Idea[],
): string {
  switch (intent.kind) {
    case 'today': {
      const due = tasks.filter((t) => !t.completed && isToday(t.dueDate));
      return due.length === 0 ? "Nothing due today. You're clear." : `Due today:\n${listTitles(due)}`;
    }
    case 'overdue': {
      const late = tasks.filter((t) => !t.completed && isOverdue(t.dueDate));
      return late.length === 0 ? 'Nothing overdue — you\'re all caught up.' : `Overdue:\n${listTitles(late)}`;
    }
    case 'upcoming': {
      const soon = tasks.filter((t) => !t.completed && isUpcoming(t.dueDate));
      return soon.length === 0 ? 'Nothing upcoming on the calendar yet.' : `Upcoming:\n${listTitles(soon)}`;
    }
    case 'streak': {
      const streak = currentStreak(tasks);
      return streak === 0
        ? "No active streak yet — complete a task today to start one."
        : `You're on a ${streak}-day streak. Keep it going.`;
    }
    case 'week_completed': {
      const { start, end } = weekRange();
      const count = tasksCompletedInRange(tasks, start, end).length;
      return `You've completed ${count} task${count === 1 ? '' : 's'} this week.`;
    }
    case 'task_count': {
      const active = tasks.filter((t) => !t.completed).length;
      const completed = tasks.length - active;
      return `You have ${active} task${active === 1 ? '' : 's'} left, ${completed} completed overall.`;
    }
    case 'projects_list': {
      if (projects.length === 0) return "You don't have any projects yet.";
      const lines = projects.map((p) => {
        const projectTasks = tasks.filter((t) => t.projectId === p.id);
        const done = projectTasks.filter((t) => t.completed).length;
        const pct = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0;
        return `• ${p.name} — ${pct}% complete`;
      });
      return lines.join('\n');
    }
    case 'project_progress': {
      const query = intent.projectQuery?.trim();
      if (!query) return 'Which project did you mean?';
      const matches = fuzzyMatch(query, projects, (p) => p.name);
      if (matches.length === 0) return `I couldn't find a project matching "${query}".`;
      const project = matches[0];
      const projectTasks = tasks.filter((t) => t.projectId === project.id);
      const done = projectTasks.filter((t) => t.completed).length;
      const remaining = projectTasks.length - done;
      const pct = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0;
      const deadline = project.deadline ? `, due ${formatDueDate(project.deadline)}` : '';
      return `${project.name} is ${pct}% complete — ${remaining} task${remaining === 1 ? '' : 's'} left${deadline}.`;
    }
    case 'ideas_list': {
      if (ideas.length === 0) return "You don't have any ideas captured yet.";
      return `Ideas:\n${ideas.map((i) => `• ${i.title}`).join('\n')}`;
    }
    case 'help':
    default:
      return [
        'Here are some things I can do:',
        '• "add task buy milk tomorrow"',
        '• "add call mom to the health project friday"',
        '• "complete wire up command palette"',
        '• "delete task cleanup"',
        '• "create project Marketing Site"',
        '• "add idea dark mode toggle"',
        '• "what\'s due today", "what\'s overdue", "how many tasks left"',
        '• "how\'s FlowOS Launch going", "list ideas"',
      ].join('\n');
  }
}
