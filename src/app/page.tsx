'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/templates';
import { PostList } from '@/components/organisms';
import { cn } from '@/lib/utils';

type FeedTab = 'trending' | 'latest' | 'following';

export default function Home() {
  const [activeTab, setActiveTab] = useState<FeedTab>('trending');

  const tabs = [
    { id: 'trending' as const, label: '트렌딩' },
    { id: 'latest' as const, label: '최신' },
    { id: 'following' as const, label: '팔로잉' },
  ];

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">홈</h1>
        <p className="mt-1 text-[var(--text-secondary)]">
          최신 게시글을 확인하세요
        </p>
      </div>

      {/* Feed Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[var(--border-default)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 font-medium',
              'transition-colors duration-[var(--duration-fast)]',
              activeTab === tab.id
                ? 'text-[var(--color-primary-500)] border-b-2 border-[var(--color-primary-500)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Post List */}
      <PostList />
    </MainLayout>
  );
}
