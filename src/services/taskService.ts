import type { Task, TaskDraft } from '@/types';
import { generateId } from '@/utils/id';
import { taskAdapter } from './db/adapters';

export async function listTasks(): Promise<Task[]> {
  const tasks = await taskAdapter.list();
  return tasks.sort((a, b) => a.order - b.order);
}

export async function createTask(draft: TaskDraft): Promise<Task> {
  const existing = await taskAdapter.list();
  const now = new Date().toISOString();
  const task: Task = {
    id: generateId(),
    title: draft.title,
    notes: draft.notes,
    dueDate: draft.dueDate,
    projectId: draft.projectId,
    completed: false,
    order: existing.length,
    createdAt: now,
    updatedAt: now,
  };
  return taskAdapter.create(task);
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<Task> {
  return taskAdapter.update(id, { ...patch, updatedAt: new Date().toISOString() });
}

export async function toggleTaskComplete(id: string, completed: boolean): Promise<Task> {
  return taskAdapter.update(id, {
    completed,
    completedAt: completed ? new Date().toISOString() : undefined,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteTask(id: string): Promise<void> {
  return taskAdapter.remove(id);
}

export async function reorderTasks(orderedIds: string[]): Promise<void> {
  const tasks = await taskAdapter.list();
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const reordered = orderedIds
    .map((id, index) => {
      const task = byId.get(id);
      return task ? { ...task, order: index } : undefined;
    })
    .filter((t): t is Task => Boolean(t));
  await taskAdapter.replaceAll(reordered);
}
