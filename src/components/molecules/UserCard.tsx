'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import Link from 'next/link';
import { cn, formatNumber } from '@/lib/utils';
import { Button } from '@/components/atoms';
import { Avatar } from '@/components/atoms';
import type { RecommendedUser } from '@/lib/api/users';

export interface UserCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  user: RecommendedUser;
  onFollowToggle?: (user: RecommendedUser) => void;
  isFollowing?: boolean;
  variant?: 'default' | 'compact';
}

export const UserCard = forwardRef<HTMLDivElement, UserCardProps>(
  (
    {
      user,
      onFollowToggle,
      isFollowing = false,
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const handleFollowClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onFollowToggle?.(user);
    };

    if (variant === 'compact') {
      return (
        <Link
          href={`/users/${user.username}`}
          className={cn(
            'flex items-center gap-3 p-3',
            'bg-[var(--bg-surface)] rounded-[var(--radius-lg)]',
            'border border-[var(--border-default)]',
            'hover:border-[var(--border-strong)] transition-colors',
            className
          )}
        >
          <Avatar
            src={user.profileImage}
            alt={user.displayName}
            name={user.displayName}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-[var(--text-primary)] truncate">
              {user.displayName}
            </h3>
            <p className="text-sm text-[var(--text-tertiary)] truncate">
              @{user.username}
            </p>
          </div>
        </Link>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'bg-[var(--bg-surface)] rounded-[var(--radius-lg)]',
          'border border-[var(--border-default)]',
          'hover:border-[var(--border-strong)] transition-colors',
          'p-4',
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <Link href={`/users/${user.username}`} className="shrink-0">
            <Avatar
              src={user.profileImage}
              alt={user.displayName}
              name={user.displayName}
              size="lg"
            />
          </Link>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`} className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[var(--text-primary)] truncate">
                    {user.displayName}
                  </h3>
                  <span className="text-sm text-[var(--text-tertiary)] truncate">
                    @{user.username}
                  </span>
                </div>
              </Link>
              {onFollowToggle && (
                <Button
                  variant={user.isFollowing ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={handleFollowClick}
                  isLoading={isFollowing}
                >
                  {user.isFollowing ? '팔로잉' : '팔로우'}
                </Button>
              )}
            </div>

            {user.bio && (
              <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                {user.bio}
              </p>
            )}

            {/* Stats */}
            <p className="text-sm text-[var(--text-tertiary)] mt-2">
              팔로워 {formatNumber(user.followerCount)}명
            </p>
          </div>
        </div>
      </div>
    );
  }
);

UserCard.displayName = 'UserCard';

export default UserCard;
