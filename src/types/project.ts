export const PROJECT_COLORS = [
  'violet',
  'blue',
  'emerald',
  'amber',
  'rose',
  'cyan',
] as const;

export type ProjectColor = (typeof PROJECT_COLORS)[number];

export interface Project {
  id: string;
  name: string;
  notes?: string;
  color: ProjectColor;
  deadline?: string;
  archived: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type ProjectDraft = Pick<Project, 'name'> &
  Partial<Pick<Project, 'notes' | 'color' | 'deadline'>>;
