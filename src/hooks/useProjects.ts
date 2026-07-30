import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Project, ProjectDraft } from '@/types';
import { createProject, deleteProject, listProjects, updateProject } from '@/services';

export const projectKeys = {
  all: ['projects'] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn: listProjects,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draft: ProjectDraft) => createProject(draft),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Project> }) =>
      updateProject(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
