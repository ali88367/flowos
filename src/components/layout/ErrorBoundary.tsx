import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('FlowOS crashed:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex h-svh w-full flex-col items-center justify-center gap-4 bg-background p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <div>
          <p className="text-lg font-semibold">Something went wrong</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {this.state.error.message || 'The app hit an unexpected error.'}
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    );
  }
}
