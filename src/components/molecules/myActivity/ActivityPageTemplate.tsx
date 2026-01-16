'use client';

/**
 * ActivityPageTemplate
 * 마이페이지 내 활동 페이지들의 공통 레이아웃 템플릿
 */

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Pagination } from '@/components/molecules/Pagination';
import type { CursorPaginationMeta } from '@/types/myActivity';

interface ActivityPageTemplateProps {
  title: string;
  description?: string;
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  // 페이지네이션 (데스크톱)
  paginationMeta?: CursorPaginationMeta;
  onPageChange?: (page: number) => void;
  // 무한 스크롤 (모바일)
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  // 정렬
  sortOptions?: { value: string; label: string }[];
  currentSort?: string;
  onSortChange?: (sort: string) => void;
  // 추가 헤더 액션
  headerActions?: ReactNode;
}

export function ActivityPageTemplate({
  title,
  description,
  children,
  isLoading,
  isEmpty,
  emptyMessage = '데이터가 없습니다.',
  emptyIcon,
  paginationMeta,
  onPageChange,
  hasMore,
  onLoadMore,
  isLoadingMore,
  sortOptions,
  currentSort,
  onSortChange,
  headerActions,
}: ActivityPageTemplateProps) {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--bg-default)] border-b border-[var(--border-default)]">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className={cn(
                'p-2 -ml-2 rounded-full',
                'text-[var(--text-secondary)]',
                'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                'transition-colors duration-[var(--duration-fast)]'
              )}
              aria-label="뒤로 가기"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-[var(--text-primary)]">
                {title}
              </h1>
              {description && (
                <p className="text-xs text-[var(--text-tertiary)]">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            {sortOptions && currentSort && onSortChange && (
              <select
                value={currentSort}
                onChange={(e) => onSortChange(e.target.value)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-lg',
                  'bg-[var(--bg-surface)] border border-[var(--border-default)]',
                  'text-[var(--text-primary)]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]'
                )}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {headerActions}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        {isLoading ? (
          <LoadingSkeleton />
        ) : isEmpty ? (
          <EmptyState message={emptyMessage} icon={emptyIcon} />
        ) : (
          <>
            {children}

            {/* 데스크톱: 페이지네이션 */}
            {!isMobile && paginationMeta && onPageChange && paginationMeta.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  meta={{
                    page: paginationMeta.page,
                    limit: paginationMeta.limit,
                    total: paginationMeta.total,
                    totalPages: paginationMeta.totalPages,
                    hasNext: paginationMeta.hasNextPage,
                    hasPrev: paginationMeta.hasPreviousPage,
                  }}
                  onPageChange={onPageChange}
                />
              </div>
            )}

            {/* 모바일: 더 보기 버튼 */}
            {isMobile && hasMore && onLoadMore && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                  className={cn(
                    'px-6 py-3 rounded-lg',
                    'bg-[var(--bg-surface)] border border-[var(--border-default)]',
                    'text-[var(--text-secondary)] text-sm font-medium',
                    'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-all duration-[var(--duration-fast)]'
                  )}
                >
                  {isLoadingMore ? '불러오는 중...' : '더 보기'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// 로딩 스켈레톤
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'p-4 rounded-lg',
            'bg-[var(--bg-surface)] border border-[var(--border-default)]',
            'animate-pulse'
          )}
        >
          <div className="h-5 bg-[var(--bg-hover)] rounded w-3/4 mb-3" />
          <div className="h-4 bg-[var(--bg-hover)] rounded w-full mb-2" />
          <div className="h-4 bg-[var(--bg-hover)] rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}

// 빈 상태 컴포넌트
interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
}

function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="mb-4 text-[var(--text-tertiary)]">
          {icon}
        </div>
      )}
      <p className="text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}

export default ActivityPageTemplate;
