'use client';

import { useState, useCallback, useRef, type TouchEvent, type RefObject } from 'react';

// ===== 타입 정의 =====
export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null;

export interface SwipeState {
  direction: SwipeDirection;
  deltaX: number;
  deltaY: number;
  velocity: number;
  isSwiping: boolean;
}

export interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: (direction: SwipeDirection) => void;
  onSwiping?: (state: SwipeState) => void;
}

export interface SwipeOptions {
  /** 스와이프로 인식하는 최소 거리 (px) */
  threshold?: number;
  /** 스와이프로 인식하는 최소 속도 (px/ms) */
  velocityThreshold?: number;
  /** 수평 스와이프 활성화 */
  enableHorizontal?: boolean;
  /** 수직 스와이프 활성화 */
  enableVertical?: boolean;
  /** 스와이프 중 스크롤 방지 */
  preventScroll?: boolean;
}

export interface UseSwipeReturn {
  /** 스와이프 상태 */
  state: SwipeState;
  /** 터치 이벤트 핸들러들 */
  handlers: {
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: (e: TouchEvent) => void;
    onTouchCancel: () => void;
  };
  /** ref에 바인딩할 때 사용 */
  bind: () => {
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: (e: TouchEvent) => void;
    onTouchCancel: () => void;
  };
}

// ===== 기본 옵션 =====
const defaultOptions: Required<SwipeOptions> = {
  threshold: 50,
  velocityThreshold: 0.3,
  enableHorizontal: true,
  enableVertical: false,
  preventScroll: false,
};

// ===== useSwipe 훅 =====
export function useSwipe(
  callbacks: SwipeCallbacks = {},
  options: SwipeOptions = {}
): UseSwipeReturn {
  const opts = { ...defaultOptions, ...options };

  const [state, setState] = useState<SwipeState>({
    direction: null,
    deltaX: 0,
    deltaY: 0,
    velocity: 0,
    isSwiping: false,
  });

  // 터치 시작 위치 및 시간
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const isSwiping = useRef(false);

  // 터치 시작
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    startTime.current = Date.now();
    isSwiping.current = true;

    setState({
      direction: null,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
      isSwiping: true,
    });

    callbacks.onSwipeStart?.();
  }, [callbacks]);

  // 터치 이동
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isSwiping.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;
    const elapsed = Date.now() - startTime.current;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = elapsed > 0 ? distance / elapsed : 0;

    // 방향 결정
    let direction: SwipeDirection = null;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (opts.enableHorizontal && absDeltaX > absDeltaY) {
      direction = deltaX > 0 ? 'right' : 'left';
      if (opts.preventScroll) {
        e.preventDefault();
      }
    } else if (opts.enableVertical && absDeltaY > absDeltaX) {
      direction = deltaY > 0 ? 'down' : 'up';
      if (opts.preventScroll) {
        e.preventDefault();
      }
    }

    const newState: SwipeState = {
      direction,
      deltaX,
      deltaY,
      velocity,
      isSwiping: true,
    };

    setState(newState);
    callbacks.onSwiping?.(newState);
  }, [callbacks, opts.enableHorizontal, opts.enableVertical, opts.preventScroll]);

  // 터치 종료
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;
    const elapsed = Date.now() - startTime.current;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = elapsed > 0 ? distance / elapsed : 0;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    let direction: SwipeDirection = null;
    let shouldTrigger = false;

    // 수평 스와이프 검사
    if (opts.enableHorizontal && absDeltaX > absDeltaY) {
      if (absDeltaX >= opts.threshold || velocity >= opts.velocityThreshold) {
        direction = deltaX > 0 ? 'right' : 'left';
        shouldTrigger = true;
      }
    }
    // 수직 스와이프 검사
    else if (opts.enableVertical && absDeltaY > absDeltaX) {
      if (absDeltaY >= opts.threshold || velocity >= opts.velocityThreshold) {
        direction = deltaY > 0 ? 'down' : 'up';
        shouldTrigger = true;
      }
    }

    // 스와이프 콜백 호출
    if (shouldTrigger && direction) {
      switch (direction) {
        case 'left':
          callbacks.onSwipeLeft?.();
          break;
        case 'right':
          callbacks.onSwipeRight?.();
          break;
        case 'up':
          callbacks.onSwipeUp?.();
          break;
        case 'down':
          callbacks.onSwipeDown?.();
          break;
      }
    }

    callbacks.onSwipeEnd?.(direction);

    setState({
      direction,
      deltaX,
      deltaY,
      velocity,
      isSwiping: false,
    });
  }, [callbacks, opts]);

  // 터치 취소
  const handleTouchCancel = useCallback(() => {
    isSwiping.current = false;
    setState({
      direction: null,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
      isSwiping: false,
    });
    callbacks.onSwipeEnd?.(null);
  }, [callbacks]);

  const handlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };

  const bind = useCallback(() => handlers, [handlers]);

  return {
    state,
    handlers,
    bind,
  };
}

// ===== 스와이프 액션 컴포넌트용 훅 =====
export interface SwipeActionOptions {
  /** 좋아요 토글 콜백 */
  onLike?: () => void;
  /** 북마크 토글 콜백 */
  onBookmark?: () => void;
  /** 삭제 콜백 */
  onDelete?: () => void;
  /** 왼쪽 스와이프 액션 */
  leftAction?: 'like' | 'bookmark' | 'delete' | 'custom';
  /** 오른쪽 스와이프 액션 */
  rightAction?: 'like' | 'bookmark' | 'delete' | 'custom';
  /** 커스텀 왼쪽 액션 콜백 */
  onLeftAction?: () => void;
  /** 커스텀 오른쪽 액션 콜백 */
  onRightAction?: () => void;
}

export function useSwipeActions(options: SwipeActionOptions = {}) {
  const {
    onLike,
    onBookmark,
    onDelete,
    leftAction = 'like',
    rightAction = 'bookmark',
    onLeftAction,
    onRightAction,
  } = options;

  const executeAction = useCallback((action: string | undefined, customCallback?: () => void) => {
    switch (action) {
      case 'like':
        onLike?.();
        break;
      case 'bookmark':
        onBookmark?.();
        break;
      case 'delete':
        onDelete?.();
        break;
      case 'custom':
        customCallback?.();
        break;
    }
  }, [onLike, onBookmark, onDelete]);

  const swipeCallbacks: SwipeCallbacks = {
    onSwipeLeft: () => executeAction(leftAction, onLeftAction),
    onSwipeRight: () => executeAction(rightAction, onRightAction),
  };

  return useSwipe(swipeCallbacks, {
    enableHorizontal: true,
    enableVertical: false,
    threshold: 80,
    preventScroll: true,
  });
}

export default useSwipe;
