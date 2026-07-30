/**
 * Storage-agnostic collection adapter. Implement this interface against any
 * backend (localStorage today, Supabase later) and the rest of the app
 * never needs to change.
 */
export interface CollectionAdapter<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  create(item: T): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
  replaceAll(items: T[]): Promise<void>;
}
