'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/templates';
import { CardSkeleton, CommentListSkeleton } from '@/components/atoms';
import { PostDetail, CommentSection } from '@/components/organisms';
import { QueryError } from '@/components/templates';
import {
  usePost,
  useTogglePostLike,
  useTogglePostBookmark,
} from '@/hooks/usePost';
import { cn } from '@/lib/utils';
import { toast } from '@/stores/uiStore';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PostPage({ params }: PageProps) {
  const { id: postId } = use(params);

  const { data: post, isLoading, isError, error, refetch } = usePost(postId);
  const toggleLike = useTogglePostLike();
  const toggleBookmark = useTogglePostBookmark();

  const handleLikeToggle = () => {
    toggleLike.mutate(postId);
  };

  const handleBookmarkToggle = () => {
    toggleBookmark.mutate(postId);
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.content.substring(0, 100),
          url,
        });
      } catch (err) {
        // 사용자가 공유를 취소한 경우 무시
        if ((err as Error).name !== 'AbortError') {
          console.error('공유 실패:', err);
        }
      }
    } else {
      // 클립보드에 복사
      try {
        await navigator.clipboard.writeText(url);
        toast.success('링크가 복사되었습니다.');
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
        toast.error('링크 복사에 실패했습니다.');
      }
    }
  };

  const handleReport = () => {
    // TODO: 신고 모달 연동
    toast.info('신고 기능은 준비 중입니다.');
  };

  return (
    <MainLayout>
      {/* Desktop Back Button */}
      <div className="hidden lg:block mb-4">
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

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <CardSkeleton />
          <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4">
            <CommentListSkeleton count={3} />
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <QueryError error={error as Error} onRetry={() => refetch()} />
      )}

      {/* Post Content */}
      {post && (
        <>
          <PostDetail
            post={post}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onShare={handleShare}
            onReport={handleReport}
          />

          {/* Comments Section */}
          <CommentSection postId={postId} currentUserId="current-user-id" />
        </>
      )}
    </MainLayout>
  );
}
