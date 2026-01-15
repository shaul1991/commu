/**
 * 채널 Mock 데이터
 */

import type { Channel, PostSummary, PaginatedResponse } from '@/types';

export const mockChannels: Channel[] = [
  {
    id: '1',
    slug: 'tech',
    name: '기술',
    description: '프로그래밍, 개발, IT 기술에 대해 이야기하는 채널입니다.',
    icon: 'T',
    color: 'primary',
    postCount: 8923,
    subscriberCount: 12453,
    isSubscribed: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    slug: 'career',
    name: '커리어',
    description: '취업, 이직, 커리어 개발에 관한 정보를 공유하는 채널입니다.',
    icon: 'C',
    color: 'success',
    postCount: 5432,
    subscriberCount: 8721,
    isSubscribed: false,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    slug: 'daily',
    name: '일상',
    description: '자유롭게 일상을 공유하는 공간입니다.',
    icon: 'D',
    color: 'warning',
    postCount: 12543,
    subscriberCount: 15234,
    isSubscribed: true,
    createdAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    slug: 'question',
    name: '질문',
    description: '궁금한 것을 물어보고 답변을 받는 채널입니다.',
    icon: 'Q',
    color: 'info',
    postCount: 7654,
    subscriberCount: 9876,
    isSubscribed: false,
    createdAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    slug: 'news',
    name: '뉴스',
    description: 'IT 업계 소식과 트렌드를 공유합니다.',
    icon: 'N',
    color: 'error',
    postCount: 4321,
    subscriberCount: 6543,
    isSubscribed: false,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    slug: 'review',
    name: '리뷰',
    description: '제품, 서비스, 도서 등 다양한 리뷰를 공유합니다.',
    icon: 'R',
    color: 'secondary',
    postCount: 2345,
    subscriberCount: 4532,
    isSubscribed: false,
    createdAt: new Date('2024-01-06'),
  },
  {
    id: '7',
    slug: 'general',
    name: '일반',
    description: '자유롭게 이야기할 수 있는 공간입니다. 어떤 주제든 환영합니다!',
    icon: 'G',
    color: 'primary',
    postCount: 12543,
    subscriberCount: 15234,
    isSubscribed: true,
    createdAt: new Date('2024-01-07'),
  },
];

export const mockChannelPosts: PostSummary[] = [
  {
    id: '1',
    title: '이 채널의 첫 번째 게시글입니다',
    excerpt: '채널에 오신 것을 환영합니다! 자유롭게 이야기해주세요.',
    author: { id: '1', displayName: '운영자', profileImage: undefined },
    channelSlug: 'general',
    channelName: '일반',
    viewCount: 234,
    likeCount: 45,
    commentCount: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1시간 전
  },
  {
    id: '2',
    title: '질문있습니다! 도움 부탁드려요',
    excerpt: '처음 글 올려봅니다. 궁금한 점이 있는데 답변 부탁드립니다.',
    author: { id: '2', displayName: '새회원', profileImage: undefined },
    channelSlug: 'general',
    channelName: '일반',
    viewCount: 156,
    likeCount: 23,
    commentCount: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3시간 전
  },
  {
    id: '3',
    title: '유용한 정보 공유합니다',
    excerpt: '제가 최근에 알게 된 유용한 팁을 공유합니다. 많은 분들께 도움이 되셨으면 좋겠어요.',
    author: { id: '3', displayName: '정보왕', profileImage: undefined },
    channelSlug: 'general',
    channelName: '일반',
    viewCount: 512,
    likeCount: 89,
    commentCount: 34,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5시간 전
  },
];

export const mockTrendingTags = [
  { name: 'Next.js', count: 234 },
  { name: 'React', count: 189 },
  { name: 'TypeScript', count: 156 },
  { name: '취업', count: 143 },
  { name: 'AI', count: 128 },
  { name: '이직', count: 98 },
  { name: 'ChatGPT', count: 87 },
  { name: '연봉', count: 76 },
];

// Mock API 응답 함수들
export function getMockChannels(options?: {
  sortBy?: 'popular' | 'latest' | 'name';
  limit?: number;
}): Channel[] {
  let channels = [...mockChannels];

  // 정렬
  if (options?.sortBy === 'popular') {
    channels.sort((a, b) => b.subscriberCount - a.subscriberCount);
  } else if (options?.sortBy === 'latest') {
    channels.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (options?.sortBy === 'name') {
    channels.sort((a, b) => a.name.localeCompare(b.name));
  }

  // 제한
  if (options?.limit) {
    channels = channels.slice(0, options.limit);
  }

  return channels;
}

export function getMockChannel(slug: string): Channel | null {
  return mockChannels.find((c) => c.slug === slug) || null;
}

export function getMockChannelPosts(
  channelSlug: string,
  page: number = 1,
  limit: number = 10
): PaginatedResponse<PostSummary> {
  // 실제로는 channelSlug로 필터링하지만, mock에서는 모든 게시글 반환
  const filteredPosts = mockChannelPosts;
  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filteredPosts.slice(start, start + limit);

  return {
    data,
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

export function toggleMockChannelSubscription(slug: string): Channel | null {
  const channel = mockChannels.find((c) => c.slug === slug);
  if (channel) {
    channel.isSubscribed = !channel.isSubscribed;
    channel.subscriberCount += channel.isSubscribed ? 1 : -1;
    return { ...channel };
  }
  return null;
}
