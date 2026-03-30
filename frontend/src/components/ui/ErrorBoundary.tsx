import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-md bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-red-700 dark:text-red-400">
                Algo salio mal
              </h2>
            </div>

            <p className="text-sm text-red-600 dark:text-red-300 mb-4">
              {this.state.error?.message ?? 'Error desconocido'}
            </p>

            {this.state.errorInfo && (
              <details className="mb-4">
                <summary className="text-xs text-red-500 dark:text-red-400 cursor-pointer hover:underline">
                  Ver detalles tecnicos
                </summary>
                <pre className="mt-2 text-xs text-red-500 dark:text-red-400 overflow-auto max-h-40 bg-red-100 dark:bg-red-900/30 rounded-md p-3">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
