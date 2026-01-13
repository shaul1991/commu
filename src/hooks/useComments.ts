'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} from '@/mocks/api';
import type { Comment } from '@/types';
import { toast } from '@/stores/uiStore';

/**
 * 댓글 목록 조회
 */
export function useComments(postId: string) {
  return useQuery({
    queryKey: queryKeys.comments.list(postId),
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
    select: (response) => response.data,
  });
}

/**
 * 댓글 작성
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      content,
      parentId,
    }: {
      postId: string;
      content: string;
      parentId?: string | null;
    }) => createComment(postId, content, parentId),
    onSuccess: (_, variables) => {
      // 댓글 목록 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(variables.postId),
      });
      // 게시글의 댓글 수 업데이트를 위해 게시글 쿼리도 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(variables.postId),
      });
      toast.success('댓글이 작성되었습니다.');
    },
    onError: () => {
      toast.error('댓글 작성 중 오류가 발생했습니다.');
    },
  });
}

/**
 * 댓글 수정
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
      postId: string;
    }) => updateComment(commentId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(variables.postId),
      });
      toast.success('댓글이 수정되었습니다.');
    },
    onError: () => {
      toast.error('댓글 수정 중 오류가 발생했습니다.');
    },
  });
}

/**
 * 댓글 삭제
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
    }: {
      commentId: string;
      postId: string;
    }) => deleteComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(variables.postId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(variables.postId),
      });
      toast.success('댓글이 삭제되었습니다.');
    },
    onError: () => {
      toast.error('댓글 삭제 중 오류가 발생했습니다.');
    },
  });
}

/**
 * 댓글 좋아요 토글 (Optimistic Update)
 */
export function useToggleCommentLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
    }: {
      commentId: string;
      postId: string;
    }) => toggleCommentLike(commentId),
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.list(postId),
      });

      const previousComments = queryClient.getQueryData<Comment[]>(
        queryKeys.comments.list(postId)
      );

      if (previousComments) {
        // 댓글 찾아서 optimistic update
        const updateCommentsOptimistically = (
          comments: Comment[]
        ): Comment[] => {
          return comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                isLiked: !comment.isLiked,
                likeCount: comment.likeCount + (comment.isLiked ? -1 : 1),
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateCommentsOptimistically(comment.replies),
              };
            }
            return comment;
          });
        };

        queryClient.setQueryData(
          queryKeys.comments.list(postId),
          updateCommentsOptimistically(previousComments)
        );
      }

      return { previousComments };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          queryKeys.comments.list(variables.postId),
          context.previousComments
        );
      }
      toast.error('좋아요 처리 중 오류가 발생했습니다.');
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(variables.postId),
      });
    },
  });
}
