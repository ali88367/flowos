import { useMemo } from 'react';
import { FolderKanban } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { isToday } from '@/utils/date';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { GreetingHeader } from './components/GreetingHeader';
import { TodayProgressCard } from './components/TodayProgressCard';
import { TodayTaskList } from './components/TodayTaskList';
import { RecentActivity } from './components/RecentActivity';
import { DailyNoteCard } from './components/DailyNoteCard';
import { ProjectCard } from '@/features/projects/components/ProjectCard';

export default function DashboardPage() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const projectsById = useMemo(() => new Map((projects ?? []).map((p) => [p.id, p])), [projects]);

  const todayTasks = useMemo(() => (tasks ?? []).filter((t) => isToday(t.dueDate)), [tasks]);
  const todayIncomplete = todayTasks.filter((t) => !t.completed);
  const todayCompletedCount = todayTasks.length - todayIncomplete.length;

  const activeProjects = useMemo(() => (projects ?? []).filter((p) => !p.archived).slice(0, 4), [projects]);

  if (tasksLoading || projectsLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-16 w-64" />
        <div className="grid gap-5 md:grid-cols-3">
          <Skeleton className="h-52" />
          <Skeleton className="h-52 md:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <GreetingHeader />

      <div className="grid gap-5 md:grid-cols-3">
        <TodayProgressCard completed={todayCompletedCount} total={todayTasks.length} />
        <div className="md:col-span-2">
          <TodayTaskList tasks={todayIncomplete} projectsById={projectsById} />
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Active Projects</h2>
        {activeProjects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No active projects"
            description="Create a project to start organizing your tasks."
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
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <RecentActivity tasks={tasks ?? []} />
        <DailyNoteCard />
      </div>
    </div>
  );
}
