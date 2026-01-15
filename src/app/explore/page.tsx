'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/templates';
import { ChannelCard, UserCard } from '@/components/molecules';
import { Skeleton } from '@/components/atoms';
import { Compass, Search, Users, Hash, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchPopularChannels, toggleChannelSubscription } from '@/lib/api/channels';
import { getRecommendedUsers, toggleUserFollow, type RecommendedUser } from '@/lib/api/users';
import { getTrendingTags, type TrendingTag } from '@/lib/api/tags';
import type { Channel } from '@/types';

export default function ExplorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [users, setUsers] = useState<RecommendedUser[]>([]);
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([]);
  const [isChannelsLoading, setIsChannelsLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [isTagsLoading, setIsTagsLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [followingId, setFollowingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // 채널 로드
      setIsChannelsLoading(true);
      try {
        const channelData = await fetchPopularChannels(6);
        setChannels(channelData);
      } catch (error) {
        console.error('채널 로드 실패:', error);
      } finally {
        setIsChannelsLoading(false);
      }

      // 사용자 로드
      setIsUsersLoading(true);
      try {
        const userData = await getRecommendedUsers(3);
        setUsers(userData);
      } catch (error) {
        console.error('사용자 로드 실패:', error);
      } finally {
        setIsUsersLoading(false);
      }

      // 트렌딩 태그 로드
      setIsTagsLoading(true);
      try {
        const tagsData = await getTrendingTags(8);
        setTrendingTags(tagsData);
      } catch (error) {
        console.error('트렌딩 태그 로드 실패:', error);
      } finally {
        setIsTagsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSubscribeToggle = async (channel: Channel) => {
    setSubscribingId(channel.id);
    try {
      const updated = await toggleChannelSubscription(channel.slug);
      setChannels((prev) =>
        prev.map((c) => (c.id === channel.id ? updated : c))
      );
    } catch (error) {
      console.error('구독 상태 변경 실패:', error);
    } finally {
      setSubscribingId(null);
    }
  };

  const handleFollowToggle = async (user: RecommendedUser) => {
    setFollowingId(user.id);
    try {
      const updated = await toggleUserFollow(user.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? updated : u))
      );
    } catch (error) {
      console.error('팔로우 상태 변경 실패:', error);
    } finally {
      setFollowingId(null);
    }
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-6 h-6 text-[var(--color-primary-500)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">탐색</h1>
        </div>
        <p className="mt-1 text-[var(--text-secondary)]">
          관심사에 맞는 채널과 사용자를 찾아보세요
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="채널, 태그, 사용자 검색..."
          className="w-full pl-12 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
        />
      </form>

      {/* Popular Channels Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Hash className="w-5 h-5" />
            인기 채널
          </h2>
          <Link href="/channels" className="text-sm text-[var(--color-primary-500)] hover:underline">
            전체 보기
          </Link>
        </div>
        {isChannelsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-[var(--radius-md)]" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                variant="compact"
                onSubscribeToggle={handleSubscribeToggle}
                isSubscribing={subscribingId === channel.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trending Tags Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            트렌딩 태그
          </h2>
        </div>
        {isTagsLoading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="w-20 h-8 rounded-full" />
            ))}
          </div>
        ) : trendingTags.length === 0 ? (
          <div className="text-sm text-[var(--text-tertiary)]">
            트렌딩 태그가 없습니다.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <Link
                key={tag.name}
                href={`/search?q=${encodeURIComponent(tag.name)}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-full text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong)] transition-colors"
              >
                <span>#</span>
                <span>{tag.name}</span>
                <span className="text-[var(--text-tertiary)]">({tag.count})</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recommended Users Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Users className="w-5 h-5" />
            추천 사용자
          </h2>
          <Link href="/recommend-users" className="text-sm text-[var(--color-primary-500)] hover:underline">
            전체 보기
          </Link>
        </div>
        {isUsersLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollowToggle={handleFollowToggle}
                isFollowing={followingId === user.id}
              />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}
