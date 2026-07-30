import type { CollectionAdapter } from './types';

const NETWORK_DELAY_MS = 0;

function delay<T>(value: T): Promise<T> {
  return NETWORK_DELAY_MS > 0
    ? new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS))
    : Promise.resolve(value);
}

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

/**
 * Creates a CollectionAdapter backed by localStorage. Swap this factory
 * for a Supabase-backed one (same interface) when moving to a remote DB.
 */
export function createLocalStorageAdapter<T extends { id: string }>(
  storageKey: string,
): CollectionAdapter<T> {
  return {
    async list() {
      return delay(read<T>(storageKey));
    },
    async get(id) {
      return delay(read<T>(storageKey).find((item) => item.id === id));
    },
    async create(item) {
      const items = read<T>(storageKey);
      items.push(item);
      write(storageKey, items);
      return delay(item);
    },
    async update(id, patch) {
      const items = read<T>(storageKey);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) throw new Error(`Item ${id} not found in ${storageKey}`);
      const updated = { ...items[index], ...patch };
      items[index] = updated;
      write(storageKey, items);
      return delay(updated);
    },
    async remove(id) {
      const items = read<T>(storageKey).filter((item) => item.id !== id);
      write(storageKey, items);
      return delay(undefined);
    },
    async replaceAll(items) {
      write(storageKey, items);
      return delay(undefined);
    },
  };
}
