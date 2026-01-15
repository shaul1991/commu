/**
 * 게시글 Mock 데이터
 */

export interface MockTrendingPost {
  id: string;
  title: string;
  content: string;
  author: string;
  channel: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  createdAt: string;
  trending: boolean;
}

export const mockTrendingPosts: MockTrendingPost[] = [
  {
    id: '1',
    title: 'Next.js 16 새로운 기능 총정리',
    content: 'Next.js 16에서 추가된 새로운 기능들을 정리했습니다. Turbopack의 정식 지원, 개선된 캐싱 전략, 그리고 새로운 API 라우트 기능까지 모두 살펴봅니다.',
    author: '개발자김',
    channel: '기술',
    upvotes: 523,
    downvotes: 12,
    comments: 89,
    createdAt: '2시간 전',
    trending: true,
  },
  {
    id: '2',
    title: '2024년 개발자 연봉 현황 분석',
    content: '국내 IT 기업들의 2024년 개발자 연봉 데이터를 분석했습니다. 직군별, 경력별, 회사 규모별 연봉 분포를 확인해보세요.',
    author: '커리어코치',
    channel: '커리어',
    upvotes: 891,
    downvotes: 45,
    comments: 234,
    createdAt: '5시간 전',
    trending: true,
  },
  {
    id: '3',
    title: 'AI 시대, 개발자의 역할은?',
    content: 'ChatGPT, Copilot 등 AI 도구가 일상화된 시대에서 개발자의 역할과 가치는 어떻게 변화할까요? 현업 개발자들의 생생한 의견을 모았습니다.',
    author: 'AI연구자',
    channel: '토론',
    upvotes: 456,
    downvotes: 23,
    comments: 178,
    createdAt: '8시간 전',
    trending: true,
  },
  {
    id: '4',
    title: 'React vs Vue vs Svelte 2024 비교',
    content: '2024년 기준 세 프레임워크의 성능, 생태계, 학습 곡선, 채용 시장까지 종합적으로 비교 분석했습니다.',
    author: '프론트엔드마스터',
    channel: '기술',
    upvotes: 367,
    downvotes: 89,
    comments: 145,
    createdAt: '12시간 전',
    trending: true,
  },
  {
    id: '5',
    title: '스타트업 3년차 회고록',
    content: '스타트업에서 3년간 일하며 배운 것들, 좋았던 점과 힘들었던 점을 솔직하게 공유합니다.',
    author: '스타트업러',
    channel: '일상',
    upvotes: 289,
    downvotes: 8,
    comments: 67,
    createdAt: '1일 전',
    trending: false,
  },
];

/**
 * Mock 트렌딩 게시글 조회
 */
export function getMockTrendingPosts(
  period?: 'today' | 'week' | 'month' | 'all'
): MockTrendingPost[] {
  // 실제로는 period에 따라 필터링하지만, mock에서는 전체 반환
  return mockTrendingPosts;
}
