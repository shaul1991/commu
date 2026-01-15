/**
 * 검색 Mock 데이터
 */

import type { PostSummary } from '@/types';
import { mockRecommendedUsers, type RecommendedUser } from './users';
import { mockTrendingTags } from './channels';

export interface SearchResult {
  posts: PostSummary[];
  users: RecommendedUser[];
  tags: { name: string; count: number }[];
}

const mockSearchPosts: PostSummary[] = [
  {
    id: '101',
    title: 'Next.js 14 App Router 완벽 가이드',
    excerpt: 'Next.js 14의 새로운 App Router에 대해 알아봅니다. 기존 Pages Router와의 차이점과 마이그레이션 방법을 설명합니다.',
    author: { id: '1', displayName: '개발자김', profileImage: undefined },
    channelSlug: 'tech',
    channelName: '기술',
    viewCount: 1234,
    likeCount: 89,
    commentCount: 23,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '102',
    title: 'React Server Components 이해하기',
    excerpt: 'RSC의 개념과 사용 방법에 대해 설명합니다. 클라이언트 컴포넌트와의 차이점을 알아봅니다.',
    author: { id: '2', displayName: 'AI연구자', profileImage: undefined },
    channelSlug: 'tech',
    channelName: '기술',
    viewCount: 876,
    likeCount: 67,
    commentCount: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: '103',
    title: 'TypeScript 5.0 새로운 기능들',
    excerpt: 'TypeScript 5.0에서 추가된 새로운 기능들을 살펴봅니다. Decorators, const type parameters 등.',
    author: { id: '3', displayName: '커리어코치', profileImage: undefined },
    channelSlug: 'tech',
    channelName: '기술',
    viewCount: 543,
    likeCount: 45,
    commentCount: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export function getMockSearchResults(
  query: string,
  type: 'all' | 'posts' | 'users' | 'tags' = 'all'
): SearchResult {
  const lowerQuery = query.toLowerCase();

  const filteredPosts = type === 'users' || type === 'tags'
    ? []
    : mockSearchPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerQuery) ||
          post.excerpt.toLowerCase().includes(lowerQuery)
      );

  const filteredUsers = type === 'posts' || type === 'tags'
    ? []
    : mockRecommendedUsers.filter(
        (user) =>
          user.displayName.toLowerCase().includes(lowerQuery) ||
          user.username.toLowerCase().includes(lowerQuery) ||
          user.bio?.toLowerCase().includes(lowerQuery)
      );

  const filteredTags = type === 'posts' || type === 'users'
    ? []
    : mockTrendingTags.filter((tag) =>
        tag.name.toLowerCase().includes(lowerQuery)
      );

  return {
    posts: filteredPosts,
    users: filteredUsers,
    tags: filteredTags,
  };
}

export function getMockSearchSuggestions(query: string): string[] {
  const suggestions = [
    'Next.js',
    'React',
    'TypeScript',
    'JavaScript',
    '취업',
    '이직',
    'AI',
    'ChatGPT',
    '연봉',
    '개발자',
  ];

  return suggestions
    .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);
}

export function getMockTrendingSearches(): string[] {
  return ['Next.js 14', 'React 19', 'AI 개발자', '연봉 협상', 'TypeScript'];
}
