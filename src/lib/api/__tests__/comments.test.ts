/**
 * Comments API 테스트
 * TDD: 댓글 관련 API 함수 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock client module
vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} from '../comments';
import { apiClient } from '../client';
import type { Comment } from '@/types';

describe('Comments API', () => {
  const mockAuthor = {
    id: 'user-1',
    displayName: '테스트유저',
    profileImage: null,
  };

  const mockComment: Comment = {
    id: 'comment-1',
    postId: 'post-1',
    content: '테스트 댓글입니다.',
    author: mockAuthor,
    parentId: null,
    likeCount: 5,
    isLiked: false,
    isDeleted: false,
    replies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockReply: Comment = {
    ...mockComment,
    id: 'comment-2',
    parentId: 'comment-1',
    content: '대댓글입니다.',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchComments', () => {
    it('댓글 목록을 성공적으로 조회해야 함', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        success: true,
        data: [mockComment, { ...mockComment, replies: [mockReply] }],
      });

      const result = await fetchComments('post-1');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/posts/post-1/comments',
        { skipAuth: true }
      );
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('빈 댓글 목록을 반환해야 함', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        success: true,
        data: [],
      });

      const result = await fetchComments('post-1');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });

    it('API 실패 시 에러를 throw해야 함', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        success: false,
        error: { message: '서버 오류' },
      });

      await expect(fetchComments('post-1')).rejects.toThrow('서버 오류');
    });

    it('에러 메시지가 없을 때 기본 메시지를 사용해야 함', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        success: false,
        error: null,
      });

      await expect(fetchComments('post-1')).rejects.toThrow(
        '댓글 목록을 불러오는데 실패했습니다.'
      );
    });
  });

  describe('createComment', () => {
    it('새 댓글을 성공적으로 작성해야 함', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        success: true,
        data: mockComment,
      });

      const result = await createComment('post-1', '테스트 댓글입니다.');

      expect(apiClient.post).toHaveBeenCalledWith('/posts/post-1/comments', {
        content: '테스트 댓글입니다.',
        parentId: null,
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockComment);
    });

    it('대댓글을 성공적으로 작성해야 함', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        success: true,
        data: mockReply,
      });

      const result = await createComment('post-1', '대댓글입니다.', 'comment-1');

      expect(apiClient.post).toHaveBeenCalledWith('/posts/post-1/comments', {
        content: '대댓글입니다.',
        parentId: 'comment-1',
      });
      expect(result.success).toBe(true);
      expect(result.data?.parentId).toBe('comment-1');
    });

    it('parentId가 null인 경우도 처리해야 함', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        success: true,
        data: mockComment,
      });

      await createComment('post-1', '테스트', null);

      expect(apiClient.post).toHaveBeenCalledWith('/posts/post-1/comments', {
        content: '테스트',
        parentId: null,
      });
    });

    it('API 실패 시 에러를 throw해야 함', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        success: false,
        error: { message: '댓글 작성 권한이 없습니다.' },
      });

      await expect(
        createComment('post-1', '테스트')
      ).rejects.toThrow('댓글 작성 권한이 없습니다.');
    });

    it('에러 메시지가 없을 때 기본 메시지를 사용해야 함', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        success: false,
        error: null,
      });

      await expect(createComment('post-1', '테스트')).rejects.toThrow(
        '댓글 작성에 실패했습니다.'
      );
    });
  });

  describe('updateComment', () => {
    it('댓글을 성공적으로 수정해야 함', async () => {
      const updatedComment = { ...mockComment, content: '수정된 댓글입니다.' };
      vi.mocked(apiClient.patch).mockResolvedValue({
        success: true,
        data: updatedComment,
      });

      const result = await updateComment('comment-1', '수정된 댓글입니다.');

      expect(apiClient.patch).toHaveBeenCalledWith('/comments/comment-1', {
        content: '수정된 댓글입니다.',
      });
      expect(result.success).toBe(true);
      expect(result.data?.content).toBe('수정된 댓글입니다.');
    });

    it('API 실패 시 에러를 throw해야 함', async () => {
      vi.mocked(apiClient.patch).mockResolvedValue({
        success: false,
        error: { message: '수정 권한이 없습니다.' },
      });

      await expect(
        updateComment('comment-1', '수정')
      ).rejects.toThrow('수정 권한이 없습니다.');
    });

    it('에러 메시지가 없을 때 기본 메시지를 사용해야 함', async () => {
      vi.mocked(apiClient.patch).mockResolvedValue({
        success: false,
        error: null,
      });

      await expect(updateComment('comment-1', '수정')).rejects.toThrow(
        '댓글 수정에 실패했습니다.'
      );
    });
  });

  describe('deleteComment', () => {
    it('댓글을 성공적으로 삭제해야 함', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({
        success: true,
        data: null,
      });

      const result = await deleteComment('comment-1');

      expect(apiClient.delete).toHaveBeenCalledWith('/comments/comment-1');
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });

    it('API 실패 시 에러를 throw해야 함', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({
        success: false,
        error: { message: '삭제 권한이 없습니다.' },
      });

      await expect(deleteComment('comment-1')).rejects.toThrow(
        '삭제 권한이 없습니다.'
      );
    });

    it('에러 메시지가 없을 때 기본 메시지를 사용해야 함', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({
        success: false,
        error: null,
      });

      await expect(deleteComment('comment-1')).rejects.toThrow(
        '댓글 삭제에 실패했습니다.'
      );
    });
  });

  describe('toggleCommentLike', () => {
    it('좋아요를 성공적으로 추가해야 함', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        success: true,
        data: { isLiked: true, likeCount: 6 },
      });

      const result = await toggleCommentLike('comment-1');

      expect(apiClient.post).toHaveBeenCalledWith('/comments/comment-1/like');
      expect(result.success).toBe(true);
      expect(result.data?.isLiked).toBe(true);
      expect(result.data?.likeCount).toBe(6);
    });

    it('좋아요를 성공적으로 취소해야 함', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        success: true,
        data: { isLiked: false, likeCount: 4 },
      });

      const result = await toggleCommentLike('comment-1');

      expect(result.success).toBe(true);
      expect(result.data?.isLiked).toBe(false);
      expect(result.data?.likeCount).toBe(4);
    });

    it('API 실패 시 에러를 throw해야 함', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        success: false,
        error: { message: '로그인이 필요합니다.' },
      });

      await expect(toggleCommentLike('comment-1')).rejects.toThrow(
        '로그인이 필요합니다.'
      );
    });

    it('에러 메시지가 없을 때 기본 메시지를 사용해야 함', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        success: false,
        error: null,
      });

      await expect(toggleCommentLike('comment-1')).rejects.toThrow(
        '좋아요 처리에 실패했습니다.'
      );
    });
  });
});
