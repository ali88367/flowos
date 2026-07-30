import { AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { TaskItem } from '@/features/tasks/components/TaskItem';
import type { Project, Task } from '@/types';

interface TodayTaskListProps {
  tasks: Task[];
  projectsById: Map<string, Project>;
}

export function TodayTaskList({ tasks, projectsById }: TodayTaskListProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Today's Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="All clear for today" description="Nothing left to do — enjoy it." />
        ) : (
          <ul className="space-y-0.5">
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} project={task.projectId ? projectsById.get(task.projectId) : undefined} />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
