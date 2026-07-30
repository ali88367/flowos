import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NotebookPen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useTodayLog, useUpdateDailyLog } from '@/hooks/useDailyLog';

export function DailyNoteCard() {
  const { data: log } = useTodayLog();
  const updateLog = useUpdateDailyLog();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (log) setNotes(log.notes);
  }, [log?.id]);

  function handleBlur() {
    if (log && notes !== log.notes) {
      updateLog.mutate({ id: log.id, patch: { notes } });
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <NotebookPen className="h-4 w-4 text-muted-foreground" />
          Daily Note
        </CardTitle>
        <Link to="/daily-log" className="text-xs text-accent hover:underline">
          Open log
        </Link>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleBlur}
          placeholder="Jot down a thought for today…"
          className="min-h-[88px] border-0 bg-muted/40 focus-visible:ring-1"
        />
      </CardContent>
    </Card>
  );
}
