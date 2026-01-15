'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// 다크모드 복구 시 사용할 상수와 함수들 (현재 비활성화)
const _STORAGE_KEY = 'commu-theme';

function _getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function _getInitialTheme(defaultTheme: Theme): Theme {
  if (typeof window === 'undefined') return defaultTheme;
  const savedTheme = localStorage.getItem(_STORAGE_KEY) as Theme | null;
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    return savedTheme;
  }
  return defaultTheme;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme: _defaultTheme = 'light', // 항상 light 모드 사용 (다크모드 복구 시 활성화)
}: ThemeProviderProps) {
  // 항상 light 모드 고정 (다크모드 디자인 시스템은 유지)
  const [theme] = useState<Theme>('light');
  const [_systemTheme] = useState<ResolvedTheme>('light'); // 다크모드 복구 시 사용

  // Use useSyncExternalStore to track client-side mounting
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // 항상 light 모드 반환
  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    return 'light';
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme, mounted]);

  // 시스템 테마 변경 리스너 비활성화 (항상 light 모드)
  // useEffect(() => {
  //   const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //   const handler = (e: MediaQueryListEvent) => {
  //     setSystemTheme(e.matches ? 'dark' : 'light');
  //   };
  //   mediaQuery.addEventListener('change', handler);
  //   return () => mediaQuery.removeEventListener('change', handler);
  // }, []);

  // setTheme은 호환성을 위해 유지하되, 실제로는 light 모드만 사용
  const setTheme = useCallback((_newTheme: Theme) => {
    // 항상 light 모드 유지 - 다크모드 UI가 복구되면 아래 코드 활성화
    // setThemeState(newTheme);
    // localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
