import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { GlobalShortcuts } from './GlobalShortcuts';
import { AssistantButton } from '@/features/assistant/AssistantButton';

// Overlay components are invisible until explicitly opened — deferring them
// keeps cmdk/radix dialog code out of the bundle needed for first paint.
const Toaster = lazy(() => import('@/components/ui/toaster').then((m) => ({ default: m.Toaster })));
const CommandPalette = lazy(() =>
  import('@/components/command-palette/CommandPalette').then((m) => ({ default: m.CommandPalette })),
);
const QuickAddModal = lazy(() =>
  import('@/features/tasks/components/QuickAddModal').then((m) => ({ default: m.QuickAddModal })),
);
const CreateProjectDialog = lazy(() =>
  import('@/features/projects/components/CreateProjectDialog').then((m) => ({ default: m.CreateProjectDialog })),
);
const AssistantPanel = lazy(() =>
  import('@/features/assistant/AssistantPanel').then((m) => ({ default: m.AssistantPanel })),
);

function PageSkeleton() {
  return <div className="h-40 animate-pulse" />;
}

export function AppShell() {
  return (
    <div className="flex h-svh w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <MobileNav />
      <Suspense fallback={null}>
        <CommandPalette />
        <QuickAddModal />
        <CreateProjectDialog />
        <Toaster />
        <AssistantPanel />
      </Suspense>
      <AssistantButton />
      <GlobalShortcuts />
    </div>
  );
}
