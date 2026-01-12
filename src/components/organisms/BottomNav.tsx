'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  TrendingUp,
  PlusSquare,
  Bell,
  User,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isAction?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: '홈', icon: Home },
  { href: '/trending', label: '트렌딩', icon: TrendingUp },
  { href: '/write', label: '글쓰기', icon: PlusSquare, isAction: true },
  { href: '/notifications', label: '알림', icon: Bell },
  { href: '/profile', label: '프로필', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'lg:hidden fixed bottom-0 left-0 right-0',
        'h-16 bg-[var(--bg-surface)]',
        'border-t border-[var(--border-default)]',
        'z-[var(--z-fixed)]',
        'safe-area-inset-bottom'
      )}
    >
      <ul className="h-full flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center',
                  'w-16 h-12',
                  'rounded-[var(--radius-md)]',
                  'transition-colors duration-[var(--duration-fast)]',
                  item.isAction
                    ? 'text-[var(--color-primary-500)]'
                    : isActive
                    ? 'text-[var(--color-primary-500)]'
                    : 'text-[var(--text-tertiary)]'
                )}
              >
                <Icon
                  className={cn('w-6 h-6', item.isAction && 'w-7 h-7')}
                  strokeWidth={isActive || item.isAction ? 2.5 : 2}
                />
                <span
                  className={cn(
                    'text-[10px] mt-0.5',
                    isActive && 'font-medium'
                  )}
                >
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

export default BottomNav;
