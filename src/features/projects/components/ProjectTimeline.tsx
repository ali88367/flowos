import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { parseDateOnly } from '@/utils/date';

interface ProjectTimelineProps {
  createdAt: string;
  deadline?: string;
}

export function ProjectTimeline({ createdAt, deadline }: ProjectTimelineProps) {
  if (!deadline) return null;

  const start = new Date(createdAt).getTime();
  const end = parseDateOnly(deadline).getTime();
  const now = Date.now();
  const percent = end > start ? Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-1.5 rounded-full bg-muted">
          <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-background bg-accent shadow"
            style={{ left: `calc(${percent}% - 6px)` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{format(new Date(createdAt), 'MMM d')}</span>
          <span>{format(parseDateOnly(deadline), 'MMM d, yyyy')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
