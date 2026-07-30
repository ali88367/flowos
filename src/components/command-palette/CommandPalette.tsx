import { useNavigate } from 'react-router-dom';
import { CircleCheck, FileText, FolderKanban } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useUIStore } from '@/store/uiStore';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { NAV_ITEMS } from '@/components/layout/nav-items';
import { formatDueDate } from '@/utils/date';

export function CommandPalette() {
  const open = useUIStore((s) => s.commandPaletteOpen);
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const navigate = useNavigate();
  const { data: tasks = [] } = useTasks();
  const { data: projects = [] } = useProjects();

  function go(path: string) {
    navigate(path);
    setOpen(false);
  }

  const activeTasks = tasks.filter((t) => !t.completed).slice(0, 8);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search tasks, projects, pages…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {NAV_ITEMS.map((item) => (
            <CommandItem key={item.path} value={`page ${item.label}`} onSelect={() => go(item.path)}>
              <item.icon className="h-4 w-4 text-muted-foreground" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        {activeTasks.length > 0 && (
          <CommandGroup heading="Tasks">
            {activeTasks.map((task) => (
              <CommandItem
                key={task.id}
                value={`task ${task.title}`}
                onSelect={() => go('/tasks')}
              >
                <CircleCheck className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 truncate">{task.title}</span>
                {task.dueDate && (
                  <span className="text-xs text-muted-foreground">{formatDueDate(task.dueDate)}</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {projects.length > 0 && (
          <CommandGroup heading="Projects">
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                value={`project ${project.name}`}
                onSelect={() => go(`/projects/${project.id}`)}
              >
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                {project.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Notes">
          <CommandItem value="daily log notes" onSelect={() => go('/daily-log')}>
            <FileText className="h-4 w-4 text-muted-foreground" />
            Today's Daily Log
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
