/**
 * TagAutocomplete 컴포넌트 테스트
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import TagAutocomplete from '../TagAutocomplete';

// Mock useTagSuggestion hook
vi.mock('@/hooks/useTagSuggestion', () => ({
  useTagSuggestion: () => ({
    query: '',
    setQuery: vi.fn(),
    clearQuery: vi.fn(),
    suggestions: [
      { name: 'react', count: 150 },
      { name: 'reactnative', count: 80 },
      { name: 'redux', count: 60 },
    ],
    popularTags: [
      { name: 'javascript', count: 500 },
      { name: 'typescript', count: 400 },
      { name: 'nextjs', count: 300 },
    ],
    isLoading: false,
    error: null,
  }),
}));

describe('TagAutocomplete', () => {
  const defaultProps = {
    selectedTags: [],
    onTagsChange: vi.fn(),
    maxTags: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('기본 렌더링', () => {
    it('입력 필드가 렌더링됨', () => {
      render(<TagAutocomplete {...defaultProps} />);
      expect(screen.getByPlaceholderText(/태그 입력/)).toBeInTheDocument();
    });

    it('라벨이 표시됨', () => {
      render(<TagAutocomplete {...defaultProps} />);
      expect(screen.getByText(/태그/)).toBeInTheDocument();
    });

    it('최대 개수 안내가 표시됨', () => {
      render(<TagAutocomplete {...defaultProps} maxTags={5} />);
      expect(screen.getByText(/최대 5개/)).toBeInTheDocument();
    });
  });

  describe('선택된 태그 표시', () => {
    it('선택된 태그들이 Badge로 표시됨', () => {
      render(<TagAutocomplete {...defaultProps} selectedTags={['react', 'typescript']} />);
      expect(screen.getByText('#react')).toBeInTheDocument();
      expect(screen.getByText('#typescript')).toBeInTheDocument();
    });

    it('태그 삭제 버튼 클릭 시 onTagsChange 호출', () => {
      const onTagsChange = vi.fn();
      render(
        <TagAutocomplete
          {...defaultProps}
          selectedTags={['react', 'typescript']}
          onTagsChange={onTagsChange}
        />
      );

      // react 태그의 삭제 버튼 클릭
      const removeButtons = screen.getAllByRole('button', { name: /삭제/ });
      fireEvent.click(removeButtons[0]);

      expect(onTagsChange).toHaveBeenCalledWith(['typescript']);
    });
  });

  describe('자동완성 드롭다운', () => {
    it('입력 시 자동완성 목록이 표시됨', async () => {
      render(<TagAutocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText(/태그 입력/);

      await userEvent.type(input, 'rea');

      await waitFor(() => {
        expect(screen.getByText('react')).toBeInTheDocument();
      });
    });

    it('추천 태그 클릭 시 태그 추가', async () => {
      const onTagsChange = vi.fn();
      render(<TagAutocomplete {...defaultProps} onTagsChange={onTagsChange} />);

      const input = screen.getByPlaceholderText(/태그 입력/);
      await userEvent.type(input, 'rea');

      await waitFor(() => {
        expect(screen.getByText('react')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('react'));
      expect(onTagsChange).toHaveBeenCalledWith(['react']);
    });

    it('이미 선택된 태그는 목록에서 비활성화 표시', async () => {
      render(<TagAutocomplete {...defaultProps} selectedTags={['react']} />);
      const input = screen.getByPlaceholderText(/태그 입력/);

      await userEvent.type(input, 'rea');

      await waitFor(() => {
        const reactItem = screen.getByText('react').closest('li');
        expect(reactItem).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('인기 태그', () => {
    it('입력 포커스 시 인기 태그가 표시됨', async () => {
      render(<TagAutocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText(/태그 입력/);

      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText(/인기 태그/)).toBeInTheDocument();
        expect(screen.getByText('javascript')).toBeInTheDocument();
      });
    });

    it('인기 태그 클릭 시 태그 추가', async () => {
      const onTagsChange = vi.fn();
      render(<TagAutocomplete {...defaultProps} onTagsChange={onTagsChange} />);

      const input = screen.getByPlaceholderText(/태그 입력/);
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('javascript')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('javascript'));
      expect(onTagsChange).toHaveBeenCalledWith(['javascript']);
    });
  });

  describe('키보드 네비게이션', () => {
    it('Enter 키로 현재 입력값을 태그로 추가', async () => {
      const onTagsChange = vi.fn();
      render(<TagAutocomplete {...defaultProps} onTagsChange={onTagsChange} />);

      const input = screen.getByPlaceholderText(/태그 입력/);
      await userEvent.type(input, 'newtag{Enter}');

      expect(onTagsChange).toHaveBeenCalledWith(['newtag']);
    });

    it('Backspace 키로 마지막 태그 삭제 (입력 비어있을 때)', async () => {
      const onTagsChange = vi.fn();
      render(
        <TagAutocomplete
          {...defaultProps}
          selectedTags={['react', 'typescript']}
          onTagsChange={onTagsChange}
        />
      );

      const input = screen.getByPlaceholderText(/태그 입력/);
      fireEvent.focus(input);
      fireEvent.keyDown(input, { key: 'Backspace' });

      expect(onTagsChange).toHaveBeenCalledWith(['react']);
    });

    it('ArrowDown/ArrowUp으로 목록 탐색', async () => {
      render(<TagAutocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText(/태그 입력/);

      await userEvent.type(input, 'rea');

      await waitFor(() => {
        expect(screen.getByText('react')).toBeInTheDocument();
      });

      // ArrowDown으로 첫 번째 항목 선택
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const firstItem = screen.getByText('react').closest('li');
      expect(firstItem).toHaveAttribute('aria-selected', 'true');
    });

    it('Escape 키로 드롭다운 닫기', async () => {
      render(<TagAutocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText(/태그 입력/);

      await userEvent.type(input, 'rea');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'Escape' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('최대 태그 개수 제한', () => {
    it('최대 개수에 도달하면 입력 비활성화', () => {
      render(
        <TagAutocomplete
          {...defaultProps}
          selectedTags={['tag1', 'tag2', 'tag3', 'tag4', 'tag5']}
          maxTags={5}
        />
      );

      // 최대 개수 도달 시 placeholder가 변경됨
      const input = screen.getByPlaceholderText(/최대 개수 도달/);
      expect(input).toBeDisabled();
    });

    it('최대 개수 초과 시 경고 메시지 표시', () => {
      render(
        <TagAutocomplete
          {...defaultProps}
          selectedTags={['tag1', 'tag2', 'tag3', 'tag4', 'tag5']}
          maxTags={5}
        />
      );

      expect(screen.getByText(/최대 5개까지/)).toBeInTheDocument();
    });
  });

  describe('태그 유효성 검사', () => {
    it('빈 태그는 추가되지 않음', async () => {
      const onTagsChange = vi.fn();
      render(<TagAutocomplete {...defaultProps} onTagsChange={onTagsChange} />);

      const input = screen.getByPlaceholderText(/태그 입력/);
      await userEvent.type(input, '   {Enter}');

      expect(onTagsChange).not.toHaveBeenCalled();
    });

    it('중복 태그는 추가되지 않음', async () => {
      const onTagsChange = vi.fn();
      render(
        <TagAutocomplete
          {...defaultProps}
          selectedTags={['react']}
          onTagsChange={onTagsChange}
        />
      );

      const input = screen.getByPlaceholderText(/태그 입력/);
      await userEvent.type(input, 'react{Enter}');

      expect(onTagsChange).not.toHaveBeenCalled();
    });

    it('특수문자가 제거됨', async () => {
      const onTagsChange = vi.fn();
      render(<TagAutocomplete {...defaultProps} onTagsChange={onTagsChange} />);

      const input = screen.getByPlaceholderText(/태그 입력/);
      await userEvent.type(input, 'my@tag#{Enter}');

      expect(onTagsChange).toHaveBeenCalledWith(['mytag']);
    });
  });

  describe('접근성', () => {
    it('aria-label이 설정됨', () => {
      render(<TagAutocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText(/태그 입력/);
      expect(input).toHaveAttribute('aria-label');
    });

    it('자동완성 목록에 role="listbox" 설정', async () => {
      render(<TagAutocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText(/태그 입력/);

      await userEvent.type(input, 'rea');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('선택된 항목에 aria-selected 설정', async () => {
      render(<TagAutocomplete {...defaultProps} />);
      const input = screen.getByPlaceholderText(/태그 입력/);

      await userEvent.type(input, 'rea');

      await waitFor(() => {
        expect(screen.getByText('react')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const firstItem = screen.getByText('react').closest('li');
      expect(firstItem).toHaveAttribute('aria-selected', 'true');
    });
  });
});
