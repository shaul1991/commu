/**
 * Users API
 * 백엔드 API와 연동하는 사용자 관련 함수들
 */

import { apiClient } from './client';
import type { User, PostSummary, ApiResponse, PaginatedResponse } from '@/types';

/**
 * 내 프로필 조회
 */
export async function getMyProfile(): Promise<ApiResponse<User>> {
  const response = await apiClient.get<User>('/users/me');

  if (!response.success) {
    throw new Error(response.error?.message || '프로필을 불러오는데 실패했습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}

/**
 * 내 프로필 수정
 */
export async function updateMyProfile(
  data: Partial<Pick<User, 'displayName' | 'bio' | 'profileImage'>>
): Promise<ApiResponse<User>> {
  const response = await apiClient.patch<User>('/users/me', data);

  if (!response.success) {
    throw new Error(response.error?.message || '프로필 수정에 실패했습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}

/**
 * 내가 좋아요한 게시글 목록
 */
export async function getMyLikes(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<PostSummary>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await apiClient.get<PaginatedResponse<PostSummary>>(
    `/users/me/likes?${params.toString()}`
  );

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '좋아요 목록을 불러오는데 실패했습니다.');
  }

  return response.data;
}

/**
 * 내가 북마크한 게시글 목록
 */
export async function getMyBookmarks(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<PostSummary>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await apiClient.get<PaginatedResponse<PostSummary>>(
    `/users/me/bookmarks?${params.toString()}`
  );

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '북마크 목록을 불러오는데 실패했습니다.');
  }

  return response.data;
}

/**
 * 특정 사용자 프로필 조회
 */
export async function getUserProfile(
  userId: string
): Promise<ApiResponse<User>> {
  const response = await apiClient.get<User>(
    `/users/${userId}`,
    { skipAuth: true }
  );

  if (!response.success) {
    throw new Error(response.error?.message || '사용자를 찾을 수 없습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}
