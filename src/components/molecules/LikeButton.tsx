'use client';

import { useState, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onToggle: () => void;
  disabled?: boolean;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Optimistic Update를 위한 로컬 상태 사용 여부 */
  optimistic?: boolean;
}

const sizeStyles = {
  sm: {
    button: 'gap-1 px-2 py-1 text-xs',
    icon: 'w-4 h-4',
  },
  md: {
    button: 'gap-1.5 px-3 py-1.5 text-sm',
    icon: 'w-5 h-5',
  },
  lg: {
    button: 'gap-2 px-4 py-2 text-base',
    icon: 'w-6 h-6',
  },
};

export function LikeButton({
  isLiked,
  likeCount,
  onToggle,
  disabled = false,
  showCount = true,
  size = 'md',
  optimistic = false,
}: LikeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
  const [optimisticCount, setOptimisticCount] = useState(likeCount);

  // optimistic이 false면 props 값 그대로 사용
  const displayLiked = optimistic ? optimisticLiked : isLiked;
  const displayCount = optimistic ? optimisticCount : likeCount;

  const handleClick = useCallback(() => {
    if (disabled) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Optimistic Update
    if (optimistic) {
      setOptimisticLiked((prev) => !prev);
      setOptimisticCount((prev) => prev + (optimisticLiked ? -1 : 1));
    }

    onToggle();
  }, [disabled, optimistic, optimisticLiked, onToggle]);

  const styles = sizeStyles[size];

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center',
        'rounded-full',
        'transition-all duration-[var(--duration-fast)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
        displayLiked
          ? 'text-[var(--color-error-500)] bg-[var(--color-error-50)] hover:bg-[var(--color-error-100)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--color-error-500)] hover:bg-[var(--bg-hover)]',
        disabled && 'opacity-50 cursor-not-allowed',
        styles.button
      )}
      aria-label={displayLiked ? '좋아요 취소' : '좋아요'}
      aria-pressed={displayLiked}
    >
      <Heart
        className={cn(
          styles.icon,
          'transition-transform duration-[var(--duration-fast)]',
          displayLiked && 'fill-current',
          isAnimating && 'scale-125'
        )}
      />
      {showCount && (
        <span className="font-medium min-w-[1.5em] text-center">
          {formatNumber(displayCount)}
        </span>
      )}
    </button>
  );
}

// 아이콘만 있는 좋아요 버튼 (댓글용)
interface LikeIconButtonProps {
  isLiked: boolean;
  likeCount: number;
  onToggle: () => void;
  disabled?: boolean;
}

export function LikeIconButton({
  isLiked,
  likeCount,
  onToggle,
  disabled = false,
}: LikeIconButtonProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1 text-sm',
        'transition-colors duration-[var(--duration-fast)]',
        'focus:outline-none',
        isLiked
          ? 'text-[var(--color-error-500)]'
          : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-label={isLiked ? '좋아요 취소' : '좋아요'}
      aria-pressed={isLiked}
    >
      <Heart
        className={cn(
          'w-4 h-4',
          isLiked && 'fill-current'
        )}
      />
      <span>{formatNumber(likeCount)}</span>
    </button>
  );
}

export default LikeButton;
