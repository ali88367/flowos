import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TaskItem } from './TaskItem';
import type { Project, Task } from '@/types';
import { useReorderTasks } from '@/hooks/useTasks';
import { mergeReorder } from '@/utils/reorder';

interface ReorderableTaskListProps {
  tasks: Task[];
  allTasks: Task[];
  projectsById: Map<string, Project>;
  draggable?: boolean;
  selectedId?: string | null;
  onSelectTask?: (id: string) => void;
}

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function ReorderableTaskList({
  tasks,
  allTasks,
  projectsById,
  draggable = false,
  selectedId,
  onSelectTask,
}: ReorderableTaskListProps) {
  const [items, setItems] = useState(tasks);
  const draggedIndex = useRef<number | null>(null);
  const reorderTasks = useReorderTasks();

  useEffect(() => {
    setItems(tasks);
  }, [tasks]);

  function handleDrop() {
    if (draggedIndex.current === null) return;
    draggedIndex.current = null;
    const allIds = allTasks.map((t) => t.id);
    const visibleIds = tasks.map((t) => t.id);
    const newVisibleOrder = items.map((t) => t.id);
    reorderTasks.mutate(mergeReorder(allIds, visibleIds, newVisibleOrder));
  }

  return (
    <ul className="space-y-0.5">
      <AnimatePresence initial={false}>
        {items.map((task, index) => (
          <div
            key={task.id}
            draggable={draggable}
            onDragStart={() => {
              draggedIndex.current = index;
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (draggedIndex.current === null || draggedIndex.current === index) return;
              setItems((prev) => arrayMove(prev, draggedIndex.current!, index));
              draggedIndex.current = index;
            }}
            onDrop={handleDrop}
            onDragEnd={handleDrop}
          >
            <TaskItem
              task={task}
              project={task.projectId ? projectsById.get(task.projectId) : undefined}
              dragHandleProps={draggable ? {} : undefined}
              selected={task.id === selectedId}
              onClick={onSelectTask ? () => onSelectTask(task.id) : undefined}
            />
          </div>
        ))}
      </AnimatePresence>
    </ul>
  );
}
