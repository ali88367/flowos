import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './queryClient';
import { router } from '@/routes/router';
import { useTheme } from '@/hooks/useTheme';
import { seedIfEmpty } from '@/services';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';

function AppBootstrap() {
  useTheme();

  useEffect(() => {
    seedIfEmpty();
  }, []);

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppBootstrap />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
