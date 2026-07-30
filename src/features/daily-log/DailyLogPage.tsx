import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Eye, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useDailyLogs, useTodayLog, useUpdateDailyLog } from '@/hooks/useDailyLog';
import { useTasks } from '@/hooks/useTasks';
import { parseDateOnly } from '@/utils/date';
import { renderMarkdown } from '@/utils/markdown';
import { cn } from '@/utils/cn';
import type { DailyLog } from '@/types';

export default function DailyLogPage() {
  const { data: today, isLoading: todayLoading } = useTodayLog();
  const { data: logs, isLoading: logsLoading } = useDailyLogs();
  const { data: tasks } = useTasks();
  const updateLog = useUpdateDailyLog();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    if (today && !selectedId) setSelectedId(today.id);
  }, [today, selectedId]);

  const allLogs: DailyLog[] = logs ?? [];
  const selected = allLogs.find((l) => l.id === selectedId) ?? today;

  const [wins, setWins] = useState('');
  const [notes, setNotes] = useState('');
  const [ideas, setIdeas] = useState('');
  const [hours, setHours] = useState(0);
  const [previewNotes, setPreviewNotes] = useState(false);

  useEffect(() => {
    if (selected) {
      setWins(selected.wins);
      setNotes(selected.notes);
      setIdeas(selected.ideas);
      setHours(selected.hoursWorked);
    }
  }, [selected?.id]);

  function save(patch: Partial<Pick<DailyLog, 'wins' | 'notes' | 'ideas' | 'hoursWorked'>>) {
    if (!selected) return;
    updateLog.mutate({ id: selected.id, patch });
  }

  if (todayLoading || logsLoading || !selected) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const completedThatDay = (tasks ?? []).filter(
    (t) => t.completed && t.completedAt?.startsWith(selected.date),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Daily Log</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {format(parseDateOnly(selected.date), 'EEEE, MMMM d')}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={wins}
              onChange={(e) => setWins(e.target.value)}
              onBlur={() => save({ wins })}
              placeholder="What went well today?"
              className="min-h-[80px] border-0 bg-muted/40 focus-visible:ring-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Notes</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setPreviewNotes((v) => !v)}>
              {previewNotes ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {previewNotes ? 'Edit' : 'Preview'}
            </Button>
          </CardHeader>
          <CardContent>
            {previewNotes ? (
              <div
                className="min-h-[120px] rounded-lg bg-muted/40 p-3 text-sm [&_p]:mb-2 [&_ul]:mb-2"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(notes || '*Nothing written yet.*') }}
              />
            ) : (
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => save({ notes })}
                placeholder="Markdown supported — **bold**, *italic*, - lists"
                className="min-h-[120px] border-0 bg-muted/40 focus-visible:ring-1"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={ideas}
              onChange={(e) => setIdeas(e.target.value)}
              onBlur={() => save({ ideas })}
              placeholder="Capture anything worth remembering…"
              className="min-h-[80px] border-0 bg-muted/40 focus-visible:ring-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hours Worked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={24}
                step={0.5}
                value={hours}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setHours(v);
                  save({ hoursWorked: v });
                }}
                className="w-24"
              />
              <Label className="text-sm text-muted-foreground">hours</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {completedThatDay.length === 0 ? (
              <EmptyState icon={CheckCircle2} title="No tasks completed" className="py-8" />
            ) : (
              <ul className="space-y-2">
                {completedThatDay.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    {t.title}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <p className="px-1 text-xs font-medium text-muted-foreground">History</p>
        <div className="space-y-1">
          {allLogs.map((log) => (
            <button
              key={log.id}
              onClick={() => setSelectedId(log.id)}
              className={cn(
                'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted',
                selected.id === log.id && 'bg-accent-soft text-accent',
              )}
            >
              {format(parseDateOnly(log.date), 'MMM d, yyyy')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
