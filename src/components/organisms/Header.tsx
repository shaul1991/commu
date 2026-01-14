'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Menu, User, Settings, LogOut, X } from 'lucide-react';
import { Avatar, ThemeToggle } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks';

interface HeaderProps {
  onMenuClick?: () => void;
  notificationCount?: number;
}

export function Header({ onMenuClick, notificationCount = 3 }: HeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 사용자 표시 이름 계산
  const displayName = user?.displayName ||
    (user?.firstName && user?.lastName ? `${user.lastName}${user.firstName}` : null) ||
    user?.email?.split('@')[0] ||
    '사용자';

  // 검색 제출
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 모바일 검색창 열릴 때 포커스
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  const userMenuItems = [
    { icon: User, label: '프로필', href: '/profile' },
    { icon: Settings, label: '설정', href: '/settings' },
  ];

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
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xl"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
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
          <Link
            href="/notifications"
            className="relative p-2 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]"
            aria-label="알림"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-[var(--color-error-500)] text-white text-xs font-medium rounded-full">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 hover:bg-[var(--bg-hover)] rounded-[var(--radius-full)]"
            >
              <Avatar size="sm" name={displayName} src={user?.profileImage} />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                className={cn(
                  'absolute right-0 top-full mt-2 w-48',
                  'bg-[var(--bg-surface)]',
                  'border border-[var(--border-default)]',
                  'rounded-[var(--radius-lg)]',
                  'shadow-[var(--shadow-lg)]',
                  'py-1',
                  'z-50'
                )}
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-[var(--border-default)]">
                  <p className="font-medium text-[var(--text-primary)]">{displayName}</p>
                  <p className="text-sm text-[var(--text-tertiary)]">{user?.email}</p>
                </div>

                {/* Menu Items */}
                {userMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsUserMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2',
                      'text-sm text-[var(--text-secondary)]',
                      'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                      'transition-colors duration-[var(--duration-fast)]'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}

                {/* Logout */}
                <div className="border-t border-[var(--border-default)] my-1" />
                <button
                  onClick={handleLogout}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 w-full',
                    'text-sm text-[var(--text-secondary)]',
                    'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                    'transition-colors duration-[var(--duration-fast)]'
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--bg-surface)] border-b border-[var(--border-default)] p-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력하세요"
                className={cn(
                  'w-full h-10 pl-10 pr-4',
                  'bg-[var(--bg-page)] border border-[var(--border-default)]',
                  'rounded-[var(--radius-full)]',
                  'text-[var(--text-primary)]',
                  'placeholder:text-[var(--text-placeholder)]',
                  'focus:outline-none focus:border-[var(--border-focus)]'
                )}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]"
              aria-label="검색 닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}

export default Header;
