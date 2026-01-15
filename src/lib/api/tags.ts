/**
 * Tags API
 * 태그 추천 관련 함수들
 */

import { apiClient } from './client';
import { shouldUseMock } from '../env';
import { mockTrendingTags } from '../mock/channels';
import type { ApiResponse, TagSuggestion } from '@/types';

export interface TrendingTag {
  name: string;
  count: number;
}

/**
 * 태그 추천 조회
 * @param query 검색어 (최소 2글자)
 * @param limit 최대 개수 (기본 5)
 */
export async function suggestTags(
  query: string,
  limit: number = 5
): Promise<ApiResponse<{ tags: TagSuggestion[] }>> {
  if (query.length < 2) {
    return {
      success: true,
      data: { tags: [] },
    };
  }

  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
  });

  const response = await apiClient.get<{ tags: TagSuggestion[] }>(
    `/tags/suggest?${params.toString()}`,
    { skipAuth: true }
  );

  if (!response.success) {
    throw new Error(response.error?.message || '태그 추천을 불러오는데 실패했습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}

/**
 * 인기 태그 조회
 * @param limit 최대 개수 (기본 10)
 */
export async function getPopularTags(
  limit: number = 10
): Promise<ApiResponse<{ tags: TagSuggestion[] }>> {
  const params = new URLSearchParams({
    limit: String(limit),
  });

  const response = await apiClient.get<{ tags: TagSuggestion[] }>(
    `/tags/popular?${params.toString()}`,
    { skipAuth: true }
  );

  if (!response.success) {
    throw new Error(response.error?.message || '인기 태그를 불러오는데 실패했습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}

/**
 * 트렌딩 태그 조회
 * local 환경에서는 mock 데이터 사용, 그 외 환경에서는 실제 API 호출
 * @param limit 최대 개수 (기본 10)
 */
export async function getTrendingTags(limit: number = 10): Promise<TrendingTag[]> {
  // Mock 모드 (local 환경)
  if (shouldUseMock()) {
    return mockTrendingTags.slice(0, limit);
  }

  // 실제 API 호출 (development, production 환경)
  const params = new URLSearchParams({
    limit: String(limit),
  });

  const response = await apiClient.get<{ tags: TrendingTag[] }>(
    `/tags/popular?${params.toString()}`,
    { skipAuth: true }
  );

  if (!response.success) {
    throw new Error(response.error?.message || '트렌딩 태그를 불러오는데 실패했습니다.');
  }

  return response.data?.tags || [];
}
