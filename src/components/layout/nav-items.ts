import { BarChart3, FolderKanban, LayoutDashboard, Lightbulb, ListChecks, NotebookPen, Settings } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  shortcut?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, shortcut: 'D' },
  { label: 'Tasks', path: '/tasks', icon: ListChecks },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Daily Log', path: '/daily-log', icon: NotebookPen },
  { label: 'Ideas', path: '/ideas', icon: Lightbulb },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];
