/**
 * Post Mock 데이터 팩토리
 */

import { faker } from '@faker-js/faker/locale/ko';
import type { Post, PostSummary, User } from '@/types';
import { createMockUser } from './userFactory';

// 채널 데이터 (고정)
const CHANNELS = [
  { id: '1', slug: 'free', name: '자유게시판' },
  { id: '2', slug: 'tech', name: '기술토론' },
  { id: '3', slug: 'career', name: '커리어' },
  { id: '4', slug: 'qna', name: '질문답변' },
  { id: '5', slug: 'review', name: '후기공유' },
  { id: '6', slug: 'project', name: '프로젝트' },
];

// 태그 목록
const TAGS = [
  '질문', '정보공유', '후기', '토론', '공지',
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  '백엔드', '프론트엔드', '풀스택', '데브옵스', 'AI/ML',
  '취업', '이직', '면접', '포트폴리오', '연봉협상',
];

export interface CreateMockPostOptions {
  id?: string;
  title?: string;
  content?: string;
  author?: User;
  channelId?: string;
  channelSlug?: string;
  channelName?: string;
  tags?: string[];
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mock Post 데이터 생성
 */
export function createMockPost(options: CreateMockPostOptions = {}): Post {
  const now = new Date();
  const createdAt = options.createdAt ?? faker.date.past({ years: 1 });
  const channel = options.channelSlug
    ? CHANNELS.find((c) => c.slug === options.channelSlug) ?? faker.helpers.arrayElement(CHANNELS)
    : faker.helpers.arrayElement(CHANNELS);

  return {
    id: options.id ?? faker.string.uuid(),
    title: options.title ?? faker.lorem.sentence({ min: 3, max: 10 }),
    content: options.content ?? faker.lorem.paragraphs({ min: 2, max: 5 }),
    author: options.author ?? createMockUser(),
    channelId: options.channelId ?? channel.id,
    channelSlug: options.channelSlug ?? channel.slug,
    channelName: options.channelName ?? channel.name,
    tags: options.tags ?? faker.helpers.arrayElements(TAGS, { min: 1, max: 4 }),
    viewCount: options.viewCount ?? faker.number.int({ min: 0, max: 10000 }),
    likeCount: options.likeCount ?? faker.number.int({ min: 0, max: 500 }),
    commentCount: options.commentCount ?? faker.number.int({ min: 0, max: 100 }),
    isLiked: options.isLiked ?? faker.datatype.boolean(),
    isBookmarked: options.isBookmarked ?? faker.datatype.boolean(),
    createdAt,
    updatedAt: options.updatedAt ?? faker.date.between({ from: createdAt, to: now }),
  };
}

/**
 * 다수의 Mock Post 데이터 생성
 */
export function createMockPosts(count: number, options: CreateMockPostOptions = {}): Post[] {
  return Array.from({ length: count }, () => createMockPost(options));
}

/**
 * Mock PostSummary 데이터 생성 (목록용)
 */
export function createMockPostSummary(options: CreateMockPostOptions = {}): PostSummary {
  const post = createMockPost(options);

  return {
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
  };
}

/**
 * 다수의 Mock PostSummary 데이터 생성
 */
export function createMockPostSummaries(
  count: number,
  options: CreateMockPostOptions = {}
): PostSummary[] {
  return Array.from({ length: count }, () => createMockPostSummary(options));
}

/**
 * 특정 채널의 Mock Post 데이터 생성
 */
export function createMockPostsInChannel(
  channelSlug: string,
  count: number,
  options: CreateMockPostOptions = {}
): Post[] {
  const channel = CHANNELS.find((c) => c.slug === channelSlug) ?? CHANNELS[0];

  return createMockPosts(count, {
    ...options,
    channelId: channel.id,
    channelSlug: channel.slug,
    channelName: channel.name,
  });
}

/**
 * 인기 게시글 Mock 데이터 생성 (좋아요/조회수 높음)
 */
export function createMockTrendingPosts(count: number): Post[] {
  return Array.from({ length: count }, () =>
    createMockPost({
      viewCount: faker.number.int({ min: 1000, max: 50000 }),
      likeCount: faker.number.int({ min: 100, max: 2000 }),
      commentCount: faker.number.int({ min: 20, max: 500 }),
    })
  );
}
