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

// MyActivity (마이페이지 내 활동)
export {
  fetchMyPosts,
  fetchMyPostsInfinite,
  fetchMyComments,
  fetchMyCommentsInfinite,
  fetchLikedPosts,
  fetchLikedPostsInfinite,
  fetchBookmarkedPosts,
  fetchBookmarkedPostsInfinite,
  type FetchMyPostsParams,
  type FetchMyCommentsParams,
  type FetchLikedPostsParams,
  type FetchBookmarkedPostsParams,
} from './myActivity';
