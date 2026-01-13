'use client';

import Link from 'next/link';
import { MessageCircle, Eye } from 'lucide-react';
import { Avatar, Badge } from '@/components/atoms';
import { LikeButton } from '@/components/molecules';
import { cn, formatRelativeTime, formatNumber } from '@/lib/utils';
import type { PostSummary } from '@/types';

interface PostCardProps {
  post: PostSummary;
  onLikeToggle?: (postId: string) => void;
}

export function PostCard({ post, onLikeToggle }: PostCardProps) {
  return (
    <article
      className={cn(
        'bg-[var(--bg-surface)]',
        'border border-[var(--border-default)]',
        'rounded-[var(--radius-lg)]',
        'p-4',
        'transition-all duration-[var(--duration-fast)]',
        'hover:border-[var(--border-strong)]',
        'hover:shadow-[var(--shadow-sm)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          name={post.author.displayName}
          src={post.author.profileImage}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-[var(--text-primary)] truncate">
              {post.author.displayName}
            </span>
            <span className="text-[var(--text-tertiary)]">·</span>
            <time
              className="text-[var(--text-tertiary)]"
              dateTime={new Date(post.createdAt).toISOString()}
            >
              {formatRelativeTime(new Date(post.createdAt))}
            </time>
          </div>
        </div>
        <Badge variant="secondary" size="sm">
          {post.channelName}
        </Badge>
      </div>

      {/* Content */}
      <Link href={`/post/${post.id}`} className="block group">
        <h3
          className={cn(
            'text-lg font-semibold text-[var(--text-primary)]',
            'mb-2 line-clamp-2',
            'group-hover:text-[var(--color-primary-500)]',
            'transition-colors duration-[var(--duration-fast)]'
          )}
        >
          {post.title}
        </h3>
        <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-3">
          {post.excerpt}
        </p>
      </Link>

      {/* Footer */}
      <div
        className={cn(
          'flex items-center gap-4 pt-3',
          'border-t border-[var(--border-default)]'
        )}
      >
        <LikeButton
          isLiked={false} // PostSummary에는 isLiked가 없으므로 기본값
          likeCount={post.likeCount}
          onToggle={() => onLikeToggle?.(post.id)}
          size="sm"
        />

        <Link
          href={`/post/${post.id}#comments`}
          className={cn(
            'inline-flex items-center gap-1.5 px-2 py-1',
            'text-sm text-[var(--text-secondary)]',
            'hover:text-[var(--text-primary)]',
            'transition-colors duration-[var(--duration-fast)]'
          )}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{formatNumber(post.commentCount)}</span>
        </Link>

        <div
          className={cn(
            'inline-flex items-center gap-1.5',
            'text-sm text-[var(--text-tertiary)]',
            'ml-auto'
          )}
        >
          <Eye className="w-4 h-4" />
          <span>{formatNumber(post.viewCount)}</span>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
