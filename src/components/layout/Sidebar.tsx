import { NavLink } from 'react-router-dom';
import { ChevronsLeft, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/store/uiStore';
import { NAV_ITEMS } from './nav-items';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          'hidden md:flex h-svh shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out',
          collapsed ? 'w-[68px]' : 'w-60',
        )}
      >
        <div className={cn('flex items-center gap-2 px-4 py-5', collapsed && 'justify-center px-0')}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Sparkles className="h-4 w-4" strokeWidth={2.25} />
          </div>
          {!collapsed && <span className="text-[15px] font-semibold tracking-tight">FlowOS</span>}
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-2.5">
          {NAV_ITEMS.map((item) => {
            const link = (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-150',
                    collapsed && 'justify-center px-0 py-2.5',
                    isActive
                      ? 'bg-accent-soft text-accent'
                      : 'text-sidebar-foreground/70 hover:bg-muted hover:text-sidebar-foreground',
                  )
                }
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );

            if (!collapsed) return link;

            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <div className={cn('px-2.5 pb-4', collapsed && 'flex justify-center')}>
          <button
            type="button"
            onClick={toggleSidebar}
            className={cn(
              'flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground/60 transition-colors hover:bg-muted hover:text-sidebar-foreground',
              collapsed && 'justify-center px-0',
            )}
          >
            <ChevronsLeft
              className={cn('h-[18px] w-[18px] transition-transform duration-200', collapsed && 'rotate-180')}
            />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
