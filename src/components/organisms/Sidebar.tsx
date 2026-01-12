'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  TrendingUp,
  Compass,
  Bookmark,
  Settings,
  PlusCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const mainNavItems: NavItem[] = [
  { href: '/', label: '홈', icon: Home },
  { href: '/trending', label: '트렌딩', icon: TrendingUp },
  { href: '/explore', label: '탐색', icon: Compass },
  { href: '/bookmarks', label: '북마크', icon: Bookmark },
];

const bottomNavItems: NavItem[] = [
  { href: '/settings', label: '설정', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[var(--z-modal-backdrop)]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-14 md:top-16 bottom-0 left-0',
          'w-60 bg-[var(--bg-surface)]',
          'border-r border-[var(--border-default)]',
          'z-[var(--z-fixed)]',
          'transition-transform duration-[var(--duration-slow)]',
          // Mobile: hidden by default, slide in when open
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="h-full flex flex-col p-4">
          {/* Main Navigation */}
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} isActive={pathname === item.href} />
              </li>
            ))}
          </ul>

          {/* Create Button */}
          <Link
            href="/write"
            className={cn(
              'flex items-center gap-3 px-4 py-3 mt-4',
              'bg-[var(--color-primary-500)] text-white',
              'rounded-[var(--radius-lg)]',
              'hover:bg-[var(--color-primary-600)]',
              'transition-colors duration-[var(--duration-fast)]'
            )}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-medium">새 글 작성</span>
          </Link>

          {/* Channels Section */}
          <div className="mt-6">
            <h3 className="px-4 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              내 채널
            </h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link
                  href="/channel/general"
                  className={cn(
                    'flex items-center gap-3 px-4 py-2',
                    'text-[var(--text-secondary)]',
                    'rounded-[var(--radius-md)]',
                    'hover:bg-[var(--bg-hover)]',
                    'transition-colors duration-[var(--duration-fast)]'
                  )}
                >
                  <span className="w-6 h-6 bg-[var(--color-primary-100)] rounded flex items-center justify-center text-xs font-bold text-[var(--color-primary-600)]">
                    일
                  </span>
                  <span>일반</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/channel/tech"
                  className={cn(
                    'flex items-center gap-3 px-4 py-2',
                    'text-[var(--text-secondary)]',
                    'rounded-[var(--radius-md)]',
                    'hover:bg-[var(--bg-hover)]',
                    'transition-colors duration-[var(--duration-fast)]'
                  )}
                >
                  <span className="w-6 h-6 bg-[var(--color-success-50)] rounded flex items-center justify-center text-xs font-bold text-[var(--color-success-600)]">
                    기
                  </span>
                  <span>기술</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom Navigation */}
          <ul className="space-y-1 pt-4 border-t border-[var(--border-default)]">
            {bottomNavItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} isActive={pathname === item.href} />
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-4 py-2',
        'rounded-[var(--radius-md)]',
        'transition-colors duration-[var(--duration-fast)]',
        isActive
          ? 'bg-[var(--bg-selected)] text-[var(--color-primary-600)] font-medium'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{item.label}</span>
    </Link>
  );
}

export default Sidebar;
