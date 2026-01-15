'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Tag, X, ChevronDown } from 'lucide-react';
import { useTagSuggestion } from '@/hooks/useTagSuggestion';
import { Badge } from '@/components/atoms';

interface TagAutocompleteProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

// 태그 정규화 (특수문자 제거, 소문자 변환)
function normalizeTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
}

export default function TagAutocomplete({
  selectedTags,
  onTagsChange,
  maxTags = 5,
}: TagAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const {
    setQuery,
    clearQuery,
    suggestions,
    popularTags,
    isLoading,
  } = useTagSuggestion();

  // 표시할 목록 결정 (검색 결과 또는 인기 태그)
  const displayItems = useMemo(() => {
    if (inputValue.length >= 2) {
      return suggestions;
    }
    return popularTags;
  }, [inputValue, suggestions, popularTags]);

  const isMaxReached = selectedTags.length >= maxTags;

  // 입력값 변경 시 검색 쿼리 업데이트
  useEffect(() => {
    if (inputValue.length >= 2) {
      setQuery(inputValue);
    }
  }, [inputValue, setQuery]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 태그 추가
  const addTag = useCallback(
    (tag: string) => {
      const normalized = normalizeTag(tag);

      // 유효성 검사
      if (!normalized) return;
      if (selectedTags.includes(normalized)) return;
      if (selectedTags.length >= maxTags) return;

      onTagsChange([...selectedTags, normalized]);
      setInputValue('');
      clearQuery();
      setHighlightedIndex(-1);
    },
    [selectedTags, maxTags, onTagsChange, clearQuery]
  );

  // 태그 삭제
  const removeTag = useCallback(
    (tagToRemove: string) => {
      onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
    },
    [selectedTags, onTagsChange]
  );

  // 키보드 핸들링
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0 && displayItems[highlightedIndex]) {
            addTag(displayItems[highlightedIndex].name);
          } else if (inputValue) {
            addTag(inputValue);
          }
          break;

        case 'Backspace':
          if (!inputValue && selectedTags.length > 0) {
            removeTag(selectedTags[selectedTags.length - 1]);
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          }
          setHighlightedIndex((prev) =>
            prev < displayItems.length - 1 ? prev + 1 : prev
          );
          break;

        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;

        case 'Escape':
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    },
    [
      highlightedIndex,
      displayItems,
      inputValue,
      selectedTags,
      addTag,
      removeTag,
      isOpen,
    ]
  );

  // 포커스 시 드롭다운 열기
  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  // 항목 클릭
  const handleItemClick = useCallback(
    (tag: string) => {
      if (!selectedTags.includes(tag)) {
        addTag(tag);
      }
    },
    [selectedTags, addTag]
  );

  return (
    <div className="relative">
      {/* 라벨 */}
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
        <Tag className="w-4 h-4 inline mr-1" />
        태그 <span className="text-[var(--text-tertiary)]">(최대 {maxTags}개)</span>
      </label>

      {/* 선택된 태그 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-[var(--color-error-500)] transition-colors"
                aria-label={`${tag} 태그 삭제`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* 입력 필드 */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={isMaxReached ? '태그 최대 개수 도달' : '태그 입력...'}
          disabled={isMaxReached}
          aria-label="태그 입력"
          aria-autocomplete="list"
          aria-controls="tag-suggestions"
          aria-expanded={isOpen}
          className={`w-full px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-colors ${
            isMaxReached ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* 최대 개수 경고 */}
      {isMaxReached && (
        <p className="mt-1 text-xs text-[var(--color-warning-500)]">
          최대 {maxTags}개까지 추가할 수 있습니다
        </p>
      )}

      {/* 자동완성 드롭다운 */}
      {isOpen && displayItems.length > 0 && !isMaxReached && (
        <ul
          ref={listRef}
          id="tag-suggestions"
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-md)] shadow-lg max-h-60 overflow-y-auto"
        >
          {/* 인기 태그 헤더 (검색어가 없을 때만) */}
          {inputValue.length < 2 && (
            <li className="px-4 py-2 text-xs font-medium text-[var(--text-tertiary)] bg-[var(--bg-hover)]">
              인기 태그
            </li>
          )}

          {displayItems.map((item, index) => {
            const isSelected = selectedTags.includes(item.name);
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={item.name}
                role="option"
                aria-selected={isHighlighted}
                aria-disabled={isSelected}
                onClick={() => handleItemClick(item.name)}
                className={`px-4 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                  isHighlighted ? 'bg-[var(--bg-hover)]' : ''
                } ${
                  isSelected
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[var(--bg-hover)]'
                }`}
              >
                <span className="text-[var(--text-primary)]">{item.name}</span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {item.count}회 사용
                </span>
              </li>
            );
          })}

          {/* 로딩 표시 */}
          {isLoading && (
            <li className="px-4 py-2 text-sm text-[var(--text-tertiary)] text-center">
              검색 중...
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
