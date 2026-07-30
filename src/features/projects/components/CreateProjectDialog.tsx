import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/uiStore';
import { useCreateProject } from '@/hooks/useProjects';
import { toast } from '@/store/toastStore';
import { PROJECT_COLORS, type ProjectColor } from '@/types';
import { cn } from '@/utils/cn';

const COLOR_SWATCH: Record<ProjectColor, string> = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  cyan: 'bg-cyan-500',
};

export function CreateProjectDialog() {
  const open = useUIStore((s) => s.newProjectOpen);
  const setOpen = useUIStore((s) => s.setNewProjectOpen);
  const createProject = useCreateProject();

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [deadline, setDeadline] = useState('');
  const [color, setColor] = useState<ProjectColor>('violet');

  useEffect(() => {
    if (open) {
      setName('');
      setNotes('');
      setDeadline('');
      setColor('violet');
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    createProject.mutate(
      { name: trimmed, notes: notes.trim() || undefined, deadline: deadline || undefined, color },
      {
        onSuccess: () => {
          toast({ title: 'Project created', description: trimmed });
          setOpen(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            autoFocus
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[64px]"
          />
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-6 w-6 rounded-full transition-transform',
                    COLOR_SWATCH[c],
                    color === c ? 'ring-2 ring-offset-2 ring-offset-popover ring-foreground scale-105' : 'opacity-70',
                  )}
                  aria-label={c}
                />
              ))}
            </div>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-auto"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || createProject.isPending}>
              Create project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
