'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/templates';
import { ChannelCard } from '@/components/molecules';
import { Button, Skeleton } from '@/components/atoms';
import { Hash, TrendingUp, Clock, ArrowUpDown } from 'lucide-react';
import { fetchChannels, toggleChannelSubscription } from '@/lib/api/channels';
import type { Channel } from '@/types';

type SortOption = 'popular' | 'latest' | 'name';

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  useEffect(() => {
    const loadChannels = async () => {
      setIsLoading(true);
      try {
        const data = await fetchChannels({ sortBy });
        setChannels(data);
      } catch (error) {
        console.error('채널 목록 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChannels();
  }, [sortBy]);

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

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'popular', label: '인기순', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'latest', label: '최신순', icon: <Clock className="w-4 h-4" /> },
    { value: 'name', label: '이름순', icon: <ArrowUpDown className="w-4 h-4" /> },
  ];

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="w-6 h-6 text-[var(--color-primary-500)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">채널</h1>
        </div>
        <p className="mt-1 text-[var(--text-secondary)]">
          관심 있는 채널을 구독하고 다양한 게시글을 확인하세요
        </p>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 mb-6">
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={sortBy === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSortBy(option.value)}
            leftIcon={option.icon}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Channel List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="w-12 h-12 rounded-[var(--radius-lg)]" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : channels.length === 0 ? (
        <div className="text-center py-12">
          <Hash className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-4" />
          <p className="text-[var(--text-secondary)]">채널이 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onSubscribeToggle={handleSubscribeToggle}
              isSubscribing={subscribingId === channel.id}
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
}
