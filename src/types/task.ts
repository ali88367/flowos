export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  projectId?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type TaskDraft = Pick<Task, 'title'> &
  Partial<Pick<Task, 'notes' | 'dueDate' | 'projectId'>>;

export type TaskView = 'today' | 'upcoming' | 'completed' | 'all';
