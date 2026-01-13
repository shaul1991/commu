'use client';

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import {
  fetchPosts,
  fetchPostsInfinite,
  fetchPost,
  togglePostLike,
  togglePostBookmark,
  createPost,
  updatePost,
  deletePost,
} from '@/lib/api/posts';
import type { Post } from '@/types';
import { toast } from '@/stores/uiStore';

/**
 * 게시글 목록 조회 (페이지네이션)
 */
export function usePosts(
  page: number = 1,
  limit: number = 10,
  channelSlug?: string
) {
  return useQuery({
    queryKey: queryKeys.posts.list({ page, limit, channelSlug }),
    queryFn: () => fetchPosts(page, limit, channelSlug),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 게시글 목록 조회 (무한 스크롤)
 */
export function usePostsInfinite(limit: number = 10, channelSlug?: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.infinite({ limit, channelSlug }),
    queryFn: ({ pageParam }) =>
      fetchPostsInfinite(pageParam as string | undefined, limit, channelSlug),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

/**
 * 게시글 상세 조회
 */
export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => fetchPost(id),
    enabled: !!id,
    select: (response) => response.data,
  });
}

/**
 * 게시글 좋아요 토글 (Optimistic Update)
 */
export function useTogglePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePostLike,
    onMutate: async (postId) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.detail(postId),
      });

      // 이전 데이터 스냅샷
      const previousPost = queryClient.getQueryData<{ data: Post }>(
        queryKeys.posts.detail(postId)
      );

      // Optimistic update
      if (previousPost) {
        queryClient.setQueryData(queryKeys.posts.detail(postId), {
          ...previousPost,
          data: {
            ...previousPost.data,
            isLiked: !previousPost.data.isLiked,
            likeCount:
              previousPost.data.likeCount +
              (previousPost.data.isLiked ? -1 : 1),
          },
        });
      }

      return { previousPost };
    },
    onError: (err, postId, context) => {
      // 에러 시 롤백
      if (context?.previousPost) {
        queryClient.setQueryData(
          queryKeys.posts.detail(postId),
          context.previousPost
        );
      }
      toast.error('좋아요 처리 중 오류가 발생했습니다.');
    },
    onSettled: (data, error, postId) => {
      // 쿼리 무효화하여 서버 데이터와 동기화
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(postId),
      });
    },
  });
}

/**
 * 게시글 북마크 토글 (Optimistic Update)
 */
export function useTogglePostBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePostBookmark,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.detail(postId),
      });

      const previousPost = queryClient.getQueryData<{ data: Post }>(
        queryKeys.posts.detail(postId)
      );

      if (previousPost) {
        queryClient.setQueryData(queryKeys.posts.detail(postId), {
          ...previousPost,
          data: {
            ...previousPost.data,
            isBookmarked: !previousPost.data.isBookmarked,
          },
        });
      }

      return { previousPost };
    },
    onError: (err, postId, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(
          queryKeys.posts.detail(postId),
          context.previousPost
        );
      }
      toast.error('북마크 처리 중 오류가 발생했습니다.');
    },
    onSuccess: (data) => {
      if (data.data.isBookmarked) {
        toast.success('북마크에 추가되었습니다.');
      } else {
        toast.info('북마크에서 제거되었습니다.');
      }
    },
    onSettled: (data, error, postId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(postId),
      });
    },
  });
}

/**
 * 게시글 작성
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // 게시글 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.infinite() });
      toast.success('게시글이 작성되었습니다.');
    },
    onError: () => {
      toast.error('게시글 작성 중 오류가 발생했습니다.');
    },
  });
}

/**
 * 게시글 수정
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pick<Post, 'title' | 'content' | 'tags'>> }) =>
      updatePost(id, data),
    onSuccess: (response, variables) => {
      // 해당 게시글 캐시 업데이트
      queryClient.setQueryData(queryKeys.posts.detail(variables.id), response);
      // 목록 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.infinite() });
      toast.success('게시글이 수정되었습니다.');
    },
    onError: () => {
      toast.error('게시글 수정 중 오류가 발생했습니다.');
    },
  });
}

/**
 * 게시글 삭제
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, postId) => {
      // 해당 게시글 캐시 제거
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(postId) });
      // 목록 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.infinite() });
      toast.success('게시글이 삭제되었습니다.');
    },
    onError: () => {
      toast.error('게시글 삭제 중 오류가 발생했습니다.');
    },
  });
}
