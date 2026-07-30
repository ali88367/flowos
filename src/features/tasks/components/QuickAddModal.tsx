import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUIStore } from '@/store/uiStore';
import { useCreateTask } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { toast } from '@/store/toastStore';
import { todayKey } from '@/utils/date';

const NO_PROJECT = 'none';

export function QuickAddModal() {
  const open = useUIStore((s) => s.quickAddOpen);
  const setOpen = useUIStore((s) => s.setQuickAddOpen);
  const { data: projects = [] } = useProjects();
  const createTask = useCreateTask();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState(NO_PROJECT);

  useEffect(() => {
    if (open) {
      setTitle('');
      setNotes('');
      setDueDate(todayKey());
      setProjectId(NO_PROJECT);
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    createTask.mutate(
      {
        title: trimmed,
        notes: notes.trim() || undefined,
        dueDate: dueDate || undefined,
        projectId: projectId === NO_PROJECT ? undefined : projectId,
      },
      {
        onSuccess: () => {
          toast({ title: 'Task created', description: trimmed });
          setOpen(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            autoFocus
            placeholder="What needs to get done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[64px]"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="No project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PROJECT}>No project</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || createTask.isPending}>
              Add task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
