/**
 * 사용자 Mock 데이터
 */

import type { User } from '@/types';

export interface RecommendedUser extends Pick<User, 'id' | 'username' | 'displayName' | 'profileImage' | 'bio'> {
  followerCount: number;
  isFollowing: boolean;
}

export const mockRecommendedUsers: RecommendedUser[] = [
  {
    id: '1',
    displayName: '개발자김',
    username: 'devkim',
    profileImage: undefined,
    bio: '풀스택 개발자 | Next.js 애호가',
    followerCount: 1234,
    isFollowing: false,
  },
  {
    id: '2',
    displayName: 'AI연구자',
    username: 'airesearcher',
    profileImage: undefined,
    bio: 'ML/DL 연구 | 논문 리뷰',
    followerCount: 2345,
    isFollowing: false,
  },
  {
    id: '3',
    displayName: '커리어코치',
    username: 'careercoach',
    profileImage: undefined,
    bio: 'IT 채용 담당자 | 커리어 조언',
    followerCount: 3456,
    isFollowing: true,
  },
  {
    id: '4',
    displayName: '테크블로거',
    username: 'techblogger',
    profileImage: undefined,
    bio: '기술 트렌드 분석 | 주간 뉴스레터',
    followerCount: 5678,
    isFollowing: false,
  },
  {
    id: '5',
    displayName: '스타트업대표',
    username: 'startupceo',
    profileImage: undefined,
    bio: '시리즈A 스타트업 | 창업 경험 공유',
    followerCount: 4321,
    isFollowing: false,
  },
  {
    id: '6',
    displayName: '디자이너박',
    username: 'designerpark',
    profileImage: undefined,
    bio: 'UI/UX 디자이너 | Figma 마스터',
    followerCount: 2876,
    isFollowing: false,
  },
];

// Mock API 응답 함수들
export function getMockRecommendedUsers(limit?: number): RecommendedUser[] {
  if (limit) {
    return mockRecommendedUsers.slice(0, limit);
  }
  return [...mockRecommendedUsers];
}

export function toggleMockUserFollow(userId: string): RecommendedUser | null {
  const user = mockRecommendedUsers.find((u) => u.id === userId);
  if (user) {
    user.isFollowing = !user.isFollowing;
    user.followerCount += user.isFollowing ? 1 : -1;
    return { ...user };
  }
  return null;
}
