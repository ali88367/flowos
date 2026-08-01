import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Idea, IdeaDraft } from '@/types';
import { createIdea, deleteIdea, listIdeas, updateIdea } from '@/services';

export const ideaKeys = {
  all: ['ideas'] as const,
};

export function useIdeas() {
  return useQuery({
    queryKey: ideaKeys.all,
    queryFn: listIdeas,
  });
}

export function useCreateIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draft: IdeaDraft) => createIdea(draft),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ideaKeys.all }),
  });
}

export function useUpdateIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Pick<Idea, 'title' | 'body'>> }) =>
      updateIdea(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ideaKeys.all }),
  });
}

export function useDeleteIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteIdea(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ideaKeys.all }),
  });
}
