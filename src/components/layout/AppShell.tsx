import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Toaster } from '@/components/ui/toaster';
import { CommandPalette } from '@/components/command-palette/CommandPalette';
import { QuickAddModal } from '@/features/tasks/components/QuickAddModal';
import { CreateProjectDialog } from '@/features/projects/components/CreateProjectDialog';
import { GlobalShortcuts } from './GlobalShortcuts';

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
      <CommandPalette />
      <QuickAddModal />
      <CreateProjectDialog />
      <Toaster />
      <GlobalShortcuts />
    </div>
  );
}
