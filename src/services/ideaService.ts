import type { Idea, IdeaDraft } from '@/types';
import { generateId } from '@/utils/id';
import { ideaAdapter } from './db/adapters';

export async function listIdeas(): Promise<Idea[]> {
  const ideas = await ideaAdapter.list();
  return ideas.sort((a, b) => b.order - a.order);
}

export async function createIdea(draft: IdeaDraft): Promise<Idea> {
  const existing = await ideaAdapter.list();
  const now = new Date().toISOString();
  const idea: Idea = {
    id: generateId(),
    title: draft.title,
    body: draft.body ?? '',
    order: existing.length,
    createdAt: now,
    updatedAt: now,
  };
  return ideaAdapter.create(idea);
}

export async function updateIdea(id: string, patch: Partial<Pick<Idea, 'title' | 'body'>>): Promise<Idea> {
  return ideaAdapter.update(id, { ...patch, updatedAt: new Date().toISOString() });
}

export async function deleteIdea(id: string): Promise<void> {
  return ideaAdapter.remove(id);
}
