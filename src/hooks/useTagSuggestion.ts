'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { suggestTags, getPopularTags } from '@/lib/api/tags';
import type { TagSuggestion } from '@/types';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

interface UseTagSuggestionReturn {
  query: string;
  setQuery: (query: string) => void;
  clearQuery: () => void;
  suggestions: TagSuggestion[];
  popularTags: TagSuggestion[];
  isLoading: boolean;
  error: string | null;
}

export function useTagSuggestion(): UseTagSuggestionReturn {
  const [query, setQueryState] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  // 태그 추천 쿼리
  const {
    data: suggestionsData,
    isLoading: isSuggestionsLoading,
    error: suggestionsError,
  } = useQuery({
    queryKey: ['tags', 'suggest', debouncedQuery],
    queryFn: () => suggestTags(debouncedQuery, 5),
    enabled: debouncedQuery.length >= MIN_QUERY_LENGTH,
  });

  // 인기 태그 쿼리
  const {
    data: popularData,
    isLoading: isPopularLoading,
  } = useQuery({
    queryKey: ['tags', 'popular'],
    queryFn: () => getPopularTags(10),
  });

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
  }, []);

  const clearQuery = useCallback(() => {
    setQueryState('');
    setDebouncedQuery('');
  }, []);

  return {
    query,
    setQuery,
    clearQuery,
    suggestions: suggestionsData?.data?.tags ?? [],
    popularTags: popularData?.data?.tags ?? [],
    isLoading: isSuggestionsLoading || isPopularLoading,
    error: suggestionsError instanceof Error ? suggestionsError.message : null,
  };
}
