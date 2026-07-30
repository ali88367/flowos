import { motion } from 'framer-motion';
import { GripVertical, StickyNote } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { Project, Task } from '@/types';
import { cn } from '@/utils/cn';
import { formatDueDate, isOverdue } from '@/utils/date';
import { useToggleTask } from '@/hooks/useTasks';

const PROJECT_DOT: Record<Project['color'], string> = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  cyan: 'bg-cyan-500',
};

interface TaskItemProps {
  task: Task;
  project?: Project;
  showProject?: boolean;
  onClick?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  selected?: boolean;
}

export function TaskItem({ task, project, showProject = true, onClick, dragHandleProps, selected }: TaskItemProps) {
  const toggleTask = useToggleTask();
  const overdue = !task.completed && isOverdue(task.dueDate);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:bg-muted/60',
        selected && 'border-border bg-muted/60',
        onClick && 'cursor-pointer',
      )}
    >
      {dragHandleProps && (
        <button
          type="button"
          className="cursor-grab text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          {...dragHandleProps}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => toggleTask.mutate({ id: task.id, completed: checked === true })}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm', task.completed && 'text-muted-foreground line-through')}>
          {task.title}
        </p>
      </div>
      {task.notes && <StickyNote className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />}
      {showProject && project && (
        <Badge variant="secondary" className="hidden shrink-0 items-center gap-1.5 sm:inline-flex">
          <span className={cn('h-1.5 w-1.5 rounded-full', PROJECT_DOT[project.color])} />
          {project.name}
        </Badge>
      )}
      {task.dueDate && (
        <span className={cn('shrink-0 text-xs text-muted-foreground', overdue && 'text-destructive')}>
          {formatDueDate(task.dueDate)}
        </span>
      )}
    </motion.li>
  );
}
