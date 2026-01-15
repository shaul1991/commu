'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates';
import { PostCard } from '@/components/organisms';
import { Button, Skeleton } from '@/components/atoms';
import { Pagination } from '@/components/molecules';
import { Users, FileText, Bell, BellOff, TrendingUp, Clock, MessageCircle } from 'lucide-react';
import { fetchChannel, fetchChannelPosts, toggleChannelSubscription } from '@/lib/api/channels';
import { formatNumber } from '@/lib/utils';
import type { Channel, PostSummary, PaginationMeta } from '@/types';

const colorMap: Record<string, string> = {
  primary: 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]',
  success: 'bg-[var(--color-success-50)] text-[var(--color-success-600)]',
  warning: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]',
  info: 'bg-[var(--color-info-50)] text-[var(--color-info-600)]',
  error: 'bg-[var(--color-error-50)] text-[var(--color-error-600)]',
  secondary: 'bg-[var(--bg-muted)] text-[var(--text-secondary)]',
};

type SortOption = 'popular' | 'latest' | 'comments';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ChannelDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [page, setPage] = useState(1);

  // 채널 정보 로드
  useEffect(() => {
    const loadChannel = async () => {
      setIsLoading(true);
      try {
        const data = await fetchChannel(slug);
        setChannel(data);
      } catch (error) {
        console.error('채널 로드 실패:', error);
        router.push('/channels');
      } finally {
        setIsLoading(false);
      }
    };

    loadChannel();
  }, [slug, router]);

  // 게시글 목록 로드
  useEffect(() => {
    const loadPosts = async () => {
      setIsPostsLoading(true);
      try {
        const response = await fetchChannelPosts(slug, page, 10, sortBy);
        setPosts(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error('게시글 로드 실패:', error);
      } finally {
        setIsPostsLoading(false);
      }
    };

    if (channel) {
      loadPosts();
    }
  }, [slug, channel, page, sortBy]);

  const handleSubscribeToggle = async () => {
    if (!channel) return;
    setIsSubscribing(true);
    try {
      const updated = await toggleChannelSubscription(slug);
      setChannel(updated);
    } catch (error) {
      console.error('구독 상태 변경 실패:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'popular', label: '인기', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'latest', label: '최신', icon: <Clock className="w-4 h-4" /> },
    { value: 'comments', label: '댓글순', icon: <MessageCircle className="w-4 h-4" /> },
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <Skeleton className="w-16 h-16 rounded-[var(--radius-lg)]" />
            <div className="flex-1">
              <Skeleton className="h-8 w-32 mb-3" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex gap-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!channel) {
    return null;
  }

  const colorClass = colorMap[channel.color || 'primary'] || colorMap.primary;

  return (
    <MainLayout>
      {/* Channel Header */}
      <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-4">
          {/* Channel Icon */}
          <div
            className={`w-16 h-16 rounded-[var(--radius-lg)] flex items-center justify-center text-2xl font-bold ${colorClass}`}
          >
            {channel.icon || channel.name[0]}
          </div>

          {/* Channel Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {channel.name}
              </h1>
              <Button
                variant={channel.isSubscribed ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleSubscribeToggle}
                isLoading={isSubscribing}
                leftIcon={
                  channel.isSubscribed ? (
                    <BellOff className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )
                }
              >
                {channel.isSubscribed ? '구독 중' : '구독하기'}
              </Button>
            </div>

            <p className="text-[var(--text-secondary)] mb-4">
              {channel.description}
            </p>

            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                <Users className="w-4 h-4" />
                <span className="font-medium text-[var(--text-primary)]">
                  {formatNumber(channel.subscriberCount)}
                </span>
                명
              </span>
              <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                <FileText className="w-4 h-4" />
                <span className="font-medium text-[var(--text-primary)]">
                  {formatNumber(channel.postCount)}
                </span>
                개 게시글
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 mb-6 border-b border-[var(--border-default)]">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={`flex items-center gap-1.5 px-4 py-2 font-medium transition-colors ${
              sortBy === option.value
                ? 'text-[var(--color-primary-500)] border-b-2 border-[var(--color-primary-500)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {isPostsLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4"
            >
              <Skeleton className="h-4 w-32 mb-3" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-4" />
          <p className="text-[var(--text-secondary)]">아직 게시글이 없습니다</p>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            첫 번째 게시글을 작성해보세요!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-6">
              <Pagination meta={meta} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}
