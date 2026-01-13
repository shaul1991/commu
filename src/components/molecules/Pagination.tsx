'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: {
    button: 'h-8 w-8 text-sm',
    icon: 'w-4 h-4',
  },
  md: {
    button: 'h-10 w-10 text-base',
    icon: 'w-5 h-5',
  },
  lg: {
    button: 'h-12 w-12 text-lg',
    icon: 'w-6 h-6',
  },
};

export function Pagination({
  meta,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
  size = 'md',
}: PaginationProps) {
  const { page, totalPages, hasNext, hasPrev } = meta;
  const styles = sizeStyles[size];

  // 페이지 번호 목록 생성
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];

    // 총 페이지가 maxVisiblePages보다 작거나 같으면 모든 페이지 표시
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // 현재 페이지 기준으로 표시할 페이지 범위 계산
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, page + half);

    // 시작이나 끝에서 부족한 페이지 보충
    if (page - half < 1) {
      end = Math.min(totalPages, end + (half - page + 1));
    }
    if (page + half > totalPages) {
      start = Math.max(1, start - (page + half - totalPages));
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="페이지 네비게이션"
    >
      {/* First Page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrev}
          className={cn(
            'flex items-center justify-center',
            'rounded-[var(--radius-md)]',
            'text-[var(--text-secondary)]',
            'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
            'transition-all duration-[var(--duration-fast)]',
            styles.button
          )}
          aria-label="첫 페이지로"
        >
          <ChevronsLeft className={styles.icon} />
        </button>
      )}

      {/* Previous Page */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
        className={cn(
          'flex items-center justify-center',
          'rounded-[var(--radius-md)]',
          'text-[var(--text-secondary)]',
          'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
          'transition-all duration-[var(--duration-fast)]',
          styles.button
        )}
        aria-label="이전 페이지"
      >
        <ChevronLeft className={styles.icon} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={cn(
                'flex items-center justify-center',
                'rounded-[var(--radius-md)]',
                'text-[var(--text-secondary)]',
                'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                'transition-all duration-[var(--duration-fast)]',
                styles.button
              )}
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="px-2 text-[var(--text-tertiary)]">...</span>
            )}
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={cn(
              'flex items-center justify-center',
              'rounded-[var(--radius-md)]',
              'transition-all duration-[var(--duration-fast)]',
              styles.button,
              pageNum === page
                ? 'bg-[var(--color-primary-500)] text-white font-medium'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
            )}
            aria-label={`${pageNum} 페이지`}
            aria-current={pageNum === page ? 'page' : undefined}
          >
            {pageNum}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-2 text-[var(--text-tertiary)]">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={cn(
                'flex items-center justify-center',
                'rounded-[var(--radius-md)]',
                'text-[var(--text-secondary)]',
                'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                'transition-all duration-[var(--duration-fast)]',
                styles.button
              )}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Page */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className={cn(
          'flex items-center justify-center',
          'rounded-[var(--radius-md)]',
          'text-[var(--text-secondary)]',
          'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
          'transition-all duration-[var(--duration-fast)]',
          styles.button
        )}
        aria-label="다음 페이지"
      >
        <ChevronRight className={styles.icon} />
      </button>

      {/* Last Page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
          className={cn(
            'flex items-center justify-center',
            'rounded-[var(--radius-md)]',
            'text-[var(--text-secondary)]',
            'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
            'transition-all duration-[var(--duration-fast)]',
            styles.button
          )}
          aria-label="마지막 페이지로"
        >
          <ChevronsRight className={styles.icon} />
        </button>
      )}
    </nav>
  );
}

// 간단한 페이지 정보 표시 컴포넌트
interface PaginationInfoProps {
  meta: PaginationMeta;
}

export function PaginationInfo({ meta }: PaginationInfoProps) {
  const { page, limit, total } = meta;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <p className="text-sm text-[var(--text-tertiary)]">
      전체 {total.toLocaleString()}개 중 {start.toLocaleString()}-{end.toLocaleString()}
    </p>
  );
}

export default Pagination;
