'use client';

/**
 * ActivityList
 * 내 활동 목록을 렌더링하는 공통 컴포넌트
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ActivityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

const gapStyles = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
};

export function ActivityList<T>({
  items,
  renderItem,
  keyExtractor,
  className,
  gap = 'md',
}: ActivityListProps<T>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-col', gapStyles[gap], className)}>
      {items.map((item, index) => (
        <div key={keyExtractor(item)}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
}

export default ActivityList;
