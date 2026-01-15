/**
 * Tags API
 * 태그 추천 관련 함수들
 */

import { apiClient } from './client';
import type { ApiResponse, TagSuggestion } from '@/types';

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
