import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteProject } from '@/hooks/useProjects';
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
  const deleteProject = useDeleteProject();
  const completed = totalTasks - remainingTasks;
  const progress = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="group relative">
        <Link to={`/projects/${project.id}`} className="absolute inset-0 z-0" aria-label={project.name} />
        <Card className="pointer-events-none relative transition-shadow group-hover:shadow-md">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn('h-2 w-2 rounded-full', PROJECT_ACCENT[project.color])} />
                <p className="text-sm font-semibold">{project.name}</p>
              </div>
              <div className="flex items-center gap-1">
                {project.deadline && (
                  <span className="text-xs text-muted-foreground">{formatDueDate(project.deadline)}</span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="pointer-events-auto z-10 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="pointer-events-auto">
                    <DropdownMenuItem destructive onClick={() => deleteProject.mutate(project.id)}>
                      <Trash2 className="h-4 w-4" />
                      Delete project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <ProgressBar value={progress} className="mb-3" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}% complete</span>
              <span>{remainingTasks} remaining</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
