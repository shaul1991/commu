/**
 * Posts API 테스트
 * TDD: getTrendingPosts 함수 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock env module
vi.mock('../../env', () => ({
  shouldUseMock: vi.fn(),
  env: {
    isLocal: false,
    isProduction: false,
    apiUrl: 'http://localhost:3001',
    current: 'development',
  },
}));

// Mock client module
vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

import { getTrendingPosts, type TrendingPost } from '../posts';
import { shouldUseMock } from '../../env';
import { apiClient } from '../client';

describe('getTrendingPosts', () => {
  const mockTrendingPosts: TrendingPost[] = [
    {
      id: '1',
      title: '테스트 게시글',
      content: '테스트 내용입니다.',
      author: '테스트유저',
      channel: '기술',
      upvotes: 100,
      downvotes: 5,
      comments: 20,
      createdAt: '2시간 전',
      trending: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('local 환경 (mock 사용)', () => {
    beforeEach(() => {
      vi.mocked(shouldUseMock).mockReturnValue(true);
    });

    it('mock 데이터를 반환해야 함', async () => {
      const result = await getTrendingPosts();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('author');
      expect(result[0]).toHaveProperty('trending');
      // API 호출이 없어야 함
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it('period 파라미터로 필터링 가능해야 함', async () => {
      const result = await getTrendingPosts('today');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('development/production 환경 (실제 API)', () => {
    beforeEach(() => {
      vi.mocked(shouldUseMock).mockReturnValue(false);
    });

    it('API를 호출해야 함', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        success: true,
        data: mockTrendingPosts,
      });

      const result = await getTrendingPosts();

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/posts/trending'),
        expect.objectContaining({ skipAuth: true })
      );
      expect(result).toEqual(mockTrendingPosts);
    });

    it('period 파라미터를 쿼리스트링으로 전달해야 함', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        success: true,
        data: mockTrendingPosts,
      });

      await getTrendingPosts('week');

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('period=week'),
        expect.any(Object)
      );
    });

    it('API 실패 시 에러를 throw해야 함', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        success: false,
        error: { message: '서버 오류' },
      });

      await expect(getTrendingPosts()).rejects.toThrow('서버 오류');
    });
  });
});
