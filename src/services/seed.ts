import type { Project, Task } from '@/types';
import { generateId } from '@/utils/id';
import { todayKey } from '@/utils/date';
import { projectAdapter, taskAdapter } from './db/adapters';

const SEED_FLAG = 'flowos:seeded';

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return todayKey(d);
}

export async function seedIfEmpty(): Promise<void> {
  if (localStorage.getItem(SEED_FLAG)) return;

  const [tasks, projects] = await Promise.all([taskAdapter.list(), projectAdapter.list()]);
  if (tasks.length > 0 || projects.length > 0) {
    localStorage.setItem(SEED_FLAG, '1');
    return;
  }

  const now = new Date().toISOString();

  const launchProject: Project = {
    id: generateId(),
    name: 'FlowOS Launch',
    notes: 'Ship the first version of the personal OS.',
    color: 'violet',
    deadline: addDays(14),
    archived: false,
    order: 0,
    createdAt: now,
    updatedAt: now,
  };
  const healthProject: Project = {
    id: generateId(),
    name: 'Health & Fitness',
    notes: 'Small consistent habits over time.',
    color: 'emerald',
    deadline: addDays(60),
    archived: false,
    order: 1,
    createdAt: now,
    updatedAt: now,
  };

  const seedTasks: Task[] = [
    {
      id: generateId(),
      title: 'Design the dashboard layout',
      completed: true,
      completedAt: now,
      dueDate: todayKey(),
      projectId: launchProject.id,
      order: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: 'Wire up the command palette',
      completed: false,
      dueDate: todayKey(),
      projectId: launchProject.id,
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: 'Write launch announcement',
      completed: false,
      dueDate: addDays(2),
      projectId: launchProject.id,
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: 'Morning run — 20 minutes',
      completed: false,
      dueDate: todayKey(),
      projectId: healthProject.id,
      order: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: 'Plan next week groceries',
      notes: 'Focus on high-protein, low-effort meals.',
      completed: false,
      dueDate: addDays(1),
      order: 4,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: 'Review quarterly goals',
      completed: false,
      dueDate: addDays(5),
      order: 5,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await Promise.all([
    projectAdapter.replaceAll([launchProject, healthProject]),
    taskAdapter.replaceAll(seedTasks),
  ]);

  localStorage.setItem(SEED_FLAG, '1');
}
