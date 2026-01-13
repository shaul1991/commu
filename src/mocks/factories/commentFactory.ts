/**
 * Comment Mock 데이터 팩토리
 */

import { faker } from '@faker-js/faker/locale/ko';
import type { Comment, User } from '@/types';
import { createMockUser } from './userFactory';

export interface CreateMockCommentOptions {
  id?: string;
  postId?: string;
  content?: string;
  author?: Pick<User, 'id' | 'displayName' | 'profileImage'>;
  parentId?: string | null;
  likeCount?: number;
  isLiked?: boolean;
  isDeleted?: boolean;
  includeReplies?: boolean;
  replyCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 댓글 작성자 정보 생성
 */
function createCommentAuthor(): Pick<User, 'id' | 'displayName' | 'profileImage'> {
  const user = createMockUser();
  return {
    id: user.id,
    displayName: user.displayName,
    profileImage: user.profileImage,
  };
}

/**
 * Mock Comment 데이터 생성
 */
export function createMockComment(options: CreateMockCommentOptions = {}): Comment {
  const now = new Date();
  const createdAt = options.createdAt ?? faker.date.past({ years: 1 });
  const includeReplies = options.includeReplies ?? false;
  const replyCount = options.replyCount ?? faker.number.int({ min: 0, max: 5 });

  const comment: Comment = {
    id: options.id ?? faker.string.uuid(),
    postId: options.postId ?? faker.string.uuid(),
    content: options.content ?? faker.lorem.paragraph(),
    author: options.author ?? createCommentAuthor(),
    parentId: options.parentId ?? null, // null이면 최상위 댓글
    likeCount: options.likeCount ?? faker.number.int({ min: 0, max: 50 }),
    isLiked: options.isLiked ?? faker.datatype.boolean(),
    isDeleted: options.isDeleted ?? false,
    createdAt,
    updatedAt: options.updatedAt ?? faker.date.between({ from: createdAt, to: now }),
  };

  // 대댓글 포함 옵션이 있고, 최상위 댓글인 경우에만 대댓글 생성
  if (includeReplies && !options.parentId && replyCount > 0) {
    comment.replies = createMockReplies(comment.id, comment.postId, replyCount);
  }

  return comment;
}

/**
 * 대댓글 Mock 데이터 생성
 */
export function createMockReply(
  parentId: string,
  postId: string,
  options: CreateMockCommentOptions = {}
): Comment {
  return createMockComment({
    ...options,
    postId,
    parentId,
    includeReplies: false, // 대댓글은 더 이상 대댓글을 가지지 않음
  });
}

/**
 * 다수의 대댓글 Mock 데이터 생성
 */
export function createMockReplies(
  parentId: string,
  postId: string,
  count: number
): Comment[] {
  return Array.from({ length: count }, () => createMockReply(parentId, postId));
}

/**
 * 다수의 Mock Comment 데이터 생성
 */
export function createMockComments(
  count: number,
  options: CreateMockCommentOptions = {}
): Comment[] {
  return Array.from({ length: count }, () => createMockComment(options));
}

/**
 * 게시글의 전체 댓글 트리 생성 (대댓글 포함)
 */
export function createMockCommentThread(
  postId: string,
  topLevelCount: number = 5,
  maxRepliesPerComment: number = 3
): Comment[] {
  return Array.from({ length: topLevelCount }, () =>
    createMockComment({
      postId,
      parentId: null,
      includeReplies: true,
      replyCount: faker.number.int({ min: 0, max: maxRepliesPerComment }),
    })
  );
}

/**
 * 삭제된 댓글 Mock 데이터 생성
 */
export function createMockDeletedComment(options: CreateMockCommentOptions = {}): Comment {
  return createMockComment({
    ...options,
    content: '삭제된 댓글입니다.',
    isDeleted: true,
  });
}

/**
 * 특정 사용자의 댓글 Mock 데이터 생성
 */
export function createMockCommentsBy(
  author: Pick<User, 'id' | 'displayName' | 'profileImage'>,
  count: number,
  options: CreateMockCommentOptions = {}
): Comment[] {
  return Array.from({ length: count }, () =>
    createMockComment({
      ...options,
      author,
    })
  );
}
