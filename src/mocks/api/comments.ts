/**
 * Comments Mock API
 * 개발 환경에서 사용할 Mock API 함수들
 */

import type { Comment, ApiResponse } from '@/types';
import {
  createMockComment,
  createMockCommentThread,
} from '@/mocks/factories';

// Mock 데이터 저장소 (메모리) - postId별로 댓글 저장
const mockCommentsByPost: Map<string, Comment[]> = new Map();

// 딜레이 함수 (네트워크 지연 시뮬레이션)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 특정 게시글의 댓글 가져오기 (필요시 생성)
 */
function getCommentsForPost(postId: string): Comment[] {
  if (!mockCommentsByPost.has(postId)) {
    mockCommentsByPost.set(postId, createMockCommentThread(postId, 5, 3));
  }
  return mockCommentsByPost.get(postId)!;
}

/**
 * 게시글의 댓글 목록 조회
 */
export async function fetchComments(
  postId: string
): Promise<ApiResponse<Comment[]>> {
  await delay(400);

  const comments = getCommentsForPost(postId);

  // 최신순 정렬 (최상위 댓글 기준)
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    success: true,
    data: sortedComments,
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
  await delay(300);

  const comments = getCommentsForPost(postId);

  const newComment = createMockComment({
    postId,
    content,
    parentId: parentId ?? null,
    likeCount: 0,
    isLiked: false,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (parentId) {
    // 대댓글인 경우 부모 댓글의 replies에 추가
    const parentComment = findCommentById(comments, parentId);
    if (parentComment) {
      if (!parentComment.replies) {
        parentComment.replies = [];
      }
      parentComment.replies.push(newComment);
    }
  } else {
    // 최상위 댓글인 경우 목록에 추가
    comments.unshift(newComment);
  }

  return {
    success: true,
    data: newComment,
  };
}

/**
 * 댓글 수정
 */
export async function updateComment(
  commentId: string,
  content: string
): Promise<ApiResponse<Comment>> {
  await delay(300);

  // 모든 게시글의 댓글에서 해당 댓글 찾기
  for (const [postId, comments] of mockCommentsByPost.entries()) {
    const comment = findCommentById(comments, commentId);
    if (comment) {
      comment.content = content;
      comment.updatedAt = new Date();
      return {
        success: true,
        data: comment,
      };
    }
  }

  throw new Error('댓글을 찾을 수 없습니다.');
}

/**
 * 댓글 삭제 (소프트 삭제)
 */
export async function deleteComment(
  commentId: string
): Promise<ApiResponse<null>> {
  await delay(300);

  // 모든 게시글의 댓글에서 해당 댓글 찾기
  for (const [postId, comments] of mockCommentsByPost.entries()) {
    const comment = findCommentById(comments, commentId);
    if (comment) {
      comment.content = '삭제된 댓글입니다.';
      comment.isDeleted = true;
      return {
        success: true,
        data: null,
      };
    }
  }

  throw new Error('댓글을 찾을 수 없습니다.');
}

/**
 * 댓글 좋아요 토글
 */
export async function toggleCommentLike(
  commentId: string
): Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>> {
  await delay(200);

  // 모든 게시글의 댓글에서 해당 댓글 찾기
  for (const [postId, comments] of mockCommentsByPost.entries()) {
    const comment = findCommentById(comments, commentId);
    if (comment) {
      comment.isLiked = !comment.isLiked;
      comment.likeCount += comment.isLiked ? 1 : -1;

      return {
        success: true,
        data: {
          isLiked: comment.isLiked,
          likeCount: comment.likeCount,
        },
      };
    }
  }

  throw new Error('댓글을 찾을 수 없습니다.');
}

/**
 * 댓글 ID로 댓글 찾기 (재귀적으로 대댓글도 검색)
 */
function findCommentById(comments: Comment[], id: string): Comment | null {
  for (const comment of comments) {
    if (comment.id === id) {
      return comment;
    }
    if (comment.replies) {
      const found = findCommentById(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
}

// Mock 데이터 초기화 (테스트용)
export function resetMockComments() {
  mockCommentsByPost.clear();
}
