'use client';

import { cn } from '@/lib/utils';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'white';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  label?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variantStyles: Record<SpinnerVariant, { circle: string; path: string }> = {
  primary: {
    circle: 'stroke-[var(--color-primary-200)]',
    path: 'stroke-[var(--color-primary-500)]',
  },
  secondary: {
    circle: 'stroke-[var(--border-default)]',
    path: 'stroke-[var(--text-secondary)]',
  },
  white: {
    circle: 'stroke-white/30',
    path: 'stroke-white',
  },
};

export function Spinner({
  size = 'md',
  variant = 'primary',
  className,
  label = '로딩 중',
}: SpinnerProps) {
  const styles = variantStyles[variant];

  return (
    <svg
      className={cn('animate-spin', sizeStyles[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label={label}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        strokeWidth="3"
        className={cn('opacity-25', styles.circle)}
      />
      <path
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        strokeWidth="0"
        fill="currentColor"
        className={cn('opacity-75', styles.path)}
      />
      <path
        d="M12 2a10 10 0 019.95 9"
        strokeWidth="3"
        strokeLinecap="round"
        className={styles.path}
      />
    </svg>
  );
}

// 페이지 전체 스피너
interface FullPageSpinnerProps {
  message?: string;
}

export function FullPageSpinner({ message = '로딩 중...' }: FullPageSpinnerProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[var(--z-modal)]',
        'flex flex-col items-center justify-center',
        'bg-[var(--bg-page)]/80 backdrop-blur-sm'
      )}
    >
      <Spinner size="xl" />
      {message && (
        <p className="mt-4 text-[var(--text-secondary)]">{message}</p>
      )}
    </div>
  );
}

// 버튼 내부 스피너
interface ButtonSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function ButtonSpinner({ size = 'md' }: ButtonSpinnerProps) {
  const sizeMap = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  };

  return <Spinner size={sizeMap[size]} variant="white" />;
}

export default Spinner;
