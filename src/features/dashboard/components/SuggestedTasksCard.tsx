import { useMemo, useState } from 'react';
import { Plus, Wand2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { todayKey } from '@/utils/date';
import { suggestDailyTasks } from '../suggestDailyTasks';

export function SuggestedTasksCard() {
  const { data: tasks } = useTasks();
  const { data: projects } = useProjects();
  const updateTask = useUpdateTask();
  const createTask = useCreateTask();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const suggestions = useMemo(
    () => suggestDailyTasks(tasks ?? [], projects ?? []).filter((s) => !dismissed.has(s.key)),
    [tasks, projects, dismissed],
  );

  if (suggestions.length === 0) return null;

  function accept(s: (typeof suggestions)[number]) {
    if (s.kind === 'reschedule' && s.taskId) {
      updateTask.mutate({ id: s.taskId, patch: { dueDate: todayKey() } });
    } else {
      createTask.mutate({ title: s.title, dueDate: todayKey(), projectId: s.projectId });
    }
    setDismissed((prev) => new Set(prev).add(s.key));
  }

  function dismiss(key: string) {
    setDismissed((prev) => new Set(prev).add(key));
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2">
        <Wand2 className="h-4 w-4 text-accent" />
        <CardTitle>Suggested for Today</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {suggestions.map((s) => (
          <div key={s.key} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted/50">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{s.title}</p>
              <p className="truncate text-xs text-muted-foreground">{s.reason}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button size="sm" variant="outline" onClick={() => accept(s)}>
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => dismiss(s.key)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
