import { useCallback } from 'react';
import { useCreateProject, useDeleteProject, useProjects } from '@/hooks/useProjects';
import { useCreateTask, useDeleteTask, useTasks, useToggleTask } from '@/hooks/useTasks';
import { formatDueDate } from '@/utils/date';
import { answerQuery } from './answerQuery';
import { fuzzyMatch } from './fuzzyMatch';
import { parseIntent } from './parseIntent';
import { resolveAndAct } from './resolveAndAct';

export function useAssistantEngine() {
  const { data: tasks = [] } = useTasks();
  const { data: projects = [] } = useProjects();
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();
  const toggleTask = useToggleTask();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const handle = useCallback(
    async (rawText: string): Promise<string> => {
      const intent = parseIntent(rawText);

      switch (intent.type) {
        case 'create_task': {
          if (!intent.title) return 'I need a title — try "add task buy milk tomorrow".';

          let projectId: string | undefined;
          let projectNote = '';
          if (intent.projectQuery) {
            const matches = fuzzyMatch(intent.projectQuery, projects, (p) => p.name);
            if (matches.length === 0) {
              projectNote = ` (couldn't find a project matching "${intent.projectQuery}", left it unassigned)`;
            } else {
              projectId = matches[0].id;
              projectNote = ` in ${matches[0].name}`;
            }
          }

          await createTask.mutateAsync({ title: intent.title, dueDate: intent.dueDate, projectId });
          const dueNote = intent.dueDate ? `, due ${formatDueDate(intent.dueDate)}` : '';
          return `Added "${intent.title}"${projectNote}${dueNote}.`;
        }

        case 'create_project': {
          if (!intent.name) return 'I need a name — try "create project Marketing Site".';
          await createProject.mutateAsync({ name: intent.name });
          return `Created project "${intent.name}".`;
        }

        case 'delete_task':
          return resolveAndAct(
            intent.query,
            tasks,
            (t) => t.title,
            async (task) => {
              await deleteTask.mutateAsync(task.id);
              return `Deleted "${task.title}".`;
            },
            'task',
          );

        case 'complete_task':
          return resolveAndAct(
            intent.query,
            tasks.filter((t) => !t.completed),
            (t) => t.title,
            async (task) => {
              await toggleTask.mutateAsync({ id: task.id, completed: true });
              return `Marked "${task.title}" as done.`;
            },
            'active task',
          );

        case 'uncomplete_task':
          return resolveAndAct(
            intent.query,
            tasks.filter((t) => t.completed),
            (t) => t.title,
            async (task) => {
              await toggleTask.mutateAsync({ id: task.id, completed: false });
              return `Reopened "${task.title}".`;
            },
            'completed task',
          );

        case 'delete_project':
          return resolveAndAct(
            intent.query,
            projects,
            (p) => p.name,
            async (project) => {
              await deleteProject.mutateAsync(project.id);
              return `Deleted project "${project.name}".`;
            },
            'project',
          );

        case 'query':
          return answerQuery(intent, tasks, projects);

        case 'unknown':
        default:
          return 'Not sure what you mean. Try "add task buy milk tomorrow", "what\'s due today", or "help".';
      }
    },
    [tasks, projects, createTask, deleteTask, toggleTask, createProject, deleteProject],
  );

  return { handle };
}
