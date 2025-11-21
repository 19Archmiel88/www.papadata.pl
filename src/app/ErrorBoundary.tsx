import React from 'react';

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Wraps application content and catches runtime errors in the component tree.
 * Displays a friendly message instead of a stack trace. Errors are logged
 * to the console for debugging.
 */
class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-white">
          <h2 className="text-xl font-semibold mb-2">Coś poszło nie tak</h2>
          <p className="text-slate-400">Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;