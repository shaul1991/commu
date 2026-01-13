'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

// 에러 폴백 UI
interface ErrorFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({
  error,
  onRetry,
  title = '오류가 발생했습니다',
  message = '페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
}: ErrorFallbackProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'min-h-[300px] p-6 text-center'
      )}
      role="alert"
    >
      <div
        className={cn(
          'w-16 h-16 mb-4',
          'flex items-center justify-center',
          'bg-[var(--color-error-50)] rounded-full'
        )}
      >
        <AlertTriangle className="w-8 h-8 text-[var(--color-error-500)]" />
      </div>
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h2>
      <p className="text-[var(--text-secondary)] mb-6 max-w-md">
        {message}
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <pre className="mb-4 p-4 bg-[var(--bg-page)] rounded-[var(--radius-md)] text-left text-xs text-[var(--color-error-500)] overflow-auto max-w-full max-h-32">
          {error.message}
        </pre>
      )}
      {onRetry && (
        <Button variant="primary" onClick={onRetry} leftIcon={<RefreshCw className="w-4 h-4" />}>
          다시 시도
        </Button>
      )}
    </div>
  );
}

// 쿼리 에러 컴포넌트 (React Query용)
interface QueryErrorProps {
  error: Error | null;
  onRetry?: () => void;
}

export function QueryError({ error, onRetry }: QueryErrorProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'p-6 text-center',
        'bg-[var(--color-error-50)] rounded-[var(--radius-lg)]'
      )}
      role="alert"
    >
      <AlertTriangle className="w-8 h-8 text-[var(--color-error-500)] mb-3" />
      <p className="text-[var(--text-secondary)] mb-4">
        {error?.message || '데이터를 불러오는 중 오류가 발생했습니다.'}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          다시 시도
        </Button>
      )}
    </div>
  );
}

// 빈 상태 컴포넌트
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'min-h-[200px] p-6 text-center'
      )}
    >
      {icon && (
        <div className="mb-4 text-[var(--text-tertiary)]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-[var(--text-secondary)] mb-4 max-w-md">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

export default ErrorBoundary;
