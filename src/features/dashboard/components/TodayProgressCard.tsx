import { Card, CardContent } from '@/components/ui/card';
import { ProgressRing } from '@/components/ui/progress-ring';

interface TodayProgressCardProps {
  completed: number;
  total: number;
}

export function TodayProgressCard({ completed, total }: TodayProgressCardProps) {
  const percent = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <ProgressRing value={percent} size={132} strokeWidth={9}>
          <div className="text-center">
            <p className="text-2xl font-semibold tabular-nums">
              {completed}/{total}
            </p>
          </div>
        </ProgressRing>
        <div className="text-center">
          <p className="text-sm font-medium">Today's Progress</p>
          <p className="text-xs text-muted-foreground">
            {total === 0 ? 'Nothing due today' : `${total - completed} task${total - completed === 1 ? '' : 's'} remaining`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
