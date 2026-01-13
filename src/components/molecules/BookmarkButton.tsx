'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: {
    button: 'p-1.5',
    icon: 'w-4 h-4',
    text: 'text-xs',
  },
  md: {
    button: 'p-2',
    icon: 'w-5 h-5',
    text: 'text-sm',
  },
  lg: {
    button: 'p-2.5',
    icon: 'w-6 h-6',
    text: 'text-base',
  },
};

export function BookmarkButton({
  isBookmarked,
  onToggle,
  disabled = false,
  showLabel = false,
  size = 'md',
}: BookmarkButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onToggle();
  };

  const styles = sizeStyles[size];

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-1.5',
        'rounded-full',
        'transition-all duration-[var(--duration-fast)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
        isBookmarked
          ? 'text-[var(--color-warning-500)] bg-[var(--color-warning-50)] hover:bg-[var(--color-warning-100)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--color-warning-500)] hover:bg-[var(--bg-hover)]',
        disabled && 'opacity-50 cursor-not-allowed',
        styles.button
      )}
      aria-label={isBookmarked ? '북마크 해제' : '북마크'}
      aria-pressed={isBookmarked}
    >
      <Bookmark
        className={cn(
          styles.icon,
          'transition-transform duration-[var(--duration-fast)]',
          isBookmarked && 'fill-current',
          isAnimating && 'scale-110'
        )}
      />
      {showLabel && (
        <span className={cn('font-medium', styles.text)}>
          {isBookmarked ? '북마크됨' : '북마크'}
        </span>
      )}
    </button>
  );
}

export default BookmarkButton;
