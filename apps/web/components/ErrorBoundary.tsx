import React, { Component, ErrorInfo, ReactNode } from 'react';
import { translations } from '../translations';
import { captureException } from '../utils/telemetry';
import { InteractiveButton } from './InteractiveButton';
import { safeLocalStorage } from '../utils/safeLocalStorage';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    try {
      captureException(error, {
        componentStack: errorInfo.componentStack,
        href: typeof window !== 'undefined' ? window.location.href : undefined,
      });
    } catch {
      // noop (ErrorBoundary nie moĹĽe wybuchnÄ…Ä‡ drugi raz)
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });

    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleGoHome = (): void => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}${window.location.pathname}`;
    window.location.assign(url);
  };

  private getLang(): 'pl' | 'en' {
    if (typeof window === 'undefined') return 'pl';
    try {
      const v = safeLocalStorage.getItem('lang');
      return v === 'en' || v === 'pl' ? v : 'pl';
    } catch {
      return 'pl';
    }
  }

  public render() {
    const lang = this.getLang();
    const t = translations[lang] ?? translations.pl;

    if (this.state.hasError) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 text-center animate-reveal">
          <div className="max-w-md w-full glass p-10 md:p-12 rounded-[3rem] border border-rose-500/20 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden bg-white/95 dark:bg-[#050507]/95">
            {/* TĹ‚o bĹ‚Ä™du */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-brand-start to-rose-500 opacity-70" />

            <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-rose-500/20 shadow-inner">
              <svg
                className="w-10 h-10 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* TreĹ›Ä‡ bĹ‚Ä™du */}
            <h1 className="text-2xl font-black text-rose-500 mb-4">{t.common.error_title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 font-medium leading-relaxed">
              {t.common.error_desc}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <InteractiveButton
                variant="primary"
                onClick={this.handleReset}
                className="!h-12 !px-7 !text-xs font-black uppercase tracking-[0.25em] rounded-2xl"
              >
                {t.common.error_refresh}
              </InteractiveButton>

              <InteractiveButton
                variant="secondary"
                onClick={this.handleGoHome}
                className="!h-12 !px-7 !text-xs font-black uppercase tracking-[0.25em] rounded-2xl"
              >
                {t.common.error_home}
              </InteractiveButton>
            </div>

            {/* Diagnostyka (ukryta dla UI, ale dostÄ™pna devom) */}
            <div className="mt-8 opacity-40 select-none">
              <div className="text-3xs font-mono font-bold uppercase tracking-[0.3em] text-gray-500">
                ERROR_BOUNDARY_V2
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
