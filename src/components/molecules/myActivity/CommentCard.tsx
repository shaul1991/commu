'use client';

/**
 * CommentCard
 * 내 댓글 목록에서 사용하는 댓글 카드
 */

import Link from 'next/link';
import { Heart, Reply, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import type { MyComment } from '@/types/myActivity';

interface CommentCardProps {
  comment: MyComment;
  onClick?: () => void;
}

export function CommentCard({ comment, onClick }: CommentCardProps) {
  // 원본 게시글 링크
  const postHref = comment.post
    ? comment.post.channelSlug
      ? `/channels/${comment.post.channelSlug}/posts/${comment.post.id}`
      : `/posts/${comment.post.id}`
    : '#';

  const isReply = comment.parentId !== null;

  return (
    <div
      className={cn(
        'p-4 rounded-lg',
        'bg-[var(--bg-surface)] border border-[var(--border-default)]',
        'hover:border-[var(--border-strong)] hover:shadow-sm',
        'transition-all duration-[var(--duration-fast)]'
      )}
    >
      {/* 원본 게시글 정보 */}
      {comment.post && (
        <Link
          href={postHref}
          onClick={onClick}
          className={cn(
            'flex items-center gap-2 mb-3 pb-3',
            'border-b border-[var(--border-default)]',
            'hover:text-[var(--color-primary-500)]',
            'transition-colors duration-[var(--duration-fast)]'
          )}
        >
          <FileText className="w-4 h-4 text-[var(--text-tertiary)]" />
          <span className="text-sm text-[var(--text-secondary)] truncate">
            {comment.post.title}
          </span>
        </Link>
      )}

      {/* 댓글 내용 */}
      <div className="flex gap-3">
        {/* 대댓글 표시 */}
        {isReply && (
          <div className="flex-shrink-0 mt-1">
            <Reply className="w-4 h-4 text-[var(--text-tertiary)]" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* 댓글 텍스트 */}
          <p className="text-[var(--text-primary)] text-sm leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* 메타 정보 */}
          <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {formatNumber(comment.likeCount)}
            </span>
            {isReply && (
              <span className="px-1.5 py-0.5 bg-[var(--bg-hover)] rounded text-[var(--text-tertiary)]">
                대댓글
              </span>
            )}
            <span className="ml-auto">
              {formatRelativeTime(new Date(comment.createdAt))}
            </span>
          </div>
        </div>
      </div>

      {/* 삭제된 게시글 표시 */}
      {!comment.post && (
        <div className="mt-2 px-3 py-2 bg-[var(--bg-hover)] rounded text-xs text-[var(--text-tertiary)]">
          원본 게시글이 삭제되었습니다.
        </div>
      )}
    </div>
  );
}

export default CommentCard;
