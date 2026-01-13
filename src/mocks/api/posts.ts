/**
 * Posts Mock API
 * 개발 환경에서 사용할 Mock API 함수들
 */

import type { Post, PostSummary, PaginatedResponse, ApiResponse } from '@/types';
import {
  createMockPost,
  createMockPosts,
} from '@/mocks/factories';

// Mock 데이터 저장소 (메모리)
let mockPosts: Post[] = createMockPosts(50);

// 딜레이 함수 (네트워크 지연 시뮬레이션)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 게시글 목록 조회 (페이지네이션)
 */
export async function fetchPosts(
  page: number = 1,
  limit: number = 10,
  channelSlug?: string
): Promise<PaginatedResponse<PostSummary>> {
  await delay(500); // 500ms 지연

  let filtered = [...mockPosts];

  // 채널 필터링
  if (channelSlug) {
    filtered = filtered.filter((p) => p.channelSlug === channelSlug);
  }

  // 최신순 정렬
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  const posts = filtered.slice(start, end).map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.content.substring(0, 150) + '...',
    author: {
      id: post.author.id,
      displayName: post.author.displayName,
      profileImage: post.author.profileImage,
    },
    channelSlug: post.channelSlug,
    channelName: post.channelName,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    createdAt: post.createdAt,
  }));

  return {
    data: posts,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * 무한 스크롤용 게시글 목록 조회
 */
export async function fetchPostsInfinite(
  cursor?: string,
  limit: number = 10,
  channelSlug?: string
): Promise<{
  data: PostSummary[];
  nextCursor: string | null;
}> {
  await delay(500);

  let filtered = [...mockPosts];

  // 채널 필터링
  if (channelSlug) {
    filtered = filtered.filter((p) => p.channelSlug === channelSlug);
  }

  // 최신순 정렬
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // cursor 위치 찾기
  let startIndex = 0;
  if (cursor) {
    const cursorIndex = filtered.findIndex((p) => p.id === cursor);
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1;
    }
  }

  const posts = filtered.slice(startIndex, startIndex + limit).map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.content.substring(0, 150) + '...',
    author: {
      id: post.author.id,
      displayName: post.author.displayName,
      profileImage: post.author.profileImage,
    },
    channelSlug: post.channelSlug,
    channelName: post.channelName,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    createdAt: post.createdAt,
  }));

  const lastPost = posts[posts.length - 1];
  const hasMore = startIndex + limit < filtered.length;

  return {
    data: posts,
    nextCursor: hasMore && lastPost ? lastPost.id : null,
  };
}

/**
 * 게시글 상세 조회
 */
export async function fetchPost(id: string): Promise<ApiResponse<Post>> {
  await delay(300);

  const post = mockPosts.find((p) => p.id === id);

  if (!post) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  // 조회수 증가
  post.viewCount += 1;

  return {
    success: true,
    data: post,
  };
}

/**
 * 게시글 좋아요 토글
 */
export async function togglePostLike(
  id: string
): Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>> {
  await delay(200);

  const post = mockPosts.find((p) => p.id === id);

  if (!post) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  post.isLiked = !post.isLiked;
  post.likeCount += post.isLiked ? 1 : -1;

  return {
    success: true,
    data: {
      isLiked: post.isLiked,
      likeCount: post.likeCount,
    },
  };
}

/**
 * 게시글 북마크 토글
 */
export async function togglePostBookmark(
  id: string
): Promise<ApiResponse<{ isBookmarked: boolean }>> {
  await delay(200);

  const post = mockPosts.find((p) => p.id === id);

  if (!post) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  post.isBookmarked = !post.isBookmarked;

  return {
    success: true,
    data: {
      isBookmarked: post.isBookmarked,
    },
  };
}

/**
 * 게시글 작성
 */
export async function createPost(
  data: Pick<Post, 'title' | 'content' | 'channelSlug' | 'tags'>
): Promise<ApiResponse<Post>> {
  await delay(500);

  const newPost = createMockPost({
    title: data.title,
    content: data.content,
    channelSlug: data.channelSlug,
    tags: data.tags,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  mockPosts = [newPost, ...mockPosts];

  return {
    success: true,
    data: newPost,
  };
}

/**
 * 게시글 수정
 */
export async function updatePost(
  id: string,
  data: Partial<Pick<Post, 'title' | 'content' | 'tags'>>
): Promise<ApiResponse<Post>> {
  await delay(500);

  const postIndex = mockPosts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  mockPosts[postIndex] = {
    ...mockPosts[postIndex],
    ...data,
    updatedAt: new Date(),
  };

  return {
    success: true,
    data: mockPosts[postIndex],
  };
}

/**
 * 게시글 삭제
 */
export async function deletePost(id: string): Promise<ApiResponse<null>> {
  await delay(300);

  const postIndex = mockPosts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  mockPosts.splice(postIndex, 1);

  return {
    success: true,
    data: null,
  };
}

// Mock 데이터 초기화 (테스트용)
export function resetMockPosts() {
  mockPosts = createMockPosts(50);
}
