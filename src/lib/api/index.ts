/**
 * API Module - Barrel Export
 */

// Client
export { apiClient, type ApiResponse } from './client';

// Auth
export { authApi } from './auth';

// Posts
export {
  fetchPosts,
  fetchPostsInfinite,
  fetchPost,
  togglePostLike,
  togglePostBookmark,
  createPost,
  updatePost,
  deletePost,
} from './posts';

// Comments
export {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} from './comments';

// Search
export {
  search,
  searchSuggest,
  getTrendingSearches,
  type SearchResult,
  type SearchSuggestion,
  type TrendingSearch,
} from './search';

// Users
export {
  getMyProfile,
  updateMyProfile,
  getMyLikes,
  getMyBookmarks,
  getUserProfile,
} from './users';
