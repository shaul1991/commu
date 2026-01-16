'use client';

/**
 * 좋아요한 글 페이지
 * /mypage/likes
 */

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useLikedPosts, useLikedPostsInfinite } from '@/hooks/useMyActivity';
import { useIsMobile } from '@/hooks/useMediaQuery';
import {
  ActivityPageTemplate,
  ActivityList,
  PostCard,
} from '@/components/molecules/myActivity';
import type { LikedPost } from '@/types/myActivity';

export default function LikedPostsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const isMobile = useIsMobile();

  const [page, setPage] = useState(1);

  // 데스크톱: 페이지네이션
  const {
    data: paginatedData,
    isLoading: isLoadingPaginated,
  } = useLikedPosts({
    page,
    limit: 10,
    enabled: isAuthenticated && !isMobile,
  });

  // 모바일: 무한 스크롤
  const {
    data: infiniteData,
    isLoading: isLoadingInfinite,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLikedPostsInfinite(10, isAuthenticated && isMobile);

  // 데이터 처리
  const posts = isMobile
    ? infiniteData?.pages.flatMap((page) => page.data) || []
    : paginatedData?.data || [];

  const isLoading = authLoading || (isMobile ? isLoadingInfinite : isLoadingPaginated);
  const isEmpty = !isLoading && posts.length === 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <ActivityPageTemplate
      title="좋아요한 글"
      description={paginatedData?.meta ? `총 ${paginatedData.meta.total}개` : undefined}
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="좋아요한 글이 없습니다."
      emptyIcon={<Heart className="w-12 h-12" />}
      paginationMeta={!isMobile ? paginatedData?.meta : undefined}
      onPageChange={handlePageChange}
      hasMore={isMobile && hasNextPage}
      onLoadMore={handleLoadMore}
      isLoadingMore={isFetchingNextPage}
    >
      <ActivityList<LikedPost>
        items={posts}
        keyExtractor={(post) => post.id}
        renderItem={(post) => <PostCard post={post} showChannel />}
      />
    </ActivityPageTemplate>
  );
}
