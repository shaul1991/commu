'use client';

/**
 * MyActivity Hooks
 * 마이페이지 내 활동 관련 React Query 훅들
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import {
  fetchMyPosts,
  fetchMyPostsInfinite,
  fetchMyComments,
  fetchMyCommentsInfinite,
  fetchLikedPosts,
  fetchLikedPostsInfinite,
  fetchBookmarkedPosts,
  fetchBookmarkedPostsInfinite,
} from '@/lib/api/myActivity';
import type { PostSortOption, CommentSortOption } from '@/types/myActivity';

// ============================================
// 내 게시글 훅
// ============================================

interface UseMyPostsOptions {
  page?: number;
  limit?: number;
  sort?: PostSortOption;
  enabled?: boolean;
}

/**
 * 내 게시글 목록 조회 (페이지네이션)
 */
export function useMyPosts(options: UseMyPostsOptions = {}) {
  const { page = 1, limit = 10, sort = 'latest', enabled = true } = options;

  return useQuery({
    queryKey: queryKeys.myActivity.posts.list({ page, limit, sort }),
    queryFn: () => fetchMyPosts({ page, limit, sort }),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 내 게시글 목록 조회 (무한 스크롤)
 */
export function useMyPostsInfinite(
  limit: number = 10,
  sort: PostSortOption = 'latest',
  enabled: boolean = true
) {
  return useInfiniteQuery({
    queryKey: queryKeys.myActivity.posts.infinite({ limit, sort }),
    queryFn: ({ pageParam }) =>
      fetchMyPostsInfinite(pageParam as string | undefined, limit, sort),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  });
}

// ============================================
// 내 댓글 훅
// ============================================

interface UseMyCommentsOptions {
  page?: number;
  limit?: number;
  sort?: CommentSortOption;
  enabled?: boolean;
}

/**
 * 내 댓글 목록 조회 (페이지네이션)
 */
export function useMyComments(options: UseMyCommentsOptions = {}) {
  const { page = 1, limit = 10, sort = 'latest', enabled = true } = options;

  return useQuery({
    queryKey: queryKeys.myActivity.comments.list({ page, limit, sort }),
    queryFn: () => fetchMyComments({ page, limit, sort }),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 내 댓글 목록 조회 (무한 스크롤)
 */
export function useMyCommentsInfinite(
  limit: number = 10,
  sort: CommentSortOption = 'latest',
  enabled: boolean = true
) {
  return useInfiniteQuery({
    queryKey: queryKeys.myActivity.comments.infinite({ limit, sort }),
    queryFn: ({ pageParam }) =>
      fetchMyCommentsInfinite(pageParam as string | undefined, limit, sort),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  });
}

// ============================================
// 좋아요한 글 훅
// ============================================

interface UseLikedPostsOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * 좋아요한 글 목록 조회 (페이지네이션)
 */
export function useLikedPosts(options: UseLikedPostsOptions = {}) {
  const { page = 1, limit = 10, enabled = true } = options;

  return useQuery({
    queryKey: queryKeys.myActivity.likes.list({ page, limit }),
    queryFn: () => fetchLikedPosts({ page, limit }),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 좋아요한 글 목록 조회 (무한 스크롤)
 */
export function useLikedPostsInfinite(limit: number = 10, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: queryKeys.myActivity.likes.infinite({ limit }),
    queryFn: ({ pageParam }) =>
      fetchLikedPostsInfinite(pageParam as string | undefined, limit),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  });
}

// ============================================
// 북마크한 글 훅
// ============================================

interface UseBookmarkedPostsOptions {
  page?: number;
  limit?: number;
  folder?: string;
  enabled?: boolean;
}

/**
 * 북마크한 글 목록 조회 (페이지네이션)
 */
export function useBookmarkedPosts(options: UseBookmarkedPostsOptions = {}) {
  const { page = 1, limit = 10, folder, enabled = true } = options;

  return useQuery({
    queryKey: queryKeys.myActivity.bookmarks.list({ page, limit, folder }),
    queryFn: () => fetchBookmarkedPosts({ page, limit, folder }),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 북마크한 글 목록 조회 (무한 스크롤)
 */
export function useBookmarkedPostsInfinite(
  limit: number = 10,
  folder?: string,
  enabled: boolean = true
) {
  return useInfiniteQuery({
    queryKey: queryKeys.myActivity.bookmarks.infinite({ limit, folder }),
    queryFn: ({ pageParam }) =>
      fetchBookmarkedPostsInfinite(pageParam as string | undefined, limit, folder),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  });
}
