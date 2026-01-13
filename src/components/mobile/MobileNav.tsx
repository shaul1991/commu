'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  TrendingUp,
  Compass,
  Bookmark,
  Bell,
  User,
  Plus,
  Settings,
  LogOut,
  Moon,
  Sun,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

// ===== 타입 정의 =====
interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface MobileNavProps {
  className?: string;
}

// ===== 네비게이션 아이템 =====
const mainNavItems: NavItem[] = [
  { href: '/', label: '홈', icon: Home },
  { href: '/trending', label: '트렌딩', icon: TrendingUp },
  { href: '/explore', label: '탐색', icon: Compass },
  { href: '/bookmarks', label: '북마크', icon: Bookmark },
];

const bottomTabItems: NavItem[] = [
  { href: '/', label: '홈', icon: Home },
  { href: '/trending', label: '트렌딩', icon: TrendingUp },
  { href: '/write', label: '글쓰기', icon: Plus },
  { href: '/notifications', label: '알림', icon: Bell, badge: 3 },
  { href: '/profile', label: '프로필', icon: User },
];

// ===== 햄버거 메뉴 =====
export function HamburgerMenu({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'lg:hidden flex items-center justify-center',
          'w-10 h-10 -ml-2',
          'rounded-[var(--radius-md)]',
          'hover:bg-[var(--bg-hover)]',
          'transition-colors duration-[var(--duration-fast)]',
          'touch-target touch-feedback',
          className
        )}
        aria-label="메뉴 열기"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* 오버레이 */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[var(--z-modal-backdrop)] animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 사이드 메뉴 */}
      <aside
        id="mobile-menu"
        className={cn(
          'lg:hidden fixed top-0 left-0 bottom-0',
          'w-72 max-w-[85vw]',
          'bg-[var(--bg-surface)]',
          'z-[var(--z-modal)]',
          'flex flex-col',
          'transform transition-transform duration-[var(--duration-slow)] ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="모바일 메뉴"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 bg-[var(--color-primary-500)] rounded-[var(--radius-md)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">커뮤</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--bg-hover)] touch-target"
            aria-label="메뉴 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 메인 네비게이션 */}
        <nav className="flex-1 overflow-y-auto scroll-y-touch p-4">
          <ul className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3',
                      'rounded-[var(--radius-lg)]',
                      'transition-colors duration-[var(--duration-fast)]',
                      'touch-target touch-feedback',
                      isActive
                        ? 'bg-[var(--bg-selected)] text-[var(--color-primary-600)] font-medium'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                    )}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-[var(--color-error-500)] text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* 글쓰기 버튼 */}
          <Link
            href="/write"
            onClick={() => setIsOpen(false)}
            className={cn(
              'flex items-center justify-center gap-2',
              'w-full mt-4 px-4 py-3',
              'bg-[var(--color-primary-500)] text-white',
              'rounded-[var(--radius-lg)] font-medium',
              'hover:bg-[var(--color-primary-600)]',
              'transition-colors duration-[var(--duration-fast)]',
              'touch-target touch-feedback'
            )}
          >
            <Plus className="w-5 h-5" />
            <span>새 글 작성</span>
          </Link>
        </nav>

        {/* 푸터 */}
        <div className="p-4 border-t border-[var(--border-default)] space-y-2">
          {/* 테마 토글 */}
          <button
            onClick={toggleTheme}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-3',
              'rounded-[var(--radius-lg)]',
              'text-[var(--text-secondary)]',
              'hover:bg-[var(--bg-hover)]',
              'transition-colors duration-[var(--duration-fast)]',
              'touch-target touch-feedback'
            )}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{theme === 'dark' ? '라이트 모드' : '다크 모드'}</span>
          </button>

          {/* 설정 */}
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-3',
              'rounded-[var(--radius-lg)]',
              'text-[var(--text-secondary)]',
              'hover:bg-[var(--bg-hover)]',
              'transition-colors duration-[var(--duration-fast)]',
              'touch-target touch-feedback'
            )}
          >
            <Settings className="w-5 h-5" />
            <span>설정</span>
          </Link>

          {/* 로그아웃 */}
          <button
            onClick={() => {
              setIsOpen(false);
              // 로그아웃 로직
            }}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-3',
              'rounded-[var(--radius-lg)]',
              'text-[var(--color-error-500)]',
              'hover:bg-[var(--color-error-50)]',
              'transition-colors duration-[var(--duration-fast)]',
              'touch-target touch-feedback'
            )}
          >
            <LogOut className="w-5 h-5" />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ===== 바텀 탭 네비게이션 =====
export function BottomTabNav({ className }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'lg:hidden fixed bottom-0 left-0 right-0',
        'h-16 bg-[var(--bg-surface)]',
        'border-t border-[var(--border-default)]',
        'z-[var(--z-fixed)]',
        'pb-[env(safe-area-inset-bottom)]',
        className
      )}
      aria-label="하단 네비게이션"
    >
      <ul className="h-full flex items-center justify-around px-2">
        {bottomTabItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isWriteButton = item.href === '/write';

          // 글쓰기 버튼 (특별 스타일)
          if (isWriteButton) {
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center justify-center',
                    'w-12 h-12 -mt-4',
                    'rounded-full',
                    'bg-[var(--color-primary-500)]',
                    'text-white',
                    'shadow-lg shadow-[var(--color-primary-500)]/30',
                    'transition-all duration-[var(--duration-fast)]',
                    'hover:bg-[var(--color-primary-600)]',
                    'active:scale-95',
                    'touch-feedback'
                  )}
                  aria-label={item.label}
                >
                  <Icon className="w-6 h-6" strokeWidth={2.5} />
                </Link>
              </li>
            );
          }

          // 일반 탭 버튼
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center',
                  'w-16 h-12 min-w-[44px]',
                  'rounded-[var(--radius-md)]',
                  'transition-colors duration-[var(--duration-fast)]',
                  'touch-feedback',
                  isActive
                    ? 'text-[var(--color-primary-500)]'
                    : 'text-[var(--text-tertiary)]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold bg-[var(--color-error-500)] text-white rounded-full">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={cn('text-[10px] mt-0.5', isActive && 'font-medium')}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ===== 통합 모바일 네비게이션 컴포넌트 =====
export function MobileNav() {
  return (
    <>
      <BottomTabNav />
    </>
  );
}

export default MobileNav;
