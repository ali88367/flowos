import type { DailyLog, Idea, Project, Task } from '@/types';
import { createLocalStorageAdapter } from './localStorageAdapter';

const STORAGE_PREFIX = 'flowos';

/**
 * Single place that wires each entity to its backing adapter. To migrate to
 * Supabase, swap `createLocalStorageAdapter` for a `createSupabaseAdapter`
 * that satisfies the same `CollectionAdapter<T>` interface — nothing else
 * in the app (stores, hooks, components) needs to change.
 */
export const taskAdapter = createLocalStorageAdapter<Task>(`${STORAGE_PREFIX}:tasks`);
export const projectAdapter = createLocalStorageAdapter<Project>(
  `${STORAGE_PREFIX}:projects`,
);
export const dailyLogAdapter = createLocalStorageAdapter<DailyLog>(
  `${STORAGE_PREFIX}:daily-logs`,
);
export const ideaAdapter = createLocalStorageAdapter<Idea>(`${STORAGE_PREFIX}:ideas`);
