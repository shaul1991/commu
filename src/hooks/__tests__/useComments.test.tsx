/**
 * useComments 훅 테스트
 * TDD: 댓글 관련 React Query 훅 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useToggleCommentLike,
} from '../useComments';
import * as commentsApi from '@/lib/api/comments';
import type { Comment, ApiResponse } from '@/types';

// Mock the comments API
vi.mock('@/lib/api/comments');

// Mock toast
vi.mock('@/stores/uiStore', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockCommentsApi = vi.mocked(commentsApi);

describe('useComments Hooks', () => {
  let queryClient: QueryClient;

  const mockAuthor = {
    id: 'user-1',
    displayName: '테스트유저',
    profileImage: undefined,
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
    replies: undefined,
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    });
  });

  describe('useComments', () => {
    it('댓글 목록을 성공적으로 조회해야 함', async () => {
      const mockComments = [mockComment, { ...mockComment, id: 'comment-3', replies: [mockReply] }];
      mockCommentsApi.fetchComments.mockResolvedValue({
        success: true,
        data: mockComments,
      });

      const { result } = renderHook(() => useComments('post-1'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockComments);
      expect(mockCommentsApi.fetchComments).toHaveBeenCalledWith('post-1');
    });

    it('postId가 없으면 쿼리를 실행하지 않아야 함', async () => {
      const { result } = renderHook(() => useComments(''), { wrapper });

      await waitFor(() => expect(result.current.isFetching).toBe(false));

      expect(mockCommentsApi.fetchComments).not.toHaveBeenCalled();
    });

    it('에러 발생 시 error 상태여야 함', async () => {
      mockCommentsApi.fetchComments.mockRejectedValue(new Error('서버 오류'));

      const { result } = renderHook(() => useComments('post-1'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('useCreateComment', () => {
    it('댓글을 성공적으로 작성해야 함', async () => {
      mockCommentsApi.createComment.mockResolvedValue({
        success: true,
        data: mockComment,
      });

      const { result } = renderHook(() => useCreateComment(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          postId: 'post-1',
          content: '테스트 댓글입니다.',
        });
      });

      expect(mockCommentsApi.createComment).toHaveBeenCalledWith(
        'post-1',
        '테스트 댓글입니다.',
        undefined
      );
    });

    it('대댓글을 성공적으로 작성해야 함', async () => {
      mockCommentsApi.createComment.mockResolvedValue({
        success: true,
        data: mockReply,
      });

      const { result } = renderHook(() => useCreateComment(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          postId: 'post-1',
          content: '대댓글입니다.',
          parentId: 'comment-1',
        });
      });

      expect(mockCommentsApi.createComment).toHaveBeenCalledWith(
        'post-1',
        '대댓글입니다.',
        'comment-1'
      );
    });

    it('에러 발생 시 에러 토스트를 표시해야 함', async () => {
      const { toast } = await import('@/stores/uiStore');
      mockCommentsApi.createComment.mockRejectedValue(new Error('작성 실패'));

      const { result } = renderHook(() => useCreateComment(), { wrapper });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            postId: 'post-1',
            content: '테스트',
          });
        } catch {
          // expected error
        }
      });

      expect(toast.error).toHaveBeenCalledWith('댓글 작성 중 오류가 발생했습니다.');
    });
  });

  describe('useUpdateComment', () => {
    it('댓글을 성공적으로 수정해야 함', async () => {
      const updatedComment = { ...mockComment, content: '수정된 댓글' };
      mockCommentsApi.updateComment.mockResolvedValue({
        success: true,
        data: updatedComment,
      });

      const { result } = renderHook(() => useUpdateComment(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          commentId: 'comment-1',
          content: '수정된 댓글',
          postId: 'post-1',
        });
      });

      expect(mockCommentsApi.updateComment).toHaveBeenCalledWith(
        'comment-1',
        '수정된 댓글'
      );
    });

    it('에러 발생 시 에러 토스트를 표시해야 함', async () => {
      const { toast } = await import('@/stores/uiStore');
      mockCommentsApi.updateComment.mockRejectedValue(new Error('수정 실패'));

      const { result } = renderHook(() => useUpdateComment(), { wrapper });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            commentId: 'comment-1',
            content: '수정',
            postId: 'post-1',
          });
        } catch {
          // expected error
        }
      });

      expect(toast.error).toHaveBeenCalledWith('댓글 수정 중 오류가 발생했습니다.');
    });
  });

  describe('useDeleteComment', () => {
    it('댓글을 성공적으로 삭제해야 함', async () => {
      mockCommentsApi.deleteComment.mockResolvedValue({
        success: true,
        data: null,
      });

      const { result } = renderHook(() => useDeleteComment(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          commentId: 'comment-1',
          postId: 'post-1',
        });
      });

      expect(mockCommentsApi.deleteComment).toHaveBeenCalledWith('comment-1');
    });

    it('에러 발생 시 에러 토스트를 표시해야 함', async () => {
      const { toast } = await import('@/stores/uiStore');
      mockCommentsApi.deleteComment.mockRejectedValue(new Error('삭제 실패'));

      const { result } = renderHook(() => useDeleteComment(), { wrapper });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            commentId: 'comment-1',
            postId: 'post-1',
          });
        } catch {
          // expected error
        }
      });

      expect(toast.error).toHaveBeenCalledWith('댓글 삭제 중 오류가 발생했습니다.');
    });
  });

  describe('useToggleCommentLike', () => {
    it('좋아요를 토글해야 함', async () => {
      mockCommentsApi.toggleCommentLike.mockResolvedValue({
        success: true,
        data: { isLiked: true, likeCount: 6 },
      });

      const { result } = renderHook(() => useToggleCommentLike(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          commentId: 'comment-1',
          postId: 'post-1',
        });
      });

      expect(mockCommentsApi.toggleCommentLike).toHaveBeenCalledWith('comment-1');
    });

    it('좋아요 취소도 정상 동작해야 함', async () => {
      mockCommentsApi.toggleCommentLike.mockResolvedValue({
        success: true,
        data: { isLiked: false, likeCount: 4 },
      });

      const { result } = renderHook(() => useToggleCommentLike(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          commentId: 'comment-1',
          postId: 'post-1',
        });
      });

      expect(mockCommentsApi.toggleCommentLike).toHaveBeenCalledWith('comment-1');
    });

    it('에러 발생 시 에러 토스트를 표시해야 함', async () => {
      const { toast } = await import('@/stores/uiStore');

      mockCommentsApi.toggleCommentLike.mockRejectedValue(new Error('네트워크 오류'));

      const { result } = renderHook(() => useToggleCommentLike(), { wrapper });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            commentId: 'comment-1',
            postId: 'post-1',
          });
        } catch {
          // expected error
        }
      });

      expect(toast.error).toHaveBeenCalledWith('좋아요 처리 중 오류가 발생했습니다.');
    });

    it('대댓글의 좋아요도 토글 요청이 가능해야 함', async () => {
      mockCommentsApi.toggleCommentLike.mockResolvedValue({
        success: true,
        data: { isLiked: true, likeCount: 3 },
      });

      const { result } = renderHook(() => useToggleCommentLike(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          commentId: 'comment-2', // 대댓글 ID
          postId: 'post-1',
        });
      });

      expect(mockCommentsApi.toggleCommentLike).toHaveBeenCalledWith('comment-2');
    });
  });
});
