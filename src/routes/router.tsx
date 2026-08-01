import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';

const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const TasksPage = lazy(() => import('@/features/tasks/TasksPage'));
const ProjectsPage = lazy(() => import('@/features/projects/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/features/projects/ProjectDetailPage'));
const DailyLogPage = lazy(() => import('@/features/daily-log/DailyLogPage'));
const IdeasPage = lazy(() => import('@/features/ideas/IdeasPage'));
const AnalyticsPage = lazy(() => import('@/features/analytics/AnalyticsPage'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:projectId', element: <ProjectDetailPage /> },
      { path: 'daily-log', element: <DailyLogPage /> },
      { path: 'ideas', element: <IdeasPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
