'use client';

import { cn } from '@/lib/utils';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingProps {
  size?: LoadingSize;
  className?: string;
  label?: string;
}

const sizeStyles: Record<LoadingSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function Loading({ size = 'md', className, label }: LoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <svg
        className={cn('animate-spin text-[var(--color-primary-500)]', sizeStyles[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label={label || '로딩 중'}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && (
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      )}
    </div>
  );
}

// 전체 페이지 로딩 컴포넌트
interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = '로딩 중...' }: PageLoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loading size="xl" label={message} />
    </div>
  );
}

// 인라인 로딩 컴포넌트
interface InlineLoadingProps {
  className?: string;
}

export function InlineLoading({ className }: InlineLoadingProps) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <Loading size="sm" />
      <span className="text-sm text-[var(--text-secondary)]">로딩 중...</span>
    </span>
  );
}

export default Loading;
