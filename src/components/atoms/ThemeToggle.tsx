'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

const themeOptions: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: '라이트 모드' },
  { value: 'dark', icon: Moon, label: '다크 모드' },
  { value: 'system', icon: Monitor, label: '시스템 설정' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1',
        'bg-[var(--bg-hover)] rounded-[var(--radius-lg)]'
      )}
      role="radiogroup"
      aria-label="테마 선택"
    >
      {themeOptions.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          className={cn(
            'p-2 rounded-[var(--radius-md)]',
            'transition-all duration-[var(--duration-fast)]',
            theme === value
              ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-sm)]'
              : 'hover:bg-[var(--bg-active)]'
          )}
        >
          <Icon
            className={cn(
              'w-4 h-4',
              theme === value
                ? 'text-[var(--text-primary)]'
                : 'text-[var(--text-tertiary)]'
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default ThemeToggle;
