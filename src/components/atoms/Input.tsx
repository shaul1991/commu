'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  error?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-4 text-lg',
};

const iconPadding: Record<InputSize, { left: string; right: string }> = {
  sm: { left: 'pl-8', right: 'pr-8' },
  md: { left: 'pl-10', right: 'pr-10' },
  lg: { left: 'pl-12', right: 'pr-12' },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      error = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {leftIcon && (
          <span
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2',
              'text-[var(--text-tertiary)]',
              'pointer-events-none'
            )}
          >
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            // Base styles
            'w-full rounded-[var(--radius-md)]',
            'bg-[var(--bg-surface)]',
            'border border-[var(--border-default)]',
            'text-[var(--text-primary)]',
            'placeholder:text-[var(--text-placeholder)]',
            'transition-all duration-[var(--duration-fast)]',
            // Focus
            'focus:outline-none focus:border-[var(--border-focus)]',
            'focus:ring-2 focus:ring-[var(--border-focus)]/20',
            // Disabled
            'disabled:bg-[var(--bg-disabled)]',
            'disabled:text-[var(--text-disabled)]',
            'disabled:cursor-not-allowed',
            // Error
            error && [
              'border-[var(--border-error)]',
              'focus:border-[var(--border-error)]',
              'focus:ring-[var(--color-error-500)]/20',
            ],
            // Size
            sizeStyles[size],
            // Icon padding
            leftIcon && iconPadding[size].left,
            rightIcon && iconPadding[size].right,
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'text-[var(--text-tertiary)]'
            )}
          >
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
