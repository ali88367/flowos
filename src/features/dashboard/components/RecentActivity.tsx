import { CheckCircle2, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { Task } from '@/types';
import { formatRelativeTime } from '@/utils/date';

interface RecentActivityProps {
  tasks: Task[];
}

export function RecentActivity({ tasks }: RecentActivityProps) {
  const recent = tasks
    .filter((t) => t.completed && t.completedAt)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <EmptyState icon={History} title="No activity yet" description="Completed tasks will show up here." />
        ) : (
          <ul className="space-y-3">
            {recent.map((task) => (
              <li key={task.id} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                <span className="flex-1 truncate text-muted-foreground">{task.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground/70">
                  {formatRelativeTime(task.completedAt!)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
