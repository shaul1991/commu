/**
 * Commu 프로젝트 공통 타입 정의
 */

// ============================================
// User 관련 타입
// ============================================

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  profileImage?: string;
  bio?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Post (게시글) 관련 타입
// ============================================

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  channelId: string;
  channelSlug: string;
  channelName: string;
  tags: string[];
  images?: string[];           // 이미지 URL 배열
  referenceUrl?: string;       // 참고 링크
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 게시글 작성 입력 타입
export interface CreatePostInput {
  title: string;
  content: string;
  // TODO: 백엔드 채널 API 구현 후 channelSlug 필수로 변경
  channelSlug?: string;
  tags: string[];
  images?: string[];
  referenceUrl?: string;
}

// 업로드된 이미지 정보
export interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// 태그 추천
export interface TagSuggestion {
  name: string;
  count: number;
}

export interface PostSummary {
  id: string;
  title: string;
  excerpt: string;
  author: Pick<User, 'id' | 'displayName' | 'profileImage'>;
  channelSlug: string;
  channelName: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
}

// ============================================
// Comment (댓글) 관련 타입
// ============================================

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: Pick<User, 'id' | 'displayName' | 'profileImage'>;
  parentId: string | null; // null이면 최상위 댓글, 값이 있으면 대댓글
  likeCount: number;
  isLiked: boolean;
  isDeleted: boolean;
  replies?: Comment[]; // 대댓글 목록
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Channel (채널) 관련 타입
// ============================================

export interface Channel {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  postCount: number;
  subscriberCount: number;
  isSubscribed: boolean;
  createdAt: Date;
}

// ============================================
// Notification (알림) 관련 타입
// ============================================

export type NotificationType = 'like' | 'comment' | 'reply' | 'follow' | 'mention' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

// ============================================
// Pagination 관련 타입
// ============================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ============================================
// API Response 타입
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
