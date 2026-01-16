'use client';

/**
 * 내 게시글 페이지
 * /mypage/posts
 */

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useMyPosts, useMyPostsInfinite } from '@/hooks/useMyActivity';
import { useIsMobile } from '@/hooks/useMediaQuery';
import {
  ActivityPageTemplate,
  ActivityList,
  PostCard,
} from '@/components/molecules/myActivity';
import type { PostSortOption, MyPost } from '@/types/myActivity';

const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'popular', label: '인기순' },
  { value: 'views', label: '조회순' },
];

export default function MyPostsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const isMobile = useIsMobile();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<PostSortOption>('latest');

  // 데스크톱: 페이지네이션
  const {
    data: paginatedData,
    isLoading: isLoadingPaginated,
  } = useMyPosts({
    page,
    limit: 10,
    sort,
    enabled: isAuthenticated && !isMobile,
  });

  // 모바일: 무한 스크롤
  const {
    data: infiniteData,
    isLoading: isLoadingInfinite,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyPostsInfinite(10, sort, isAuthenticated && isMobile);

  // 데이터 처리
  const posts = isMobile
    ? infiniteData?.pages.flatMap((page) => page.data) || []
    : paginatedData?.data || [];

  const isLoading = authLoading || (isMobile ? isLoadingInfinite : isLoadingPaginated);
  const isEmpty = !isLoading && posts.length === 0;

  const handleSortChange = (newSort: string) => {
    setSort(newSort as PostSortOption);
    setPage(1);
  };

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
      title="내 게시글"
      description={paginatedData?.meta ? `총 ${paginatedData.meta.total}개` : undefined}
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="작성한 게시글이 없습니다."
      emptyIcon={<FileText className="w-12 h-12" />}
      sortOptions={SORT_OPTIONS}
      currentSort={sort}
      onSortChange={handleSortChange}
      paginationMeta={!isMobile ? paginatedData?.meta : undefined}
      onPageChange={handlePageChange}
      hasMore={isMobile && hasNextPage}
      onLoadMore={handleLoadMore}
      isLoadingMore={isFetchingNextPage}
    >
      <ActivityList<MyPost>
        items={posts}
        keyExtractor={(post) => post.id}
        renderItem={(post) => <PostCard post={post} />}
      />
    </ActivityPageTemplate>
  );
}
