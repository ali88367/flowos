import { useMemo } from 'react';
import { CheckCircle2, Flame, ListChecks, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { StatCard } from './components/StatCard';
import { ActivityReport } from './components/ActivityReport';
import {
  completionRate,
  currentStreak,
  monthRange,
  tasksCompletedInRange,
  tasksDueInRange,
  weekRange,
} from './utils';

const PROJECT_ACCENT: Record<string, string> = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  cyan: 'bg-cyan-500',
};

export default function AnalyticsPage() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const stats = useMemo(() => {
    const list = tasks ?? [];
    const week = weekRange();
    const month = monthRange();
    return {
      completedThisWeek: tasksCompletedInRange(list, week.start, week.end).length,
      streak: currentStreak(list),
      weeklyRate: completionRate(tasksDueInRange(list, week.start, week.end)),
      monthlyRate: completionRate(tasksDueInRange(list, month.start, month.end)),
    };
  }, [tasks]);

  if (tasksLoading || projectsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const activeProjects = (projects ?? []).filter((p) => !p.archived);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Completed this week" value={String(stats.completedThisWeek)} />
        <StatCard icon={Flame} label="Current streak" value={`${stats.streak}d`} />
        <StatCard icon={ListChecks} label="Weekly completion" value={`${stats.weeklyRate}%`} />
        <StatCard icon={TrendingUp} label="Monthly completion" value={`${stats.monthlyRate}%`} />
      </div>

      <ActivityReport tasks={tasks ?? []} projects={activeProjects} />

      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {activeProjects.length === 0 ? (
            <EmptyState icon={ListChecks} title="No projects yet" className="py-8" />
          ) : (
            <div className="space-y-4">
              {activeProjects.map((project) => {
                const projectTasks = (tasks ?? []).filter((t) => t.projectId === project.id);
                const completed = projectTasks.filter((t) => t.completed).length;
                const total = projectTasks.length;
                const progress = total > 0 ? (completed / total) * 100 : 0;
                return (
                  <div key={project.id}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${PROJECT_ACCENT[project.color]}`} />
                        {project.name}
                      </span>
                      <span className="text-muted-foreground">
                        {completed}/{total}
                      </span>
                    </div>
                    <ProgressBar value={progress} />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
