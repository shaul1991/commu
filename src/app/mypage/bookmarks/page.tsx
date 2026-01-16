'use client';

/**
 * 북마크한 글 페이지
 * /mypage/bookmarks
 */

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useBookmarkedPosts, useBookmarkedPostsInfinite } from '@/hooks/useMyActivity';
import { useIsMobile } from '@/hooks/useMediaQuery';
import {
  ActivityPageTemplate,
  ActivityList,
  PostCard,
} from '@/components/molecules/myActivity';
import type { BookmarkedPost } from '@/types/myActivity';

export default function BookmarkedPostsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const isMobile = useIsMobile();

  const [page, setPage] = useState(1);

  // 데스크톱: 페이지네이션
  const {
    data: paginatedData,
    isLoading: isLoadingPaginated,
  } = useBookmarkedPosts({
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
  } = useBookmarkedPostsInfinite(10, undefined, isAuthenticated && isMobile);

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
      title="북마크"
      description={paginatedData?.meta ? `총 ${paginatedData.meta.total}개` : undefined}
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="북마크한 글이 없습니다."
      emptyIcon={<Bookmark className="w-12 h-12" />}
      paginationMeta={!isMobile ? paginatedData?.meta : undefined}
      onPageChange={handlePageChange}
      hasMore={isMobile && hasNextPage}
      onLoadMore={handleLoadMore}
      isLoadingMore={isFetchingNextPage}
    >
      <ActivityList<BookmarkedPost>
        items={posts}
        keyExtractor={(post) => post.id}
        renderItem={(post) => <PostCard post={post} showChannel />}
      />
    </ActivityPageTemplate>
  );
}
