'use client';

import { forwardRef, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type TextareaSize = 'sm' | 'md' | 'lg';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: TextareaSize;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  maxLength?: number;
  showCount?: boolean;
  leftIcon?: ReactNode;
}

const sizeStyles: Record<TextareaSize, string> = {
  sm: 'px-3 py-2 text-sm min-h-[80px]',
  md: 'px-4 py-3 text-base min-h-[120px]',
  lg: 'px-4 py-4 text-lg min-h-[160px]',
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      error = false,
      errorMessage,
      label,
      helperText,
      fullWidth = false,
      maxLength,
      showCount = false,
      leftIcon,
      disabled,
      className,
      value,
      ...props
    },
    ref
  ) => {
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span
              className={cn(
                'absolute left-3 top-3',
                'text-[var(--text-tertiary)]',
                'pointer-events-none'
              )}
            >
              {leftIcon}
            </span>
          )}
          <textarea
            ref={ref}
            disabled={disabled}
            value={value}
            maxLength={maxLength}
            className={cn(
              // Base styles
              'w-full rounded-[var(--radius-md)]',
              'bg-[var(--bg-surface)]',
              'border border-[var(--border-default)]',
              'text-[var(--text-primary)]',
              'placeholder:text-[var(--text-placeholder)]',
              'transition-all duration-[var(--duration-fast)]',
              'resize-y',
              // Focus
              'focus:outline-none focus:border-[var(--border-focus)]',
              'focus:ring-2 focus:ring-[var(--border-focus)]/20',
              // Disabled
              'disabled:bg-[var(--bg-disabled)]',
              'disabled:text-[var(--text-disabled)]',
              'disabled:cursor-not-allowed',
              'disabled:resize-none',
              // Error
              error && [
                'border-[var(--border-error)]',
                'focus:border-[var(--border-error)]',
                'focus:ring-[var(--color-error-500)]/20',
              ],
              // Size
              sizeStyles[size],
              // Icon padding
              leftIcon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>

        {/* Helper/Error text and character count */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            {error && errorMessage ? (
              <p className="text-sm text-[var(--color-error-500)]">
                {errorMessage}
              </p>
            ) : helperText ? (
              <p className="text-sm text-[var(--text-tertiary)]">
                {helperText}
              </p>
            ) : null}
          </div>
          {showCount && maxLength && (
            <span
              className={cn(
                'text-xs',
                currentLength >= maxLength
                  ? 'text-[var(--color-error-500)]'
                  : 'text-[var(--text-tertiary)]'
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
