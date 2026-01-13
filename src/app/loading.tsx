'use client';

import { cn } from '@/lib/utils';
import { Spinner } from '@/components/atoms';

export default function Loading() {
  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center',
        'bg-[var(--bg-page)]'
      )}
    >
      <Spinner size="xl" />
      <p className="mt-4 text-[var(--text-secondary)]">로딩 중...</p>
    </div>
  );
}
