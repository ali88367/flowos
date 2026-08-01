import { useState } from 'react';
import { FolderKanban, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateProject, useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useUIStore } from '@/store/uiStore';
import { toast } from '@/store/toastStore';
import { formatDueDate } from '@/utils/date';
import { ProjectCard } from './components/ProjectCard';
import { parseProjectCommand } from './parseProjectCommand';

export default function ProjectsPage() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const setNewProjectOpen = useUIStore((s) => s.setNewProjectOpen);
  const createProject = useCreateProject();
  const [command, setCommand] = useState('');

  function submitCommand() {
    const { name, deadline } = parseProjectCommand(command);
    if (!name) return;

    createProject.mutate(
      { name, deadline },
      {
        onSuccess: () => {
          toast({
            title: 'Project created',
            description: deadline ? `${name} — due ${formatDueDate(deadline)}` : name,
          });
          setCommand('');
        },
      },
    );
  }

  if (projectsLoading || tasksLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const activeProjects = (projects ?? []).filter((p) => !p.archived);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <Button size="sm" onClick={() => setNewProjectOpen(true)}>
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitCommand()}
          placeholder="Type a project name, e.g. Website Redesign due next friday"
        />
        <Button variant="outline" onClick={submitCommand}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {activeProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start grouping tasks."
          action={
            <Button size="sm" variant="outline" onClick={() => setNewProjectOpen(true)}>
              <Plus className="h-4 w-4" />
              New project
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {activeProjects.map((project) => {
            const projectTasks = (tasks ?? []).filter((t) => t.projectId === project.id);
            const remaining = projectTasks.filter((t) => !t.completed).length;
            return (
              <ProjectCard
                key={project.id}
                project={project}
                totalTasks={projectTasks.length}
                remainingTasks={remaining}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
