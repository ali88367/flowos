import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteProject, useProjects, useUpdateProject } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { formatDueDate } from '@/utils/date';
import { cn } from '@/utils/cn';
import { InlineTaskAdd } from '@/features/tasks/components/InlineTaskAdd';
import { TaskItem } from '@/features/tasks/components/TaskItem';
import { ProjectTimeline } from './components/ProjectTimeline';

const PROJECT_ACCENT: Record<string, string> = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  cyan: 'bg-cyan-500',
};

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const project = useMemo(() => projects?.find((p) => p.id === projectId), [projects, projectId]);
  const projectTasks = useMemo(() => (tasks ?? []).filter((t) => t.projectId === projectId), [tasks, projectId]);

  const [notes, setNotes] = useState('');
  useEffect(() => {
    if (project) setNotes(project.notes ?? '');
  }, [project?.id]);

  if (projectsLoading || tasksLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Project not found.</p>
        <Link to="/projects" className="text-sm text-accent hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  const completed = projectTasks.filter((t) => t.completed).length;
  const total = projectTasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const activeTasks = projectTasks.filter((t) => !t.completed);
  const completedTasks = projectTasks.filter((t) => t.completed);

  function handleNotesBlur() {
    if (project && notes !== (project.notes ?? '')) {
      updateProject.mutate({ id: project.id, patch: { notes } });
    }
  }

  function handleDelete() {
    if (!project) return;
    deleteProject.mutate(project.id, { onSuccess: () => navigate('/projects') });
  }

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Projects
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className={cn('h-2.5 w-2.5 rounded-full', PROJECT_ACCENT[project.color])} />
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem destructive onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar value={progress} className="mb-3 h-2" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {completed} of {total} tasks complete
            </span>
            {project.deadline && <span>Due {formatDueDate(project.deadline)}</span>}
          </div>
        </CardContent>
      </Card>

      <ProjectTimeline createdAt={project.createdAt} deadline={project.deadline} />

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Add notes about this project…"
            className="min-h-[90px] border-0 bg-muted/40 focus-visible:ring-1"
          />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Tasks</h2>
        <InlineTaskAdd projectId={project.id} />
        <ul className="space-y-0.5">
          {activeTasks.map((task) => (
            <TaskItem key={task.id} task={task} showProject={false} />
          ))}
          {completedTasks.map((task) => (
            <TaskItem key={task.id} task={task} showProject={false} />
          ))}
        </ul>
      </section>
    </div>
  );
}
