/**
 * Search API
 * 백엔드 API와 연동하는 검색 관련 함수들
 */

import { apiClient } from './client';
import type { PostSummary, User, ApiResponse } from '@/types';

export interface SearchResult {
  posts: PostSummary[];
  users: Pick<User, 'id' | 'displayName' | 'username' | 'profileImage' | 'bio'>[];
  tags: { name: string; count: number }[];
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'user' | 'tag';
}

export interface TrendingSearch {
  keyword: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * 통합 검색
 */
export async function search(
  query: string,
  type?: 'all' | 'posts' | 'users' | 'tags'
): Promise<ApiResponse<SearchResult>> {
  const params = new URLSearchParams({ q: query });
  if (type && type !== 'all') {
    params.append('type', type);
  }

  const response = await apiClient.get<SearchResult>(
    `/search?${params.toString()}`,
    { skipAuth: true }
  );

  if (!response.success) {
    throw new Error(response.error?.message || '검색에 실패했습니다.');
  }

  return {
    success: true,
    data: response.data || { posts: [], users: [], tags: [] },
  };
}

/**
 * 검색어 자동완성
 */
export async function searchSuggest(
  query: string
): Promise<ApiResponse<SearchSuggestion[]>> {
  const response = await apiClient.get<SearchSuggestion[]>(
    `/search/suggest?q=${encodeURIComponent(query)}`,
    { skipAuth: true }
  );

  if (!response.success) {
    throw new Error(response.error?.message || '자동완성을 불러오는데 실패했습니다.');
  }

  return {
    success: true,
    data: response.data || [],
  };
}

/**
 * 인기 검색어 조회
 */
export async function getTrendingSearches(): Promise<ApiResponse<TrendingSearch[]>> {
  const response = await apiClient.get<TrendingSearch[]>(
    '/search/trending',
    { skipAuth: true }
  );

  if (!response.success) {
    throw new Error(response.error?.message || '인기 검색어를 불러오는데 실패했습니다.');
  }

  return {
    success: true,
    data: response.data || [],
  };
}
