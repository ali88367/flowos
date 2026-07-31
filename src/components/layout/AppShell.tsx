import { lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { GlobalShortcuts } from './GlobalShortcuts';

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

function PageSkeleton() {
  return <div className="h-40 animate-pulse" />;
}

export function AppShell() {
  const location = useLocation();

  return (
    <div className="flex h-svh w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8"
            >
              <Suspense fallback={<PageSkeleton />}>
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav />
      <Suspense fallback={null}>
        <CommandPalette />
        <QuickAddModal />
        <CreateProjectDialog />
        <Toaster />
      </Suspense>
      <GlobalShortcuts />
    </div>
  );
}
