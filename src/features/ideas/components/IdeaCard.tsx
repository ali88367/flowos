import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useDeleteIdea, useUpdateIdea } from '@/hooks/useIdeas';
import type { Idea } from '@/types';

interface IdeaCardProps {
  idea: Idea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const updateIdea = useUpdateIdea();
  const deleteIdea = useDeleteIdea();
  const [title, setTitle] = useState(idea.title);
  const [body, setBody] = useState(idea.body);

  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title.trim() && title !== idea.title && updateIdea.mutate({ id: idea.id, patch: { title } })}
            className="border-0 bg-transparent px-0 text-sm font-semibold focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => deleteIdea.mutate(idea.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onBlur={() => body !== idea.body && updateIdea.mutate({ id: idea.id, patch: { body } })}
          placeholder="Expand on this…"
          className="min-h-[80px] border-0 bg-muted/40 text-sm focus-visible:ring-1"
        />
      </CardContent>
    </Card>
  );
}
