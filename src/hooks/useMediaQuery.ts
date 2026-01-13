'use client';

import { useState, useEffect, useCallback } from 'react';
import { isClient } from '@/lib/utils';

/**
 * 브레이크포인트 정의 (docs/ux/patterns/responsive-breakpoints.md 기준)
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * 미디어 쿼리 훅
 * @param query - CSS 미디어 쿼리 문자열
 * @returns 미디어 쿼리 매칭 여부
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (!isClient) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!isClient) return;

    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * 브레이크포인트 기반 미디어 쿼리 훅
 * @param breakpoint - 브레이크포인트 키
 * @param direction - 'up' (min-width) 또는 'down' (max-width)
 * @returns 브레이크포인트 조건 충족 여부
 */
export function useBreakpoint(
  breakpoint: BreakpointKey,
  direction: 'up' | 'down' = 'up'
): boolean {
  const pixels = BREAKPOINTS[breakpoint];
  const query =
    direction === 'up'
      ? `(min-width: ${pixels}px)`
      : `(max-width: ${pixels - 1}px)`;
  return useMediaQuery(query);
}

/**
 * 현재 활성 브레이크포인트 반환 훅
 * @returns 현재 화면 크기에 해당하는 브레이크포인트 키
 */
export function useCurrentBreakpoint(): BreakpointKey {
  const is2xl = useBreakpoint('2xl', 'up');
  const isXl = useBreakpoint('xl', 'up');
  const isLg = useBreakpoint('lg', 'up');
  const isMd = useBreakpoint('md', 'up');
  const isSm = useBreakpoint('sm', 'up');

  if (is2xl) return '2xl';
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  return 'xs';
}

/**
 * 모바일 여부 확인 훅 (md 미만)
 */
export function useIsMobile(): boolean {
  return useBreakpoint('md', 'down');
}

/**
 * 태블릿 여부 확인 훅 (md ~ lg 사이)
 */
export function useIsTablet(): boolean {
  const isMdUp = useBreakpoint('md', 'up');
  const isLgUp = useBreakpoint('lg', 'up');
  return isMdUp && !isLgUp;
}

/**
 * 데스크톱 여부 확인 훅 (lg 이상)
 */
export function useIsDesktop(): boolean {
  return useBreakpoint('lg', 'up');
}

/**
 * 반응형 값 선택 훅
 * @param values - 브레이크포인트별 값 객체
 * @param defaultValue - 기본값
 * @returns 현재 브레이크포인트에 해당하는 값
 */
export function useResponsiveValue<T>(
  values: Partial<Record<BreakpointKey, T>>,
  defaultValue: T
): T {
  const currentBreakpoint = useCurrentBreakpoint();
  const breakpointOrder: BreakpointKey[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const startIndex = breakpointOrder.indexOf(currentBreakpoint);

  for (let i = startIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp] as T;
    }
  }

  return defaultValue;
}

export default useMediaQuery;
