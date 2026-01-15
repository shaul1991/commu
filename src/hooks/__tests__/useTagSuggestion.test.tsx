/**
 * useTagSuggestion 훅 테스트
 */

import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useTagSuggestion } from '../useTagSuggestion';

// Mock API
vi.mock('@/lib/api/tags', () => ({
  suggestTags: vi.fn().mockResolvedValue({
    success: true,
    data: { tags: [] },
  }),
  getPopularTags: vi.fn().mockResolvedValue({
    success: true,
    data: { tags: [] },
  }),
}));

describe('useTagSuggestion', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('초기 상태가 올바름', () => {
    const { result } = renderHook(() => useTagSuggestion(), { wrapper });

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.query).toBe('');
  });

  it('setQuery로 쿼리 설정', () => {
    const { result } = renderHook(() => useTagSuggestion(), { wrapper });

    act(() => {
      result.current.setQuery('react');
    });

    expect(result.current.query).toBe('react');
  });

  it('clearQuery로 쿼리 초기화', () => {
    const { result } = renderHook(() => useTagSuggestion(), { wrapper });

    act(() => {
      result.current.setQuery('react');
    });
    expect(result.current.query).toBe('react');

    act(() => {
      result.current.clearQuery();
    });
    expect(result.current.query).toBe('');
  });

  it('error가 null로 시작', () => {
    const { result } = renderHook(() => useTagSuggestion(), { wrapper });
    expect(result.current.error).toBeNull();
  });
});
