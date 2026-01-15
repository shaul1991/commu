/**
 * Explore 페이지 TDD 테스트
 * 기능: 인기 채널, 트렌딩 태그, 추천 사용자 표시
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, MockedFunction } from 'vitest';
import ExplorePage from '../page';
import { fetchPopularChannels, toggleChannelSubscription } from '@/lib/api/channels';
import { getRecommendedUsers, toggleUserFollow, type RecommendedUser } from '@/lib/api/users';
import { getTrendingTags, type TrendingTag } from '@/lib/api/tags';
import type { Channel } from '@/types';

// Mock modules
vi.mock('@/lib/api/channels', () => ({
  fetchPopularChannels: vi.fn(),
  toggleChannelSubscription: vi.fn(),
}));

vi.mock('@/lib/api/users', () => ({
  getRecommendedUsers: vi.fn(),
  toggleUserFollow: vi.fn(),
}));

vi.mock('@/lib/api/tags', () => ({
  getTrendingTags: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/components/templates', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

const mockFetchPopularChannels = fetchPopularChannels as MockedFunction<typeof fetchPopularChannels>;
const mockGetRecommendedUsers = getRecommendedUsers as MockedFunction<typeof getRecommendedUsers>;
const mockGetTrendingTags = getTrendingTags as MockedFunction<typeof getTrendingTags>;
const mockToggleChannelSubscription = toggleChannelSubscription as MockedFunction<typeof toggleChannelSubscription>;
const mockToggleUserFollow = toggleUserFollow as MockedFunction<typeof toggleUserFollow>;

// Mock Data
const mockChannels: Channel[] = [
  {
    id: '1',
    slug: 'tech',
    name: '기술',
    description: '프로그래밍, 개발 채널',
    icon: 'T',
    color: 'primary',
    postCount: 100,
    subscriberCount: 1000,
    isSubscribed: false,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    slug: 'career',
    name: '커리어',
    description: '취업, 이직 채널',
    icon: 'C',
    color: 'success',
    postCount: 50,
    subscriberCount: 500,
    isSubscribed: true,
    createdAt: new Date('2024-01-02'),
  },
];

const mockUsers: RecommendedUser[] = [
  {
    id: '1',
    displayName: '개발자김',
    username: 'devkim',
    bio: '풀스택 개발자',
    followerCount: 1234,
    isFollowing: false,
  },
  {
    id: '2',
    displayName: 'AI연구자',
    username: 'airesearcher',
    bio: 'ML/DL 연구',
    followerCount: 2345,
    isFollowing: true,
  },
];

const mockTags: TrendingTag[] = [
  { name: 'Next.js', count: 234 },
  { name: 'React', count: 189 },
  { name: 'TypeScript', count: 156 },
];

describe('Explore Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchPopularChannels.mockResolvedValue(mockChannels);
    mockGetRecommendedUsers.mockResolvedValue(mockUsers);
    mockGetTrendingTags.mockResolvedValue(mockTags);
  });

  describe('렌더링 테스트', () => {
    it('페이지 헤더가 표시되어야 함', async () => {
      render(<ExplorePage />);
      expect(screen.getByText('탐색')).toBeInTheDocument();
      expect(screen.getByText('관심사에 맞는 채널과 사용자를 찾아보세요')).toBeInTheDocument();
    });

    it('검색 폼이 표시되어야 함', async () => {
      render(<ExplorePage />);
      expect(screen.getByPlaceholderText('채널, 태그, 사용자 검색...')).toBeInTheDocument();
    });

    it('인기 채널 섹션 헤더가 표시되어야 함', async () => {
      render(<ExplorePage />);
      expect(screen.getByText('인기 채널')).toBeInTheDocument();
      // "전체 보기" 링크가 2개 있으므로 getAllByText 사용
      const allViewLinks = screen.getAllByText('전체 보기');
      expect(allViewLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('트렌딩 태그 섹션 헤더가 표시되어야 함', async () => {
      render(<ExplorePage />);
      expect(screen.getByText('트렌딩 태그')).toBeInTheDocument();
    });

    it('추천 사용자 섹션 헤더가 표시되어야 함', async () => {
      render(<ExplorePage />);
      expect(screen.getByText('추천 사용자')).toBeInTheDocument();
    });
  });

  describe('데이터 로딩 테스트', () => {
    it('API가 호출되어야 함', async () => {
      render(<ExplorePage />);

      await waitFor(() => {
        expect(mockFetchPopularChannels).toHaveBeenCalledWith(6);
        expect(mockGetRecommendedUsers).toHaveBeenCalledWith(3);
        expect(mockGetTrendingTags).toHaveBeenCalledWith(8);
      });
    });

    it('인기 채널 목록이 표시되어야 함', async () => {
      render(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByText('기술')).toBeInTheDocument();
        expect(screen.getByText('커리어')).toBeInTheDocument();
      });
    });

    it('트렌딩 태그 목록이 표시되어야 함', async () => {
      render(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByText('Next.js')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
      });
    });

    it('추천 사용자 목록이 표시되어야 함', async () => {
      render(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByText('개발자김')).toBeInTheDocument();
        expect(screen.getByText('AI연구자')).toBeInTheDocument();
      });
    });
  });

  describe('트렌딩 태그 인터랙션', () => {
    it('트렌딩 태그 클릭 시 검색 페이지로 이동하는 링크가 있어야 함', async () => {
      render(<ExplorePage />);

      await waitFor(() => {
        const nextjsLink = screen.getByText('Next.js').closest('a');
        expect(nextjsLink).toHaveAttribute('href', '/search?q=Next.js');
      });
    });

    it('태그에 게시글 수가 표시되어야 함', async () => {
      render(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByText('(234)')).toBeInTheDocument();
        expect(screen.getByText('(189)')).toBeInTheDocument();
      });
    });
  });

  describe('빈 상태 테스트', () => {
    it('트렌딩 태그가 없을 때 안내 메시지가 표시되어야 함', async () => {
      mockGetTrendingTags.mockResolvedValue([]);

      render(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByText('트렌딩 태그가 없습니다.')).toBeInTheDocument();
      });
    });

    it('인기 채널이 없을 때 빈 상태가 표시되어야 함', async () => {
      mockFetchPopularChannels.mockResolvedValue([]);

      render(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByText('인기 채널이 없습니다.')).toBeInTheDocument();
      });
    });

    it('추천 사용자가 없을 때 빈 상태가 표시되어야 함', async () => {
      mockGetRecommendedUsers.mockResolvedValue([]);

      render(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByText('추천 사용자가 없습니다.')).toBeInTheDocument();
      });
    });
  });

  describe('에러 처리 테스트', () => {
    it('채널 로드 실패 시 에러 메시지가 표시되어야 함', async () => {
      mockFetchPopularChannels.mockRejectedValue(new Error('네트워크 오류'));

      render(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByText('채널을 불러오는데 실패했습니다.')).toBeInTheDocument();
      });
    });

    it('사용자 로드 실패 시 에러 메시지가 표시되어야 함', async () => {
      mockGetRecommendedUsers.mockRejectedValue(new Error('네트워크 오류'));

      render(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByText('사용자를 불러오는데 실패했습니다.')).toBeInTheDocument();
      });
    });

    it('태그 로드 실패 시 에러 메시지가 표시되어야 함', async () => {
      mockGetTrendingTags.mockRejectedValue(new Error('네트워크 오류'));

      render(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByText('태그를 불러오는데 실패했습니다.')).toBeInTheDocument();
      });
    });
  });

  describe('검색 기능 테스트', () => {
    it('검색 입력 필드가 있어야 함', () => {
      render(<ExplorePage />);
      const searchInput = screen.getByPlaceholderText('채널, 태그, 사용자 검색...');
      expect(searchInput).toBeInTheDocument();
    });

    it('검색어 입력이 가능해야 함', () => {
      render(<ExplorePage />);
      const searchInput = screen.getByPlaceholderText('채널, 태그, 사용자 검색...');
      fireEvent.change(searchInput, { target: { value: '테스트 검색어' } });
      expect(searchInput).toHaveValue('테스트 검색어');
    });
  });
});
