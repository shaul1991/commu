'use client';

import { useState, useMemo } from 'react';
import { Send, MoreHorizontal, Pencil, Trash2, ArrowDownAZ, Clock, ThumbsUp } from 'lucide-react';
import { Avatar, Button, CommentListSkeleton } from '@/components/atoms';
import { LikeIconButton, ConfirmModal } from '@/components/molecules';
import { QueryError, EmptyState } from '@/components/templates';
import {
  useComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useToggleCommentLike,
} from '@/hooks/useComments';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { Comment } from '@/types';

type SortType = 'latest' | 'oldest' | 'popular';

interface CommentSectionProps {
  postId: string;
  currentUserId?: string;
}

export function CommentSection({ postId, currentUserId }: CommentSectionProps) {
  const [sortType, setSortType] = useState<SortType>('latest');
  const { data: comments, isLoading, isError, error, refetch } = useComments(postId);

  // 댓글 정렬
  const sortedComments = useMemo(() => {
    if (!comments) return [];

    const sorted = [...comments];
    switch (sortType) {
      case 'oldest':
        return sorted.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'popular':
        return sorted.sort((a, b) => b.likeCount - a.likeCount);
      case 'latest':
      default:
        return sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [comments, sortType]);

  const sortOptions = [
    { value: 'latest' as const, label: '최신순', icon: Clock },
    { value: 'oldest' as const, label: '오래된순', icon: ArrowDownAZ },
    { value: 'popular' as const, label: '인기순', icon: ThumbsUp },
  ];

  if (isLoading) {
    return (
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          댓글
        </h2>
        <CommentListSkeleton count={3} />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          댓글
        </h2>
        <QueryError error={error as Error} onRetry={() => refetch()} />
      </section>
    );
  }

  const commentCount = comments?.length ?? 0;

  return (
    <section className="mt-6">
      {/* 헤더: 댓글 수 및 정렬 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          댓글 {commentCount}개
        </h2>

        {/* 정렬 옵션 */}
        {commentCount > 1 && (
          <div className="flex items-center gap-1">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setSortType(option.value)}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 text-sm',
                    'rounded-[var(--radius-md)]',
                    'transition-colors duration-[var(--duration-fast)]',
                    sortType === option.value
                      ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)]'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 댓글 작성 폼 */}
      <CommentForm postId={postId} />

      {/* 댓글 목록 */}
      <div className="space-y-4 mt-6">
        {commentCount === 0 ? (
          <EmptyState
            title="아직 댓글이 없습니다"
            description="첫 번째 댓글을 작성해보세요!"
          />
        ) : (
          sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </section>
  );
}

// 댓글 작성 폼
interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCancel?: () => void;
  placeholder?: string;
}

function CommentForm({
  postId,
  parentId,
  onCancel,
  placeholder = '댓글을 작성하세요...',
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const createComment = useCreateComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createComment.mutate(
      { postId, content: content.trim(), parentId },
      {
        onSuccess: () => {
          setContent('');
          onCancel?.();
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'bg-[var(--bg-surface)]',
        'rounded-[var(--radius-lg)]',
        'border border-[var(--border-default)]',
        'p-4'
      )}
    >
      <div className="flex gap-3">
        <Avatar name="나" size="sm" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className={cn(
              'w-full px-3 py-2',
              'bg-[var(--bg-page)]',
              'border border-[var(--border-default)]',
              'rounded-[var(--radius-md)]',
              'text-[var(--text-primary)]',
              'placeholder:text-[var(--text-tertiary)]',
              'resize-none',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]'
            )}
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                취소
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createComment.isPending}
              disabled={!content.trim()}
            >
              <Send className="w-4 h-4 mr-1" />
              {parentId ? '답글 작성' : '댓글 작성'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

// 댓글 아이템
interface CommentItemProps {
  comment: Comment;
  postId: string;
  currentUserId?: string;
  isReply?: boolean;
}

function CommentItem({
  comment,
  postId,
  currentUserId,
  isReply = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);

  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const toggleLike = useToggleCommentLike();

  const isAuthor = currentUserId === comment.author.id;

  const handleUpdate = () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }

    if (updateComment.isPending) return;
    updateComment.mutate(
      { commentId: comment.id, content: editContent.trim(), postId },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    if (deleteComment.isPending) return;
    deleteComment.mutate(
      { commentId: comment.id, postId },
      { onSuccess: () => setShowDeleteModal(false) }
    );
  };

  const handleLike = () => {
    if (toggleLike.isPending) return;
    toggleLike.mutate({ commentId: comment.id, postId });
  };

  if (comment.isDeleted) {
    return (
      <div
        className={cn(
          'p-4',
          'bg-[var(--bg-surface)]',
          'rounded-[var(--radius-lg)]',
          'border border-[var(--border-default)]',
          isReply && 'ml-10'
        )}
      >
        <p className="text-[var(--text-tertiary)] italic">
          삭제된 댓글입니다.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-[var(--bg-surface)]',
        'rounded-[var(--radius-lg)]',
        'border border-[var(--border-default)]',
        isReply && 'ml-10'
      )}
    >
      <div className="p-4">
        <div className="flex gap-3">
          <Avatar
            name={comment.author.displayName}
            src={comment.author.profileImage}
            size={isReply ? 'xs' : 'sm'}
          />
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-[var(--text-primary)]">
                  {comment.author.displayName}
                </span>
                <time className="text-sm text-[var(--text-tertiary)]">
                  {formatRelativeTime(new Date(comment.createdAt))}
                </time>
                {comment.updatedAt &&
                  new Date(comment.updatedAt).getTime() !==
                    new Date(comment.createdAt).getTime() && (
                    <span className="text-xs text-[var(--text-tertiary)]">
                      (수정됨)
                    </span>
                  )}
              </div>

              {/* More Menu */}
              {isAuthor && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className={cn(
                      'p-1',
                      'hover:bg-[var(--bg-hover)]',
                      'rounded-[var(--radius-md)]',
                      'text-[var(--text-tertiary)]'
                    )}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                      />
                      <div
                        className={cn(
                          'absolute right-0 top-full mt-1 z-20',
                          'bg-[var(--bg-surface)]',
                          'border border-[var(--border-default)]',
                          'rounded-[var(--radius-md)]',
                          'shadow-[var(--shadow-md)]',
                          'py-1 min-w-[120px]'
                        )}
                      >
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowMenu(false);
                          }}
                          className={cn(
                            'w-full px-3 py-2',
                            'flex items-center gap-2',
                            'text-sm text-[var(--text-primary)]',
                            'hover:bg-[var(--bg-hover)]'
                          )}
                        >
                          <Pencil className="w-4 h-4" />
                          수정
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteModal(true);
                            setShowMenu(false);
                          }}
                          className={cn(
                            'w-full px-3 py-2',
                            'flex items-center gap-2',
                            'text-sm text-[var(--color-error-500)]',
                            'hover:bg-[var(--bg-hover)]'
                          )}
                        >
                          <Trash2 className="w-4 h-4" />
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className={cn(
                    'w-full px-3 py-2',
                    'bg-[var(--bg-page)]',
                    'border border-[var(--border-default)]',
                    'rounded-[var(--radius-md)]',
                    'text-[var(--text-primary)]',
                    'resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]'
                  )}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleUpdate}
                    isLoading={updateComment.isPending}
                  >
                    수정
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-[var(--text-secondary)] mt-1 whitespace-pre-wrap">
                {comment.content}
              </p>
            )}

            {/* Actions */}
            {!isEditing && (
              <div className="flex items-center gap-4 mt-3">
                <LikeIconButton
                  isLiked={comment.isLiked}
                  likeCount={comment.likeCount}
                  onToggle={handleLike}
                />
                {!isReply && (
                  <button
                    onClick={() => setIsReplying(!isReplying)}
                    className={cn(
                      'text-sm text-[var(--text-tertiary)]',
                      'hover:text-[var(--text-primary)]',
                      'transition-colors duration-[var(--duration-fast)]'
                    )}
                  >
                    답글
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-4 ml-10">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onCancel={() => setIsReplying(false)}
              placeholder="답글을 작성하세요..."
            />
          </div>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-t border-[var(--border-default)]">
          <div className="p-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                currentUserId={currentUserId}
                isReply
              />
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="댓글 삭제"
        message="이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        variant="danger"
        isLoading={deleteComment.isPending}
      />
    </div>
  );
}

export default CommentSection;
