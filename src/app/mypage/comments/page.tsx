'use client';

/**
 * 내 댓글 페이지
 * /mypage/comments
 */

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useMyComments, useMyCommentsInfinite } from '@/hooks/useMyActivity';
import { useIsMobile } from '@/hooks/useMediaQuery';
import {
  ActivityPageTemplate,
  ActivityList,
  CommentCard,
} from '@/components/molecules/myActivity';
import type { CommentSortOption, MyComment } from '@/types/myActivity';

const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
];

export default function MyCommentsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const isMobile = useIsMobile();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<CommentSortOption>('latest');

  // 데스크톱: 페이지네이션
  const {
    data: paginatedData,
    isLoading: isLoadingPaginated,
  } = useMyComments({
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
  } = useMyCommentsInfinite(10, sort, isAuthenticated && isMobile);

  // 데이터 처리
  const comments = isMobile
    ? infiniteData?.pages.flatMap((page) => page.data) || []
    : paginatedData?.data || [];

  const isLoading = authLoading || (isMobile ? isLoadingInfinite : isLoadingPaginated);
  const isEmpty = !isLoading && comments.length === 0;

  const handleSortChange = (newSort: string) => {
    setSort(newSort as CommentSortOption);
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
      title="내 댓글"
      description={paginatedData?.meta ? `총 ${paginatedData.meta.total}개` : undefined}
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="작성한 댓글이 없습니다."
      emptyIcon={<MessageCircle className="w-12 h-12" />}
      sortOptions={SORT_OPTIONS}
      currentSort={sort}
      onSortChange={handleSortChange}
      paginationMeta={!isMobile ? paginatedData?.meta : undefined}
      onPageChange={handlePageChange}
      hasMore={isMobile && hasNextPage}
      onLoadMore={handleLoadMore}
      isLoadingMore={isFetchingNextPage}
    >
      <ActivityList<MyComment>
        items={comments}
        keyExtractor={(comment) => comment.id}
        renderItem={(comment) => <CommentCard comment={comment} />}
      />
    </ActivityPageTemplate>
  );
}
