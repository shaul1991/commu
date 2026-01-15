'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/templates';
import { Button } from '@/components/atoms';
import { Search, FileText, User, Hash, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { search, type SearchResult } from '@/lib/api/search';
import { formatRelativeTime } from '@/lib/utils';

type TabType = 'all' | 'posts' | 'users' | 'tags';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const { data: searchResult, isLoading, error } = useQuery({
    queryKey: ['search', query, activeTab],
    queryFn: async () => {
      const response = await search(query, activeTab);
      return response.data;
    },
    enabled: !!query,
  });

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
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16">
          <AlertCircle className="w-16 h-16 text-[var(--color-error-500)] mb-4" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            검색 중 오류가 발생했습니다
          </h2>
          <p className="text-[var(--text-secondary)]">
            잠시 후 다시 시도해주세요
          </p>
        </div>
      ) : (
        <>
          {/* Posts Results */}
          {(activeTab === 'all' || activeTab === 'posts') && searchResult?.posts && (
            <section className="mb-8">
              {activeTab === 'all' && searchResult.posts.length > 0 && (
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
              {searchResult.posts.length > 0 ? (
                <div className="space-y-4">
                  {searchResult.posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.id}`}
                      className="block bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 hover:border-[var(--border-strong)] transition-colors"
                    >
                      <h3 className="font-medium text-[var(--text-primary)] mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author?.displayName || '익명'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatRelativeTime(post.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {post.likeCount}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : activeTab === 'posts' && (
                <div className="text-center py-8 text-[var(--text-secondary)]">
                  검색 결과가 없습니다
                </div>
              )}
            </section>
          )}

          {/* Users Results */}
          {(activeTab === 'all' || activeTab === 'users') && searchResult?.users && (
            <section className="mb-8">
              {activeTab === 'all' && searchResult.users.length > 0 && (
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
              {searchResult.users.length > 0 ? (
                <div className="space-y-4">
                  {searchResult.users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/users/${user.username}`}
                      className="block bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 hover:border-[var(--border-strong)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center text-lg font-bold text-[var(--color-primary-600)] overflow-hidden">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.displayName || ''} className="w-full h-full object-cover" />
                          ) : (
                            (user.displayName || user.username || '?')[0]
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-[var(--text-primary)]">
                              {user.displayName || user.username}
                            </h3>
                            <span className="text-sm text-[var(--text-tertiary)]">
                              @{user.username}
                            </span>
                          </div>
                          {user.bio && (
                            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                              {user.bio}
                            </p>
                          )}
                        </div>
                        <Button variant="primary" size="sm">팔로우</Button>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : activeTab === 'users' && (
                <div className="text-center py-8 text-[var(--text-secondary)]">
                  검색 결과가 없습니다
                </div>
              )}
            </section>
          )}

          {/* Tags Results */}
          {(activeTab === 'all' || activeTab === 'tags') && searchResult?.tags && (
            <section className="mb-8">
              {activeTab === 'all' && searchResult.tags.length > 0 && (
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
              {searchResult.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {searchResult.tags.map((tag) => (
                    <Link
                      key={tag.name}
                      href={`/tags/${tag.name}`}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-full text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong)] transition-colors"
                    >
                      <span>#</span>
                      <span>{tag.name}</span>
                      <span className="text-[var(--text-tertiary)]">({tag.count})</span>
                    </Link>
                  ))}
                </div>
              ) : activeTab === 'tags' && (
                <div className="text-center py-8 text-[var(--text-secondary)]">
                  검색 결과가 없습니다
                </div>
              )}
            </section>
          )}

          {/* No results at all */}
          {searchResult &&
           searchResult.posts?.length === 0 &&
           searchResult.users?.length === 0 &&
           searchResult.tags?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Search className="w-16 h-16 text-[var(--text-tertiary)] mb-4" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                검색 결과가 없습니다
              </h2>
              <p className="text-[var(--text-secondary)]">
                다른 검색어로 시도해보세요
              </p>
            </div>
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
