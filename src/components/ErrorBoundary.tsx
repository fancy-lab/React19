import { Component, type ReactNode } from 'react';

export type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && this.props.children !== prevProps.children) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-start gap-3 text-sm">
          <span className="mt-0.5 text-rose-400">▶</span>
          <div>
            <p className="font-semibold text-rose-300">Error Boundary caught an error</p>
            <p className="mt-1 text-white/50">
              {this.state.error?.message || 'An unknown error occurred.'}
            </p>
            <p className="mt-2 text-xs text-white/40">
              The <code className="text-emerald-300">onCaughtError</code> handler was called.
              This fallback UI is rendered by the Error Boundary.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
