import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Task, TaskDraft } from '@/types';
import {
  createTask,
  deleteTask,
  listTasks,
  reorderTasks,
  toggleTaskComplete,
  updateTask,
} from '@/services';

export const taskKeys = {
  all: ['tasks'] as const,
};

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: listTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draft: TaskDraft) => createTask(draft),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Task> }) => updateTask(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      toggleTaskComplete(id, completed),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const previous = queryClient.getQueryData<Task[]>(taskKeys.all);
      queryClient.setQueryData<Task[]>(taskKeys.all, (old) =>
        old?.map((t) =>
          t.id === id
            ? { ...t, completed, completedAt: completed ? new Date().toISOString() : undefined }
            : t,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(taskKeys.all, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export function useReorderTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => reorderTasks(orderedIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
