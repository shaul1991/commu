/**
 * Channels API
 * 백엔드 API와 연동하는 채널 관련 함수들
 */

import { apiClient } from './client';
import { shouldUseMock } from '../env';
import {
  getMockChannels,
  getMockChannel,
  getMockChannelPosts,
  toggleMockChannelSubscription,
} from '../mock/channels';
import type { Channel, PostSummary, PaginatedResponse } from '@/types';

export interface FetchChannelsOptions {
  sortBy?: 'popular' | 'latest' | 'name';
  limit?: number;
  page?: number;
}

/**
 * 채널 목록 조회
 */
export async function fetchChannels(
  options?: FetchChannelsOptions
): Promise<Channel[]> {
  // Mock 모드
  if (shouldUseMock()) {
    return getMockChannels(options);
  }

  // 실제 API 호출
  const params = new URLSearchParams();
  if (options?.sortBy) params.append('sortBy', options.sortBy);
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.page) params.append('page', String(options.page));

  const query = params.toString();
  const endpoint = query ? `/channels?${query}` : '/channels';

  const response = await apiClient.get<Channel[]>(endpoint, { skipAuth: true });

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '채널 목록을 불러오는데 실패했습니다.');
  }

  return response.data;
}

/**
 * 인기 채널 목록 조회
 */
export async function fetchPopularChannels(limit: number = 6): Promise<Channel[]> {
  return fetchChannels({ sortBy: 'popular', limit });
}

/**
 * 채널 상세 조회
 */
export async function fetchChannel(slug: string): Promise<Channel> {
  // Mock 모드
  if (shouldUseMock()) {
    const channel = getMockChannel(slug);
    if (!channel) {
      throw new Error('채널을 찾을 수 없습니다.');
    }
    return channel;
  }

  // 실제 API 호출
  const response = await apiClient.get<Channel>(`/channels/${slug}`, { skipAuth: true });

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '채널을 찾을 수 없습니다.');
  }

  return response.data;
}

/**
 * 채널 게시글 목록 조회
 */
export async function fetchChannelPosts(
  slug: string,
  page: number = 1,
  limit: number = 10,
  sortBy: 'popular' | 'latest' | 'comments' = 'latest'
): Promise<PaginatedResponse<PostSummary>> {
  // Mock 모드
  if (shouldUseMock()) {
    return getMockChannelPosts(slug, page, limit);
  }

  // 실제 API 호출
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
  });

  const response = await apiClient.get<PaginatedResponse<PostSummary>>(
    `/channels/${slug}/posts?${params.toString()}`,
    { skipAuth: true }
  );

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '게시글을 불러오는데 실패했습니다.');
  }

  return response.data;
}

/**
 * 채널 구독 토글
 */
export async function toggleChannelSubscription(slug: string): Promise<Channel> {
  // Mock 모드
  if (shouldUseMock()) {
    const channel = toggleMockChannelSubscription(slug);
    if (!channel) {
      throw new Error('채널을 찾을 수 없습니다.');
    }
    return channel;
  }

  // 실제 API 호출
  const response = await apiClient.post<Channel>(`/channels/${slug}/subscribe`);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '구독 상태 변경에 실패했습니다.');
  }

  return response.data;
}
