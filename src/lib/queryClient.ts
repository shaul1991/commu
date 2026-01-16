'use client';

import { QueryClient } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR에서는 클라이언트에서 즉시 refetch하는 것을 방지
        staleTime: 60 * 1000, // 1분
        gcTime: 5 * 60 * 1000, // 5분 (이전의 cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // 서버: 항상 새 query client 생성
    return makeQueryClient();
  } else {
    // 브라우저: singleton 패턴 사용
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

// Query Keys 상수
export const queryKeys = {
  // Posts
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    infinite: (filters?: Record<string, unknown>) =>
      [...queryKeys.posts.all, 'infinite', filters] as const,
  },

  // Comments
  comments: {
    all: ['comments'] as const,
    lists: () => [...queryKeys.comments.all, 'list'] as const,
    list: (postId: string) => [...queryKeys.comments.lists(), postId] as const,
    detail: (id: string) => [...queryKeys.comments.all, 'detail', id] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
  },

  // Channels
  channels: {
    all: ['channels'] as const,
    list: () => [...queryKeys.channels.all, 'list'] as const,
    detail: (slug: string) =>
      [...queryKeys.channels.all, 'detail', slug] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: () => [...queryKeys.notifications.all, 'list'] as const,
    unreadCount: () =>
      [...queryKeys.notifications.all, 'unreadCount'] as const,
  },

  // MyActivity (마이페이지 내 활동)
  myActivity: {
    all: ['myActivity'] as const,
    // 내 게시글
    posts: {
      all: () => [...queryKeys.myActivity.all, 'posts'] as const,
      list: (filters?: Record<string, unknown>) =>
        [...queryKeys.myActivity.posts.all(), 'list', filters] as const,
      infinite: (filters?: Record<string, unknown>) =>
        [...queryKeys.myActivity.posts.all(), 'infinite', filters] as const,
    },
    // 내 댓글
    comments: {
      all: () => [...queryKeys.myActivity.all, 'comments'] as const,
      list: (filters?: Record<string, unknown>) =>
        [...queryKeys.myActivity.comments.all(), 'list', filters] as const,
      infinite: (filters?: Record<string, unknown>) =>
        [...queryKeys.myActivity.comments.all(), 'infinite', filters] as const,
    },
    // 좋아요한 글
    likes: {
      all: () => [...queryKeys.myActivity.all, 'likes'] as const,
      list: (filters?: Record<string, unknown>) =>
        [...queryKeys.myActivity.likes.all(), 'list', filters] as const,
      infinite: (filters?: Record<string, unknown>) =>
        [...queryKeys.myActivity.likes.all(), 'infinite', filters] as const,
    },
    // 북마크
    bookmarks: {
      all: () => [...queryKeys.myActivity.all, 'bookmarks'] as const,
      list: (filters?: Record<string, unknown>) =>
        [...queryKeys.myActivity.bookmarks.all(), 'list', filters] as const,
      infinite: (filters?: Record<string, unknown>) =>
        [...queryKeys.myActivity.bookmarks.all(), 'infinite', filters] as const,
    },
  },
};
