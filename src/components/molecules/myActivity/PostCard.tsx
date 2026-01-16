'use client';

/**
 * PostCard
 * 내 게시글/좋아요한 글/북마크 목록에서 사용하는 게시글 카드
 */

import Link from 'next/link';
import { Eye, Heart, MessageCircle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import type { MyPost, LikedPost, BookmarkedPost } from '@/types/myActivity';

type PostCardData = MyPost | LikedPost | BookmarkedPost;

interface PostCardProps {
  post: PostCardData;
  variant?: 'default' | 'compact';
  showChannel?: boolean;
  onClick?: () => void;
}

export function PostCard({
  post,
  variant = 'default',
  showChannel = false,
  onClick,
}: PostCardProps) {
  const isCompact = variant === 'compact';

  // LikedPost/BookmarkedPost인 경우 channelSlug가 있음
  const channelSlug = 'channelSlug' in post ? post.channelSlug : undefined;
  const channelName = 'channelName' in post ? post.channelName : undefined;

  // BookmarkedPost인 경우 bookmarkedAt
  const bookmarkedAt = 'bookmarkedAt' in post ? post.bookmarkedAt : undefined;
  // LikedPost인 경우 likedAt
  const likedAt = 'likedAt' in post ? post.likedAt : undefined;

  // MyPost인 경우 excerpt 대신 content 사용
  const excerpt = 'excerpt' in post ? post.excerpt : post.content;

  // 이미지 여부 (MyPost만)
  const hasImages = 'images' in post && post.images && post.images.length > 0;

  // 태그 (MyPost만)
  const tags = 'tags' in post ? post.tags : [];

  const href = channelSlug
    ? `/channels/${channelSlug}/posts/${post.id}`
    : `/posts/${post.id}`;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'block p-4 rounded-lg',
        'bg-[var(--bg-surface)] border border-[var(--border-default)]',
        'hover:border-[var(--border-strong)] hover:shadow-sm',
        'transition-all duration-[var(--duration-fast)]',
        isCompact && 'p-3'
      )}
    >
      <div className="flex gap-3">
        {/* 이미지 썸네일 (있는 경우) */}
        {hasImages && 'images' in post && post.images && post.images[0] && (
          <div className={cn(
            'flex-shrink-0 rounded-md overflow-hidden bg-[var(--bg-hover)]',
            isCompact ? 'w-16 h-16' : 'w-20 h-20'
          )}>
            <img
              src={post.images[0]}
              alt=""
              className="w-full h-full object-cover"
            />
            {post.images.length > 1 && (
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 rounded text-xs text-white">
                +{post.images.length - 1}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* 채널 정보 */}
          {showChannel && channelName && (
            <p className="text-xs text-[var(--color-primary-500)] font-medium mb-1 truncate">
              {channelName}
            </p>
          )}

          {/* 제목 */}
          <h3 className={cn(
            'font-medium text-[var(--text-primary)] line-clamp-2',
            isCompact ? 'text-sm' : 'text-base'
          )}>
            {post.title}
          </h3>

          {/* 본문 미리보기 */}
          {!isCompact && excerpt && (
            <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
              {excerpt}
            </p>
          )}

          {/* 태그 */}
          {!isCompact && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-[var(--bg-hover)] text-[var(--text-secondary)] rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-[var(--text-tertiary)]">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 메타 정보 */}
          <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(post.viewCount)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {formatNumber(post.likeCount)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {formatNumber(post.commentCount)}
            </span>
            {hasImages && (
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
              </span>
            )}
            <span className="ml-auto">
              {bookmarkedAt
                ? formatRelativeTime(new Date(bookmarkedAt))
                : likedAt
                ? formatRelativeTime(new Date(likedAt))
                : formatRelativeTime(new Date(post.createdAt))
              }
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
