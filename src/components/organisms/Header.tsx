'use client';

import Link from 'next/link';
import { Search, Bell, Menu } from 'lucide-react';
import { Button, Avatar, ThemeToggle } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[var(--z-fixed)]',
        'h-14 md:h-16',
        'bg-[var(--bg-surface)] border-b border-[var(--border-default)]'
      )}
    >
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]"
            aria-label="메뉴 열기"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-primary-500)] rounded-[var(--radius-md)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-[var(--text-primary)]">
              커뮤
            </span>
          </Link>
        </div>

        {/* Center Section - Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              type="search"
              placeholder="검색어를 입력하세요"
              className={cn(
                'w-full h-10 pl-10 pr-4',
                'bg-[var(--bg-page)] border border-transparent',
                'rounded-[var(--radius-full)]',
                'text-[var(--text-primary)]',
                'placeholder:text-[var(--text-placeholder)]',
                'focus:outline-none focus:border-[var(--border-focus)]',
                'focus:bg-[var(--bg-surface)]',
                'transition-all duration-[var(--duration-fast)]'
              )}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            className="md:hidden p-2 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]"
            aria-label="검색"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]"
            aria-label="알림"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-error-500)] rounded-full" />
          </button>

          {/* User Menu */}
          <button className="flex items-center gap-2 p-1 hover:bg-[var(--bg-hover)] rounded-[var(--radius-full)]">
            <Avatar size="sm" name="사용자" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
