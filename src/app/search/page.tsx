'use client';

import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/templates';
import { Button } from '@/components/atoms';
import { Search, FileText, User, Hash, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';

// Mock search results
const mockPosts = [
  {
    id: '1',
    title: 'Next.js 15에서 달라진 점들',
    content: 'Next.js 15 버전에서 새롭게 추가된 기능들과 변경사항을 정리해봤습니다...',
    author: { name: '개발자김', username: 'devkim' },
    createdAt: '2시간 전',
    likeCount: 42,
    commentCount: 12,
  },
  {
    id: '2',
    title: 'TypeScript 타입 추론의 모든 것',
    content: 'TypeScript의 강력한 타입 추론 기능을 활용하는 방법을 알아봅니다...',
    author: { name: 'TS마스터', username: 'tsmaster' },
    createdAt: '5시간 전',
    likeCount: 87,
    commentCount: 23,
  },
  {
    id: '3',
    title: 'React Query vs SWR 비교 분석',
    content: '데이터 페칭 라이브러리 React Query와 SWR을 심층 비교해봤습니다...',
    author: { name: '프론트엔드러', username: 'frontendev' },
    createdAt: '1일 전',
    likeCount: 156,
    commentCount: 45,
  },
];

const mockUsers = [
  { name: '개발자김', username: 'devkim', followers: 1234, bio: '풀스택 개발자 | Next.js 애호가' },
  { name: 'TS마스터', username: 'tsmaster', followers: 2345, bio: 'TypeScript 전도사' },
];

const mockTags = [
  { name: 'Next.js', count: 234 },
  { name: 'React', count: 189 },
  { name: 'TypeScript', count: 156 },
];

type TabType = 'all' | 'posts' | 'users' | 'tags';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);

  // Derive loading state from whether current query has been loaded
  const isLoading = query !== '' && query !== loadedQuery;

  useEffect(() => {
    // Simulate API call - setState only in async callback
    const timer = setTimeout(() => {
      setLoadedQuery(query || null);
    }, query ? 500 : 0);
    return () => clearTimeout(timer);
  }, [query]);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: '전체', icon: <Search className="w-4 h-4" /> },
    { id: 'posts', label: '게시글', icon: <FileText className="w-4 h-4" /> },
    { id: 'users', label: '사용자', icon: <User className="w-4 h-4" /> },
    { id: 'tags', label: '태그', icon: <Hash className="w-4 h-4" /> },
  ];

  if (!query) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <Search className="w-16 h-16 text-[var(--text-tertiary)] mb-4" />
          <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            검색어를 입력하세요
          </h1>
          <p className="text-[var(--text-secondary)]">
            게시글, 사용자, 태그를 검색할 수 있습니다
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Search className="w-6 h-6 text-[var(--color-primary-500)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">검색 결과</h1>
        </div>
        <p className="mt-1 text-[var(--text-secondary)]">
          &quot;{query}&quot;에 대한 검색 결과입니다
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[var(--color-primary-500)] text-white'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 animate-pulse"
            >
              <div className="h-5 bg-[var(--bg-muted)] rounded w-3/4 mb-3" />
              <div className="h-4 bg-[var(--bg-muted)] rounded w-full mb-2" />
              <div className="h-4 bg-[var(--bg-muted)] rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Posts Results */}
          {(activeTab === 'all' || activeTab === 'posts') && (
            <section className="mb-8">
              {activeTab === 'all' && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    게시글
                  </h2>
                  <button
                    onClick={() => setActiveTab('posts')}
                    className="text-sm text-[var(--color-primary-500)] hover:underline"
                  >
                    더 보기
                  </button>
                </div>
              )}
              <div className="space-y-4">
                {mockPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.id}`}
                    className="block bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 hover:border-[var(--border-strong)] transition-colors"
                  >
                    <h3 className="font-medium text-[var(--text-primary)] mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.createdAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {post.likeCount}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Users Results */}
          {(activeTab === 'all' || activeTab === 'users') && (
            <section className="mb-8">
              {activeTab === 'all' && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <User className="w-5 h-5" />
                    사용자
                  </h2>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-sm text-[var(--color-primary-500)] hover:underline"
                  >
                    더 보기
                  </button>
                </div>
              )}
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div
                    key={user.username}
                    className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 hover:border-[var(--border-strong)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center text-lg font-bold text-[var(--color-primary-600)]">
                        {user.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-[var(--text-primary)]">{user.name}</h3>
                          <span className="text-sm text-[var(--text-tertiary)]">@{user.username}</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mt-0.5">{user.bio}</p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                          팔로워 {user.followers.toLocaleString()}명
                        </p>
                      </div>
                      <Button variant="primary" size="sm">팔로우</Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tags Results */}
          {(activeTab === 'all' || activeTab === 'tags') && (
            <section className="mb-8">
              {activeTab === 'all' && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    태그
                  </h2>
                  <button
                    onClick={() => setActiveTab('tags')}
                    className="text-sm text-[var(--color-primary-500)] hover:underline"
                  >
                    더 보기
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {mockTags.map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/tag/${tag.name}`}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-full text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong)] transition-colors"
                  >
                    <span>#</span>
                    <span>{tag.name}</span>
                    <span className="text-[var(--text-tertiary)]">({tag.count})</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary-500)] border-t-transparent rounded-full" />
          </div>
        </MainLayout>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
