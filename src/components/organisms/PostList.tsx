'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { usePostsInfinite, usePosts } from '@/hooks/usePost';
import type { PostSummary } from '@/types';
import { PostCard } from './PostCard';
import { PostListSkeleton, PageLoading } from '@/components/atoms';
import { Pagination, PaginationInfo } from '@/components/molecules';
import { QueryError, EmptyState } from '@/components/templates';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostListProps {
  channelSlug?: string;
  limit?: number;
}

export function PostList({ channelSlug, limit = 10 }: PostListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = usePostsInfinite(limit, channelSlug);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Intersection Observer를 사용한 무한 스크롤
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver]);

  // 로딩 상태
  if (isLoading) {
    return <PostListSkeleton count={5} />;
  }

  // 에러 상태
  if (isError) {
    return (
      <QueryError
        error={error as Error}
        onRetry={() => refetch()}
      />
    );
  }

  // 모든 페이지의 게시글 합치기
  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  // 빈 상태
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-12 h-12" />}
        title="게시글이 없습니다"
        description={
          channelSlug
            ? '이 채널에는 아직 게시글이 없습니다.'
            : '첫 번째 게시글을 작성해보세요!'
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* 무한 스크롤 트리거 영역 */}
      <div
        ref={observerTarget}
        className={cn(
          'py-4',
          !hasNextPage && 'hidden'
        )}
      >
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <PageLoading message="더 불러오는 중..." />
          </div>
        )}
      </div>

      {/* 더 이상 게시글이 없을 때 */}
      {!hasNextPage && posts.length > 0 && (
        <p className="text-center text-sm text-[var(--text-tertiary)] py-4">
          모든 게시글을 불러왔습니다.
        </p>
      )}
    </div>
  );
}

// 페이지네이션 방식의 게시글 목록 (SSR 지원용)
interface PaginatedPostListProps {
  channelSlug?: string;
  initialPage?: number;
  limit?: number;
  showPagination?: boolean;
  showInfo?: boolean;
}

export function PaginatedPostList({
  channelSlug,
  initialPage = 1,
  limit = 10,
  showPagination = true,
  showInfo = true,
}: PaginatedPostListProps) {
  const [page, setPage] = useState(initialPage);
  const { data, isLoading, isError, error, refetch } = usePosts(
    page,
    limit,
    channelSlug
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <PostListSkeleton count={limit} />;
  }

  if (isError) {
    return (
      <QueryError
        error={error as Error}
        onRetry={() => refetch()}
      />
    );
  }

  const posts = data?.data ?? [];
  const meta = data?.meta;

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-12 h-12" />}
        title="게시글이 없습니다"
        description="아직 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 정보 */}
      {showInfo && meta && (
        <div className="flex items-center justify-between">
          <PaginationInfo meta={meta} />
        </div>
      )}

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {posts.map((post: PostSummary) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* 페이지네이션 */}
      {showPagination && meta && (
        <div className="pt-4 border-t border-[var(--border-default)]">
          <Pagination
            meta={meta}
            onPageChange={handlePageChange}
            size="md"
          />
        </div>
      )}
    </div>
  );
}

export default PostList;
