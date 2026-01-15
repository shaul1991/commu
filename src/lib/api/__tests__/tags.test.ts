/**
 * Tags API 테스트
 * TDD: getTrendingTags 함수 테스트
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

import { getTrendingTags, type TrendingTag } from '../tags';
import { shouldUseMock } from '../../env';
import { apiClient } from '../client';

describe('getTrendingTags', () => {
  const mockTrendingTags: TrendingTag[] = [
    { name: 'React', count: 150 },
    { name: 'TypeScript', count: 120 },
    { name: 'Next.js', count: 100 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('local 환경 (mock 사용)', () => {
    beforeEach(() => {
      vi.mocked(shouldUseMock).mockReturnValue(true);
    });

    it('mock 데이터를 반환해야 함', async () => {
      const result = await getTrendingTags();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('count');
      // API 호출이 없어야 함
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it('limit 파라미터로 개수 제한 가능해야 함', async () => {
      const result = await getTrendingTags(3);

      expect(result).toBeDefined();
      expect(result.length).toBeLessThanOrEqual(3);
    });
  });

  describe('development/production 환경 (실제 API)', () => {
    beforeEach(() => {
      vi.mocked(shouldUseMock).mockReturnValue(false);
    });

    it('API를 호출해야 함', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        success: true,
        data: { tags: mockTrendingTags },
      });

      const result = await getTrendingTags();

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/tags/popular'),
        expect.objectContaining({ skipAuth: true })
      );
      expect(result).toEqual(mockTrendingTags);
    });

    it('limit 파라미터를 쿼리스트링으로 전달해야 함', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        success: true,
        data: { tags: mockTrendingTags },
      });

      await getTrendingTags(5);

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('limit=5'),
        expect.any(Object)
      );
    });

    it('API 실패 시 에러를 throw해야 함', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        success: false,
        error: { message: '서버 오류' },
      });

      await expect(getTrendingTags()).rejects.toThrow('서버 오류');
    });
  });
});
