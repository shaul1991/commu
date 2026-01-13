'use client';

import { type ReactNode, useState, useMemo } from 'react';
import { Heart, Bookmark, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSwipe, type SwipeDirection } from '@/hooks/useSwipe';

// ===== 타입 정의 =====
export type SwipeActionType = 'like' | 'bookmark' | 'delete' | 'custom';

export interface SwipeAction {
  type: SwipeActionType;
  icon?: ReactNode;
  label?: string;
  color?: string;
  bgColor?: string;
  onAction?: () => void;
}

export interface SwipeCardProps {
  children: ReactNode;
  /** 왼쪽 스와이프 액션 */
  leftAction?: SwipeAction;
  /** 오른쪽 스와이프 액션 */
  rightAction?: SwipeAction;
  /** 스와이프 비활성화 */
  disabled?: boolean;
  /** 추가 클래스 */
  className?: string;
}

// ===== 기본 액션 정의 =====
const defaultActions: Record<SwipeActionType, Omit<SwipeAction, 'type' | 'onAction'>> = {
  like: {
    icon: <Heart className="w-6 h-6" />,
    label: '좋아요',
    color: 'text-white',
    bgColor: 'bg-[var(--color-error-500)]',
  },
  bookmark: {
    icon: <Bookmark className="w-6 h-6" />,
    label: '북마크',
    color: 'text-white',
    bgColor: 'bg-[var(--color-primary-500)]',
  },
  delete: {
    icon: <Trash2 className="w-6 h-6" />,
    label: '삭제',
    color: 'text-white',
    bgColor: 'bg-[var(--color-error-600)]',
  },
  custom: {
    icon: null,
    label: '',
    color: 'text-white',
    bgColor: 'bg-[var(--color-gray-500)]',
  },
};

// ===== SwipeCard 컴포넌트 =====
export function SwipeCard({
  children,
  leftAction,
  rightAction,
  disabled = false,
  className,
}: SwipeCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // 액션 병합
  const mergedLeftAction = useMemo(
    () => leftAction ? { ...defaultActions[leftAction.type], ...leftAction } : null,
    [leftAction]
  );

  const mergedRightAction = useMemo(
    () => rightAction ? { ...defaultActions[rightAction.type], ...rightAction } : null,
    [rightAction]
  );

  // 스와이프 핸들러
  const handleSwipeEnd = (direction: SwipeDirection) => {
    if (disabled) return;

    if (direction === 'left' && mergedLeftAction?.onAction) {
      setIsAnimating(true);
      setTimeout(() => {
        mergedLeftAction.onAction?.();
        setIsAnimating(false);
      }, 200);
    } else if (direction === 'right' && mergedRightAction?.onAction) {
      setIsAnimating(true);
      setTimeout(() => {
        mergedRightAction.onAction?.();
        setIsAnimating(false);
      }, 200);
    }
  };

  const { state, handlers } = useSwipe(
    {
      onSwipeEnd: handleSwipeEnd,
    },
    {
      enableHorizontal: !disabled,
      enableVertical: false,
      threshold: 80,
      preventScroll: true,
    }
  );

  const { deltaX, isSwiping } = state;

  // 스와이프 거리 제한 및 저항 적용
  const clampedDeltaX = useMemo(() => {
    const maxSwipe = 120;
    if (Math.abs(deltaX) > maxSwipe) {
      const sign = deltaX > 0 ? 1 : -1;
      const overflow = Math.abs(deltaX) - maxSwipe;
      return sign * (maxSwipe + overflow * 0.2);
    }
    return deltaX;
  }, [deltaX]);

  // 현재 보이는 액션
  const showLeftAction = deltaX < -20 && mergedLeftAction;
  const showRightAction = deltaX > 20 && mergedRightAction;

  // 액션 활성화 상태 (threshold 이상)
  const isLeftActionActive = Math.abs(deltaX) >= 80 && deltaX < 0;
  const isRightActionActive = Math.abs(deltaX) >= 80 && deltaX > 0;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* 왼쪽 액션 배경 (오른쪽으로 스와이프 시) */}
      {mergedRightAction && (
        <div
          className={cn(
            'absolute inset-y-0 left-0 flex items-center justify-start pl-4',
            'transition-all duration-150',
            mergedRightAction.bgColor,
            isRightActionActive ? 'opacity-100' : 'opacity-70'
          )}
          style={{
            width: Math.max(0, clampedDeltaX),
          }}
        >
          <div className={cn('flex flex-col items-center gap-1', mergedRightAction.color)}>
            {mergedRightAction.icon}
            {mergedRightAction.label && (
              <span className="text-xs font-medium">{mergedRightAction.label}</span>
            )}
          </div>
        </div>
      )}

      {/* 오른쪽 액션 배경 (왼쪽으로 스와이프 시) */}
      {mergedLeftAction && (
        <div
          className={cn(
            'absolute inset-y-0 right-0 flex items-center justify-end pr-4',
            'transition-all duration-150',
            mergedLeftAction.bgColor,
            isLeftActionActive ? 'opacity-100' : 'opacity-70'
          )}
          style={{
            width: Math.max(0, Math.abs(clampedDeltaX)),
          }}
        >
          <div className={cn('flex flex-col items-center gap-1', mergedLeftAction.color)}>
            {mergedLeftAction.icon}
            {mergedLeftAction.label && (
              <span className="text-xs font-medium">{mergedLeftAction.label}</span>
            )}
          </div>
        </div>
      )}

      {/* 카드 콘텐츠 */}
      <div
        {...handlers}
        className={cn(
          'relative bg-[var(--bg-surface)]',
          'transform-gpu',
          !isSwiping && !isAnimating && 'transition-transform duration-200',
          isAnimating && 'transition-transform duration-200'
        )}
        style={{
          transform: `translateX(${disabled ? 0 : clampedDeltaX}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default SwipeCard;
