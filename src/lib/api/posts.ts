/**
 * Posts API
 * 백엔드 API와 연동하는 게시글 관련 함수들
 */

import { apiClient } from './client';
import { shouldUseMock } from '../env';
import { getMockTrendingPosts, type MockTrendingPost } from '../mock/posts';
import type { Post, PostSummary, PaginatedResponse, ApiResponse, CreatePostInput } from '@/types';

export type TrendingPost = MockTrendingPost;

/**
 * 게시글 목록 조회 (페이지네이션)
 */
export async function fetchPosts(
  page: number = 1,
  limit: number = 10,
  channelSlug?: string
): Promise<PaginatedResponse<PostSummary>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (channelSlug) {
    params.append('channelSlug', channelSlug);
  }

  const response = await apiClient.get<PaginatedResponse<PostSummary>>(
    `/posts?${params.toString()}`,
    { skipAuth: true }
  );

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '게시글 목록을 불러오는데 실패했습니다.');
  }

  return response.data;
}

/**
 * 무한 스크롤용 게시글 목록 조회
 * 백엔드 /posts 엔드포인트의 cursor 기반 페이지네이션 사용
 */
export async function fetchPostsInfinite(
  cursor?: string,
  limit: number = 10,
  channelSlug?: string
): Promise<{
  data: PostSummary[];
  nextCursor: string | null;
}> {
  const params = new URLSearchParams({
    limit: String(limit),
  });

  if (cursor) {
    params.append('cursor', cursor);
  }

  if (channelSlug) {
    params.append('channelSlug', channelSlug);
  }

  // 백엔드는 /posts 엔드포인트에서 cursor 기반 페이지네이션 지원
  const response = await apiClient.get<{
    data: PostSummary[];
    meta: {
      hasNextPage: boolean;
      nextCursor?: string | null;
    };
  }>(`/posts?${params.toString()}`, { skipAuth: true });

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '게시글 목록을 불러오는데 실패했습니다.');
  }

  // 훅에서 기대하는 형식으로 변환
  return {
    data: response.data.data,
    nextCursor: response.data.meta.nextCursor ?? null,
  };
}

/**
 * 게시글 상세 조회
 */
export async function fetchPost(id: string): Promise<ApiResponse<Post>> {
  const response = await apiClient.get<Post>(`/posts/${id}`, { skipAuth: true });

  if (!response.success) {
    throw new Error(response.error?.message || '게시글을 찾을 수 없습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}

/**
 * 게시글 좋아요 토글
 */
export async function togglePostLike(
  id: string
): Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>> {
  const response = await apiClient.post<{ isLiked: boolean; likeCount: number }>(
    `/posts/${id}/like`
  );

  if (!response.success) {
    throw new Error(response.error?.message || '좋아요 처리에 실패했습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}

/**
 * 게시글 북마크 토글
 */
export async function togglePostBookmark(
  id: string
): Promise<ApiResponse<{ isBookmarked: boolean }>> {
  const response = await apiClient.post<{ isBookmarked: boolean }>(
    `/posts/${id}/bookmark`
  );

  if (!response.success) {
    throw new Error(response.error?.message || '북마크 처리에 실패했습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}

/**
 * 게시글 작성
 */
export async function createPost(
  data: CreatePostInput
): Promise<ApiResponse<Post>> {
  const response = await apiClient.post<Post>('/posts', data);

  if (!response.success) {
    throw new Error(response.error?.message || '게시글 작성에 실패했습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}

/**
 * 게시글 수정
 */
export async function updatePost(
  id: string,
  data: Partial<Pick<Post, 'title' | 'content' | 'tags'>>
): Promise<ApiResponse<Post>> {
  const response = await apiClient.patch<Post>(`/posts/${id}`, data);

  if (!response.success) {
    throw new Error(response.error?.message || '게시글 수정에 실패했습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}

/**
 * 게시글 삭제
 */
export async function deletePost(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<null>(`/posts/${id}`);

  if (!response.success) {
    throw new Error(response.error?.message || '게시글 삭제에 실패했습니다.');
  }

  return {
    success: true,
    data: null,
  };
}

/**
 * 트렌딩 게시글 조회
 * local 환경에서는 mock 데이터 사용, 그 외 환경에서는 실제 API 호출
 * @param period 기간 필터 (today, week, month, all)
 */
export async function getTrendingPosts(
  period: 'today' | 'week' | 'month' | 'all' = 'today'
): Promise<TrendingPost[]> {
  // Mock 모드 (local 환경)
  if (shouldUseMock()) {
    return getMockTrendingPosts(period);
  }

  // 실제 API 호출 (development, production 환경)
  const params = new URLSearchParams({
    period,
  });

  const response = await apiClient.get<TrendingPost[]>(
    `/posts/trending?${params.toString()}`,
    { skipAuth: true }
  );

  if (!response.success) {
    throw new Error(response.error?.message || '트렌딩 게시글을 불러오는데 실패했습니다.');
  }

  return response.data || [];
}
