import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ListChecks, Plus, Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useTasks, useToggleTask } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useUIStore } from '@/store/uiStore';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { isOverdue, isToday, isUpcoming } from '@/utils/date';
import { ReorderableTaskList } from './components/ReorderableTaskList';
import { TaskItem } from './components/TaskItem';
import type { Task } from '@/types';

type TabValue = 'today' | 'upcoming' | 'completed';

export default function TasksPage() {
  const { data: tasks, isLoading } = useTasks();
  const { data: projects } = useProjects();
  const setQuickAddOpen = useUIStore((s) => s.setQuickAddOpen);
  const toggleTask = useToggleTask();
  const [tab, setTab] = useState<TabValue>('today');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const projectsById = useMemo(() => new Map((projects ?? []).map((p) => [p.id, p])), [projects]);
  const allSorted = tasks ?? [];

  const byTab = useMemo(() => {
    const today: Task[] = [];
    const upcoming: Task[] = [];
    const completed: Task[] = [];
    for (const t of allSorted) {
      if (t.completed) {
        completed.push(t);
      } else if (isUpcoming(t.dueDate)) {
        upcoming.push(t);
      } else if (isToday(t.dueDate) || isOverdue(t.dueDate) || !t.dueDate) {
        today.push(t);
      }
    }
    completed.sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
    return { today, upcoming, completed };
  }, [allSorted]);

  const filterByQuery = (list: Task[]) =>
    query.trim() ? list.filter((t) => t.title.toLowerCase().includes(query.trim().toLowerCase())) : list;

  const visible = filterByQuery(byTab[tab]);

  useEffect(() => {
    setSelectedId(null);
  }, [tab, query]);

  useKeyboardShortcut({
    key: 'ArrowDown',
    handler: () => {
      if (visible.length === 0) return;
      const idx = visible.findIndex((t) => t.id === selectedId);
      setSelectedId(visible[idx === -1 ? 0 : (idx + 1) % visible.length].id);
    },
  });
  useKeyboardShortcut({
    key: 'ArrowUp',
    handler: () => {
      if (visible.length === 0) return;
      const idx = visible.findIndex((t) => t.id === selectedId);
      setSelectedId(visible[idx === -1 ? visible.length - 1 : (idx - 1 + visible.length) % visible.length].id);
    },
  });
  useKeyboardShortcut({
    key: ' ',
    handler: () => {
      const task = visible.find((t) => t.id === selectedId);
      if (task) toggleTask.mutate({ id: task.id, completed: !task.completed });
    },
    enabled: Boolean(selectedId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <Button size="sm" onClick={() => setQuickAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add task
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks…"
            className="pl-8"
          />
        </div>
      </div>

      <Tabs value={tab}>
        <TabsContent value="today" className="mt-0">
          {visible.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="Nothing due today" description="Add a task or enjoy the clear day." />
          ) : (
            <ReorderableTaskList
              tasks={visible}
              allTasks={allSorted}
              projectsById={projectsById}
              draggable
              selectedId={selectedId}
              onSelectTask={setSelectedId}
            />
          )}
        </TabsContent>
        <TabsContent value="upcoming" className="mt-0">
          {visible.length === 0 ? (
            <EmptyState icon={ListChecks} title="No upcoming tasks" description="Future tasks will show up here." />
          ) : (
            <ReorderableTaskList
              tasks={visible}
              allTasks={allSorted}
              projectsById={projectsById}
              draggable
              selectedId={selectedId}
              onSelectTask={setSelectedId}
            />
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          {visible.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="No completed tasks yet" description="Finish a task to see it here." />
          ) : (
            <ul className="space-y-0.5">
              {visible.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  project={task.projectId ? projectsById.get(task.projectId) : undefined}
                  selected={task.id === selectedId}
                  onClick={() => setSelectedId(task.id)}
                />
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
