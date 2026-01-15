'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import Link from 'next/link';
import { Users, FileText } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { Button } from '@/components/atoms';
import type { Channel } from '@/types';

const colorMap: Record<string, string> = {
  primary: 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]',
  success: 'bg-[var(--color-success-50)] text-[var(--color-success-600)]',
  warning: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]',
  info: 'bg-[var(--color-info-50)] text-[var(--color-info-600)]',
  error: 'bg-[var(--color-error-50)] text-[var(--color-error-600)]',
  secondary: 'bg-[var(--bg-muted)] text-[var(--text-secondary)]',
};

export interface ChannelCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  channel: Channel;
  onSubscribeToggle?: (channel: Channel) => void;
  isSubscribing?: boolean;
  variant?: 'default' | 'compact';
}

export const ChannelCard = forwardRef<HTMLDivElement, ChannelCardProps>(
  (
    {
      channel,
      onSubscribeToggle,
      isSubscribing = false,
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const colorClass = colorMap[channel.color || 'primary'] || colorMap.primary;

    const handleSubscribeClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSubscribeToggle?.(channel);
    };

    if (variant === 'compact') {
      return (
        <Link
          href={`/channels/${channel.slug}`}
          className={cn(
            'flex items-center gap-3 p-3',
            'bg-[var(--bg-surface)] rounded-[var(--radius-lg)]',
            'border border-[var(--border-default)]',
            'hover:border-[var(--border-strong)] transition-colors',
            className
          )}
        >
          <span
            className={cn(
              'w-10 h-10 rounded-[var(--radius-md)]',
              'flex items-center justify-center',
              'text-lg font-bold',
              colorClass
            )}
          >
            {channel.icon || channel.name[0]}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-[var(--text-primary)] truncate">
              {channel.name}
            </h3>
            <p className="text-sm text-[var(--text-tertiary)]">
              {formatNumber(channel.subscriberCount)}명
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
          className
        )}
        {...props}
      >
        <Link href={`/channels/${channel.slug}`} className="block p-4">
          <div className="flex items-start gap-3">
            {/* Channel Icon */}
            <span
              className={cn(
                'w-12 h-12 rounded-[var(--radius-lg)]',
                'flex items-center justify-center',
                'text-xl font-bold shrink-0',
                colorClass
              )}
            >
              {channel.icon || channel.name[0]}
            </span>

            {/* Channel Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-[var(--text-primary)] truncate">
                  {channel.name}
                </h3>
                {onSubscribeToggle && (
                  <Button
                    variant={channel.isSubscribed ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={handleSubscribeClick}
                    isLoading={isSubscribing}
                  >
                    {channel.isSubscribed ? '구독 중' : '구독'}
                  </Button>
                )}
              </div>

              {channel.description && (
                <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                  {channel.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 mt-2 text-sm text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formatNumber(channel.subscriberCount)}명
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {formatNumber(channel.postCount)}개
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

ChannelCard.displayName = 'ChannelCard';

export default ChannelCard;
