/**
 * MyActivity (내 활동) 관련 타입 정의
 */

import { PostSummary } from './index';

// 내 게시글 타입
export interface MyPost {
  id: string;
  title: string;
  content: string; // 미리보기 (150자)
  viewCount: number;
  likeCount: number;
  commentCount: number;
  images?: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 내 댓글 타입
export interface MyComment {
  id: string;
  content: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  post: {
    id: string;
    title: string;
    channelSlug?: string;
  } | null;
  parentId: string | null;
}

// 좋아요한 글 타입
export interface LikedPost extends PostSummary {
  likedAt: Date;
}

// 북마크한 글 타입
export interface BookmarkedPost extends PostSummary {
  bookmarkedAt: Date;
  folder?: string;
}

// 커서 기반 페이지네이션 메타
export interface CursorPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor: string | null;
}

// 커서 기반 페이지네이션 응답
export interface CursorPaginatedResponse<T> {
  data: T[];
  meta: CursorPaginationMeta;
}

// 정렬 옵션
export type PostSortOption = 'latest' | 'oldest' | 'popular' | 'views';
export type CommentSortOption = 'latest' | 'oldest';
