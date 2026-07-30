import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCreateTask } from '@/hooks/useTasks';

interface InlineTaskAddProps {
  projectId?: string;
  placeholder?: string;
}

export function InlineTaskAdd({ projectId, placeholder = 'Add a task and press Enter…' }: InlineTaskAddProps) {
  const [value, setValue] = useState('');
  const createTask = useCreateTask();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    createTask.mutate({ title: trimmed, projectId });
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5">
      <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-auto border-0 p-0 shadow-none focus-visible:ring-0"
      />
    </form>
  );
}
