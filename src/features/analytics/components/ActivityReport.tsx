import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import type { Project, Task } from '@/types';
import { monthRange, tasksCompletedInRange, weekRange } from '../utils';

const PROJECT_ACCENT: Record<string, string> = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  cyan: 'bg-cyan-500',
};

interface ActivityReportProps {
  tasks: Task[];
  projects: Project[];
}

type RangeValue = 'week' | 'month';

export function ActivityReport({ tasks, projects }: ActivityReportProps) {
  const [range, setRange] = useState<RangeValue>('week');
  const projectsById = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);

  const { start, end } = range === 'week' ? weekRange() : monthRange();
  const completed = useMemo(
    () => tasksCompletedInRange(tasks, start, end).sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? '')),
    [tasks, start, end],
  );

  const byDay = useMemo(() => {
    const groups = new Map<string, Task[]>();
    for (const task of completed) {
      const key = format(new Date(task.completedAt!), 'EEEE, MMM d');
      const list = groups.get(key) ?? [];
      list.push(task);
      groups.set(key, list);
    }
    return groups;
  }, [completed]);

  const byProject = useMemo(() => {
    const counts = new Map<string, number>();
    for (const task of completed) {
      const key = task.projectId ?? '__none';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [completed]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Activity Report</CardTitle>
        <Tabs value={range} onValueChange={(v) => setRange(v as RangeValue)}>
          <TabsList>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-5">
        {completed.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="Nothing completed yet"
            description={`No tasks finished this ${range === 'week' ? 'week' : 'month'} so far.`}
            className="py-8"
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              You completed <span className="font-semibold text-foreground">{completed.length}</span> task
              {completed.length === 1 ? '' : 's'} this {range === 'week' ? 'week' : 'month'}.
            </p>

            {byProject.size > 0 && (
              <div className="flex flex-wrap gap-2">
                {Array.from(byProject.entries()).map(([projectId, count]) => {
                  const project = projectId === '__none' ? undefined : projectsById.get(projectId);
                  return (
                    <span
                      key={projectId}
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs"
                    >
                      {project && (
                        <span className={`h-1.5 w-1.5 rounded-full ${PROJECT_ACCENT[project.color]}`} />
                      )}
                      {project ? project.name : 'No project'} · {count}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="space-y-4">
              {Array.from(byDay.entries()).map(([day, dayTasks]) => (
                <div key={day}>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">{day}</p>
                  <ul className="space-y-1">
                    {dayTasks.map((task) => (
                      <li key={task.id} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                        <span className="truncate">{task.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
