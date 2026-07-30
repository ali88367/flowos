import type { Project, ProjectDraft } from '@/types';
import { generateId } from '@/utils/id';
import { projectAdapter } from './db/adapters';

export async function listProjects(): Promise<Project[]> {
  const projects = await projectAdapter.list();
  return projects.sort((a, b) => a.order - b.order);
}

export async function createProject(draft: ProjectDraft): Promise<Project> {
  const existing = await projectAdapter.list();
  const now = new Date().toISOString();
  const project: Project = {
    id: generateId(),
    name: draft.name,
    notes: draft.notes,
    color: draft.color ?? 'violet',
    deadline: draft.deadline,
    archived: false,
    order: existing.length,
    createdAt: now,
    updatedAt: now,
  };
  return projectAdapter.create(project);
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<Project> {
  return projectAdapter.update(id, { ...patch, updatedAt: new Date().toISOString() });
}

export async function deleteProject(id: string): Promise<void> {
  return projectAdapter.remove(id);
}
