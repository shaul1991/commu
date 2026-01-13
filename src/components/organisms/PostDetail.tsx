'use client';

import Link from 'next/link';
import { ArrowLeft, Share2, Flag, MoreHorizontal } from 'lucide-react';
import { Avatar, Badge } from '@/components/atoms';
import { LikeButton, BookmarkButton } from '@/components/molecules';
import { cn, formatRelativeTime, formatNumber } from '@/lib/utils';
import type { Post } from '@/types';

interface PostDetailProps {
  post: Post;
  onLikeToggle: () => void;
  onBookmarkToggle: () => void;
  onShare?: () => void;
  onReport?: () => void;
}

export function PostDetail({
  post,
  onLikeToggle,
  onBookmarkToggle,
  onShare,
  onReport,
}: PostDetailProps) {
  return (
    <article
      className={cn(
        'bg-[var(--bg-surface)]',
        'rounded-[var(--radius-lg)]',
        'border border-[var(--border-default)]',
        'overflow-hidden'
      )}
    >
      {/* Back Button (모바일) */}
      <div className="p-4 border-b border-[var(--border-default)] lg:hidden">
        <Link
          href="/"
          className={cn(
            'inline-flex items-center gap-1',
            'text-[var(--text-secondary)]',
            'hover:text-[var(--text-primary)]',
            'transition-colors duration-[var(--duration-fast)]'
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로가기</span>
        </Link>
      </div>

      {/* Header */}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              name={post.author.displayName}
              src={post.author.profileImage}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[var(--text-primary)]">
                  {post.author.displayName}
                </span>
                <span className="text-sm text-[var(--text-tertiary)]">
                  @{post.author.username}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <Badge variant="primary" size="sm">
                  {post.channelName}
                </Badge>
                <span className="text-[var(--text-tertiary)]">·</span>
                <time
                  className="text-[var(--text-tertiary)]"
                  dateTime={new Date(post.createdAt).toISOString()}
                >
                  {formatRelativeTime(new Date(post.createdAt))}
                </time>
              </div>
            </div>
          </div>

          <button
            className={cn(
              'p-2',
              'hover:bg-[var(--bg-hover)]',
              'rounded-[var(--radius-md)]',
              'text-[var(--text-tertiary)]'
            )}
            aria-label="더보기"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6">
          {post.title}
        </h1>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className={cn(
                  'px-2 py-1',
                  'bg-[var(--bg-page)]',
                  'text-sm text-[var(--text-secondary)]',
                  'rounded-[var(--radius-sm)]',
                  'hover:bg-[var(--bg-hover)]',
                  'transition-colors duration-[var(--duration-fast)]'
                )}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className={cn(
            'prose prose-neutral dark:prose-invert max-w-none',
            'text-[var(--text-primary)]',
            '[&>p]:mb-4 [&>p]:leading-relaxed',
            '[&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4',
            '[&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3',
            '[&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4',
            '[&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4',
            '[&>blockquote]:border-l-4 [&>blockquote]:border-[var(--border-strong)]',
            '[&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4',
            '[&>pre]:bg-[var(--bg-page)] [&>pre]:p-4 [&>pre]:rounded-[var(--radius-md)]',
            '[&>code]:bg-[var(--bg-page)] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-[var(--radius-sm)]'
          )}
        >
          {/* 실제로는 마크다운 파싱 라이브러리 사용 권장 */}
          {post.content.split('\n').map((paragraph, index) => {
            if (paragraph.trim() === '') return null;
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index}>{paragraph.replace('## ', '')}</h2>
              );
            }
            if (paragraph.startsWith('```')) {
              return null; // 코드 블록 처리는 별도 파서 필요
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        {/* Stats */}
        <div
          className={cn(
            'flex items-center gap-4',
            'mt-6 pt-4',
            'border-t border-[var(--border-default)]',
            'text-sm text-[var(--text-tertiary)]'
          )}
        >
          <span>조회 {formatNumber(post.viewCount)}</span>
        </div>

        {/* Actions */}
        <div
          className={cn(
            'flex items-center justify-between',
            'mt-4 pt-4',
            'border-t border-[var(--border-default)]'
          )}
        >
          <div className="flex items-center gap-2">
            <LikeButton
              isLiked={post.isLiked}
              likeCount={post.likeCount}
              onToggle={onLikeToggle}
              size="md"
            />
          </div>

          <div className="flex items-center gap-1">
            <BookmarkButton
              isBookmarked={post.isBookmarked}
              onToggle={onBookmarkToggle}
              size="md"
            />
            <button
              onClick={onShare}
              className={cn(
                'p-2',
                'hover:bg-[var(--bg-hover)]',
                'rounded-full',
                'text-[var(--text-secondary)]',
                'transition-colors duration-[var(--duration-fast)]'
              )}
              aria-label="공유"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onReport}
              className={cn(
                'p-2',
                'hover:bg-[var(--bg-hover)]',
                'rounded-full',
                'text-[var(--text-tertiary)]',
                'transition-colors duration-[var(--duration-fast)]'
              )}
              aria-label="신고"
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PostDetail;
