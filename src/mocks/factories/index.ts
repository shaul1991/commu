/**
 * Mock 데이터 팩토리 - Barrel Export
 *
 * 사용 예시:
 * import { createMockUser, createMockPosts, createMockCommentThread } from '@/mocks/factories';
 */

// User Factory
export {
  createMockUser,
  createMockUsers,
  createMockInactiveUser,
  createMockUnverifiedUser,
  type CreateMockUserOptions,
} from './userFactory';

// Post Factory
export {
  createMockPost,
  createMockPosts,
  createMockPostSummary,
  createMockPostSummaries,
  createMockPostsInChannel,
  createMockTrendingPosts,
  type CreateMockPostOptions,
} from './postFactory';

// Comment Factory
export {
  createMockComment,
  createMockComments,
  createMockReply,
  createMockReplies,
  createMockCommentThread,
  createMockDeletedComment,
  createMockCommentsBy,
  type CreateMockCommentOptions,
} from './commentFactory';
