'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--color-primary-500)] text-white
    hover:bg-[var(--color-primary-600)]
    active:bg-[var(--color-primary-700)]
    disabled:bg-[var(--color-primary-300)]
  `,
  secondary: `
    bg-[var(--bg-surface)] text-[var(--text-primary)]
    border border-[var(--border-default)]
    hover:bg-[var(--bg-hover)]
    active:bg-[var(--bg-active)]
    disabled:bg-[var(--bg-disabled)] disabled:text-[var(--text-disabled)]
  `,
  ghost: `
    bg-transparent text-[var(--text-primary)]
    hover:bg-[var(--bg-hover)]
    active:bg-[var(--bg-active)]
    disabled:text-[var(--text-disabled)]
  `,
  danger: `
    bg-[var(--color-error-500)] text-white
    hover:bg-[var(--color-error-600)]
    active:bg-[var(--color-error-700)]
    disabled:bg-[var(--color-error-300)]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-base gap-2',
  lg: 'h-12 px-6 text-lg gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'font-medium rounded-[var(--radius-md)]',
          'transition-all duration-[var(--duration-fast)]',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed',
          // Variant & Size
          variantStyles[variant],
          sizeStyles[size],
          // Full width
          fullWidth && 'w-full',
          // Loading state
          isLoading && 'relative text-transparent',
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size={size} />
          </span>
        )}
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

function LoadingSpinner({ size }: { size: ButtonSize }) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <svg
      className={cn('animate-spin', sizeMap[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
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
  );
}

export default Button;
