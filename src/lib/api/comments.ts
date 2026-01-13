/**
 * Comments API
 * 백엔드 API와 연동하는 댓글 관련 함수들
 */

import { apiClient } from './client';
import type { Comment, ApiResponse } from '@/types';

/**
 * 게시글의 댓글 목록 조회
 */
export async function fetchComments(
  postId: string
): Promise<ApiResponse<Comment[]>> {
  const response = await apiClient.get<Comment[]>(
    `/posts/${postId}/comments`,
    { skipAuth: true }
  );

  if (!response.success) {
    throw new Error(response.error?.message || '댓글 목록을 불러오는데 실패했습니다.');
  }

  return {
    success: true,
    data: response.data || [],
  };
}

/**
 * 댓글 작성
 */
export async function createComment(
  postId: string,
  content: string,
  parentId?: string | null
): Promise<ApiResponse<Comment>> {
  const response = await apiClient.post<Comment>(`/posts/${postId}/comments`, {
    content,
    parentId: parentId ?? null,
  });

  if (!response.success) {
    throw new Error(response.error?.message || '댓글 작성에 실패했습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}

/**
 * 댓글 수정
 */
export async function updateComment(
  commentId: string,
  content: string
): Promise<ApiResponse<Comment>> {
  const response = await apiClient.patch<Comment>(`/comments/${commentId}`, {
    content,
  });

  if (!response.success) {
    throw new Error(response.error?.message || '댓글 수정에 실패했습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}

/**
 * 댓글 삭제
 */
export async function deleteComment(
  commentId: string
): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<null>(`/comments/${commentId}`);

  if (!response.success) {
    throw new Error(response.error?.message || '댓글 삭제에 실패했습니다.');
  }

  return {
    success: true,
    data: null,
  };
}

/**
 * 댓글 좋아요 토글
 */
export async function toggleCommentLike(
  commentId: string
): Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>> {
  const response = await apiClient.post<{ isLiked: boolean; likeCount: number }>(
    `/comments/${commentId}/like`
  );

  if (!response.success) {
    throw new Error(response.error?.message || '좋아요 처리에 실패했습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}
