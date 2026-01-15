'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/templates';
import { Button, Badge, Skeleton } from '@/components/atoms';
import { ThumbsUp, ThumbsDown, MessageCircle, Bookmark, MoreHorizontal, Flame, Clock } from 'lucide-react';
import { getTrendingPosts, type TrendingPost } from '@/lib/api/posts';

type PeriodFilter = 'today' | 'week' | 'month' | 'all';

export default function TrendingPage() {
  const [posts, setPosts] = useState<TrendingPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodFilter>('today');

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const data = await getTrendingPosts(period);
        setPosts(data);
      } catch (error) {
        console.error('트렌딩 게시글 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [period]);

  const handlePeriodChange = (newPeriod: PeriodFilter) => {
    setPeriod(newPeriod);
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-6 h-6 text-[var(--color-error-500)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">트렌딩</h1>
        </div>
        <p className="mt-1 text-[var(--text-secondary)]">
          지금 가장 뜨거운 게시글을 확인하세요
        </p>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={period === 'today' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handlePeriodChange('today')}
        >
          <Clock className="w-4 h-4 mr-1" />
          오늘
        </Button>
        <Button
          variant={period === 'week' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handlePeriodChange('week')}
        >
          이번 주
        </Button>
        <Button
          variant={period === 'month' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handlePeriodChange('month')}
        >
          이번 달
        </Button>
        <Button
          variant={period === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handlePeriodChange('all')}
        >
          전체
        </Button>
      </div>

      {/* Trending Post List */}
      <div className="space-y-4">
        {isLoading ? (
          // 스켈레톤 로딩
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="w-12 h-5" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                  <Skeleton className="w-3/4 h-6 mb-2" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-2/3 h-4 mt-1" />
                </div>
              </div>
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-tertiary)]">
            트렌딩 게시글이 없습니다.
          </div>
        ) : (
          posts.map((post, index) => (
            <article
              key={post.id}
              className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 hover:border-[var(--border-strong)] transition-colors"
            >
              {/* Rank Badge */}
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index < 3
                    ? 'bg-[var(--color-primary-500)] text-white'
                    : 'bg-[var(--bg-muted)] text-[var(--text-tertiary)]'
                }`}>
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={post.trending ? 'error' : 'primary'}>{post.channel}</Badge>
                      <span className="text-sm text-[var(--text-tertiary)]">
                        {post.author} · {post.createdAt}
                      </span>
                    </div>
                    <button className="p-1 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]">
                      <MoreHorizontal className="w-5 h-5 text-[var(--text-tertiary)]" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {post.title}
                  </h2>
                  <p className="text-[var(--text-secondary)] line-clamp-2">
                    {post.content}
                  </p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border-default)]">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-[var(--text-secondary)] min-w-[2rem]">
                        {post.upvotes}
                      </span>
                      <button className="p-1.5 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm text-[var(--text-secondary)]">
                        {post.comments}
                      </span>
                    </button>
                    <button className="p-1.5 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)] ml-auto">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Load More */}
      {!isLoading && posts.length > 0 && (
        <div className="mt-6 text-center">
          <Button variant="secondary">더 보기</Button>
        </div>
      )}
    </MainLayout>
  );
}
