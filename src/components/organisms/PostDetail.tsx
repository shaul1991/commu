'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Share2, Flag, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Avatar, Badge } from '@/components/atoms';
import { LikeButton, BookmarkButton } from '@/components/molecules';
import { cn, formatRelativeTime, formatNumber } from '@/lib/utils';
import type { Post } from '@/types';

interface PostDetailProps {
  post: Post;
  isAuthor?: boolean;
  onLikeToggle: () => void;
  onBookmarkToggle: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PostDetail({
  post,
  isAuthor = false,
  onLikeToggle,
  onBookmarkToggle,
  onShare,
  onReport,
  onEdit,
  onDelete,
}: PostDetailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

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

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                'p-2',
                'hover:bg-[var(--bg-hover)]',
                'rounded-[var(--radius-md)]',
                'text-[var(--text-tertiary)]'
              )}
              aria-label="더보기"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* 드롭다운 메뉴 */}
            {isMenuOpen && (
              <div
                role="menu"
                className={cn(
                  'absolute right-0 top-full mt-1 z-50',
                  'min-w-[160px]',
                  'bg-[var(--bg-surface)]',
                  'border border-[var(--border-default)]',
                  'rounded-[var(--radius-md)]',
                  'shadow-lg',
                  'py-1'
                )}
              >
                {isAuthor && (
                  <>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onEdit?.();
                      }}
                      className={cn(
                        'w-full px-4 py-2',
                        'flex items-center gap-2',
                        'text-sm text-[var(--text-primary)]',
                        'hover:bg-[var(--bg-hover)]',
                        'transition-colors'
                      )}
                    >
                      <Pencil className="w-4 h-4" />
                      수정
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDelete?.();
                      }}
                      className={cn(
                        'w-full px-4 py-2',
                        'flex items-center gap-2',
                        'text-sm text-[var(--color-error)]',
                        'hover:bg-[var(--bg-hover)]',
                        'transition-colors'
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                    <div className="border-t border-[var(--border-default)] my-1" />
                  </>
                )}
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onReport?.();
                  }}
                  className={cn(
                    'w-full px-4 py-2',
                    'flex items-center gap-2',
                    'text-sm text-[var(--text-secondary)]',
                    'hover:bg-[var(--bg-hover)]',
                    'transition-colors'
                  )}
                >
                  <Flag className="w-4 h-4" />
                  신고
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6">
          {post.title}
        </h1>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => {
              const tagName = typeof tag === 'string' ? tag : tag.name;
              return (
                <Link
                  key={tagName}
                  href={`/tag/${tagName}`}
                  className={cn(
                    'px-2 py-1',
                    'bg-[var(--bg-page)]',
                    'text-sm text-[var(--text-secondary)]',
                    'rounded-[var(--radius-sm)]',
                    'hover:bg-[var(--bg-hover)]',
                    'transition-colors duration-[var(--duration-fast)]'
                  )}
                >
                  #{tagName}
                </Link>
              );
            })}
          </div>
        )}

        {/* Content - react-markdown으로 마크다운 렌더링 */}
        <div
          className={cn(
            'prose prose-neutral dark:prose-invert max-w-none',
            'text-[var(--text-primary)]',
            '[&>p]:mb-4 [&>p]:leading-relaxed',
            '[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4',
            '[&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4',
            '[&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3',
            '[&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4',
            '[&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4',
            '[&>blockquote]:border-l-4 [&>blockquote]:border-[var(--border-strong)]',
            '[&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4',
            '[&>pre]:bg-[var(--bg-page)] [&>pre]:p-4 [&>pre]:rounded-[var(--radius-md)] [&>pre]:overflow-x-auto',
            '[&_code]:bg-[var(--bg-page)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-[var(--radius-sm)]',
            '[&>pre_code]:bg-transparent [&>pre_code]:p-0',
            '[&>table]:w-full [&>table]:border-collapse [&>table]:my-4',
            '[&_th]:border [&_th]:border-[var(--border-default)] [&_th]:px-3 [&_th]:py-2 [&_th]:bg-[var(--bg-page)]',
            '[&_td]:border [&_td]:border-[var(--border-default)] [&_td]:px-3 [&_td]:py-2',
            '[&>hr]:border-[var(--border-default)] [&>hr]:my-6',
            '[&_a]:text-[var(--color-primary-500)] [&_a]:underline [&_a]:hover:opacity-80'
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
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
