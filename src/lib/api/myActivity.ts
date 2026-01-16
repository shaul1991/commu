/**
 * MyActivity API
 * 마이페이지 내 활동 관련 API 함수들
 */

import { apiClient } from './client';
import type {
  MyPost,
  MyComment,
  LikedPost,
  BookmarkedPost,
  CursorPaginatedResponse,
  PostSortOption,
  CommentSortOption,
} from '@/types/myActivity';

// ============================================
// 내 게시글 API
// ============================================

export interface FetchMyPostsParams {
  page?: number;
  limit?: number;
  cursor?: string;
  sort?: PostSortOption;
}

/**
 * 내 게시글 목록 조회 (페이지네이션)
 */
export async function fetchMyPosts(
  params: FetchMyPostsParams = {}
): Promise<CursorPaginatedResponse<MyPost>> {
  const { page = 1, limit = 10, cursor, sort = 'latest' } = params;

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (cursor) {
    searchParams.append('cursor', cursor);
  }

  const response = await apiClient.get<CursorPaginatedResponse<MyPost>>(
    `/users/me/posts?${searchParams.toString()}`
  );

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '내 게시글 목록을 불러오는데 실패했습니다.');
  }

  return response.data;
}

/**
 * 내 게시글 무한 스크롤용 조회
 */
export async function fetchMyPostsInfinite(
  cursor?: string,
  limit: number = 10,
  sort: PostSortOption = 'latest'
): Promise<{
  data: MyPost[];
  nextCursor: string | null;
}> {
  const response = await fetchMyPosts({ cursor, limit, sort });

  return {
    data: response.data,
    nextCursor: response.meta.nextCursor,
  };
}

// ============================================
// 내 댓글 API
// ============================================

export interface FetchMyCommentsParams {
  page?: number;
  limit?: number;
  cursor?: string;
  sort?: CommentSortOption;
}

/**
 * 내 댓글 목록 조회 (페이지네이션)
 */
export async function fetchMyComments(
  params: FetchMyCommentsParams = {}
): Promise<CursorPaginatedResponse<MyComment>> {
  const { page = 1, limit = 10, cursor, sort = 'latest' } = params;

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (cursor) {
    searchParams.append('cursor', cursor);
  }

  const response = await apiClient.get<CursorPaginatedResponse<MyComment>>(
    `/users/me/comments?${searchParams.toString()}`
  );

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '내 댓글 목록을 불러오는데 실패했습니다.');
  }

  return response.data;
}

/**
 * 내 댓글 무한 스크롤용 조회
 */
export async function fetchMyCommentsInfinite(
  cursor?: string,
  limit: number = 10,
  sort: CommentSortOption = 'latest'
): Promise<{
  data: MyComment[];
  nextCursor: string | null;
}> {
  const response = await fetchMyComments({ cursor, limit, sort });

  return {
    data: response.data,
    nextCursor: response.meta.nextCursor,
  };
}

// ============================================
// 좋아요한 글 API
// ============================================

export interface FetchLikedPostsParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

/**
 * 좋아요한 글 목록 조회 (페이지네이션)
 */
export async function fetchLikedPosts(
  params: FetchLikedPostsParams = {}
): Promise<CursorPaginatedResponse<LikedPost>> {
  const { page = 1, limit = 10, cursor } = params;

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (cursor) {
    searchParams.append('cursor', cursor);
  }

  const response = await apiClient.get<CursorPaginatedResponse<LikedPost>>(
    `/users/me/likes?${searchParams.toString()}`
  );

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '좋아요한 글 목록을 불러오는데 실패했습니다.');
  }

  return response.data;
}

/**
 * 좋아요한 글 무한 스크롤용 조회
 */
export async function fetchLikedPostsInfinite(
  cursor?: string,
  limit: number = 10
): Promise<{
  data: LikedPost[];
  nextCursor: string | null;
}> {
  const response = await fetchLikedPosts({ cursor, limit });

  return {
    data: response.data,
    nextCursor: response.meta.nextCursor,
  };
}

// ============================================
// 북마크한 글 API
// ============================================

export interface FetchBookmarkedPostsParams {
  page?: number;
  limit?: number;
  cursor?: string;
  folder?: string;
}

/**
 * 북마크한 글 목록 조회 (페이지네이션)
 */
export async function fetchBookmarkedPosts(
  params: FetchBookmarkedPostsParams = {}
): Promise<CursorPaginatedResponse<BookmarkedPost>> {
  const { page = 1, limit = 10, cursor, folder } = params;

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (cursor) {
    searchParams.append('cursor', cursor);
  }

  if (folder) {
    searchParams.append('folder', folder);
  }

  const response = await apiClient.get<CursorPaginatedResponse<BookmarkedPost>>(
    `/users/me/bookmarks?${searchParams.toString()}`
  );

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '북마크한 글 목록을 불러오는데 실패했습니다.');
  }

  return response.data;
}

/**
 * 북마크한 글 무한 스크롤용 조회
 */
export async function fetchBookmarkedPostsInfinite(
  cursor?: string,
  limit: number = 10,
  folder?: string
): Promise<{
  data: BookmarkedPost[];
  nextCursor: string | null;
}> {
  const response = await fetchBookmarkedPosts({ cursor, limit, folder });

  return {
    data: response.data,
    nextCursor: response.meta.nextCursor,
  };
}
