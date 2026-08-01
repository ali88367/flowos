import { useState } from 'react';
import { Lightbulb, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateIdea, useIdeas } from '@/hooks/useIdeas';
import { IdeaCard } from './components/IdeaCard';

export default function IdeasPage() {
  const { data: ideas, isLoading } = useIdeas();
  const createIdea = useCreateIdea();
  const [title, setTitle] = useState('');

  function submit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    createIdea.mutate({ title: trimmed });
    setTitle('');
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const allIdeas = ideas ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ideas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A running space for brainstorming — capture it now, refine it later.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Jot down an idea…"
        />
        <Button onClick={submit}>
          <Plus className="h-4 w-4" />
          Add idea
        </Button>
      </div>

      {allIdeas.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="No ideas yet"
          description="Add your first idea above to start brainstorming."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {allIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
