import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { Project } from '@/types';
import { cn } from '@/utils/cn';
import { formatDueDate } from '@/utils/date';

const PROJECT_ACCENT: Record<Project['color'], string> = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  cyan: 'bg-cyan-500',
};

interface ProjectCardProps {
  project: Project;
  totalTasks: number;
  remainingTasks: number;
}

export function ProjectCard({ project, totalTasks, remainingTasks }: ProjectCardProps) {
  const completed = totalTasks - remainingTasks;
  const progress = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Link to={`/projects/${project.id}`}>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn('h-2 w-2 rounded-full', PROJECT_ACCENT[project.color])} />
                <p className="text-sm font-semibold">{project.name}</p>
              </div>
              {project.deadline && (
                <span className="text-xs text-muted-foreground">{formatDueDate(project.deadline)}</span>
              )}
            </div>
            <ProgressBar value={progress} className="mb-3" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}% complete</span>
              <span>{remainingTasks} remaining</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
