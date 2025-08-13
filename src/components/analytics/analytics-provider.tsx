// src/components/analytics/analytics-provider.tsx
'use client';
  
import React from 'react';
import { analytics, useAnalytics } from '@/lib/analytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useAnalytics(); // This will track page views automatically
  
  return <>{children}</>;
}

// Define proper interfaces for type safety
interface ErrorInfo {
  componentStack: string;
}

interface PerformanceMeasureFn {
  (): Promise<unknown>;
}

// Performance tracking
export class PerformanceTracker {
  private startTimes: Map<string, number> = new Map();

  start(eventName: string): void {
    this.startTimes.set(eventName, performance.now());
  }

  end(eventName: string, category: string = 'performance'): void {
    const startTime = this.startTimes.get(eventName);
    if (startTime) {
      const duration = Math.round(performance.now() - startTime);
      analytics.track({
        action: eventName,
        category: category,
        value: duration,
        custom_parameters: {
          duration_ms: duration,
        },
      });
      this.startTimes.delete(eventName);
    }
  }

  measure(eventName: string, fn: PerformanceMeasureFn, category: string = 'performance'): Promise<unknown> {
    this.start(eventName);
    return fn().finally(() => {
      this.end(eventName, category);
    });
  }
}

export const performanceTracker = new PerformanceTracker();

// Error boundary with analytics
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class AnalyticsErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    analytics.trackError(error.message, errorInfo.componentStack);
    
    // Log to external error service if configured
    if (typeof window !== 'undefined' && (window as unknown as { Sentry?: { captureException: (error: Error) => void } }).Sentry) {
      (window as unknown as { Sentry: { captureException: (error: Error) => void } }).Sentry.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-red-400 flex items-center justify-center font-mono">
          <div className="text-center max-w-md p-6 border border-red-400">
            <div className="text-2xl font-bold mb-4">SYSTEM ERROR</div>
            <div className="text-sm mb-4">
              An unexpected error occurred. The incident has been logged.
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-red-400 bg-red-900/20 hover:bg-red-900/40 transition-colors"
            >
              RESTART SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}