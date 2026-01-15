import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, MockedFunction } from 'vitest';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import WritePage from '../page';
import { useRequireAuth } from '@/hooks';
import { useCreatePost } from '@/hooks/usePost';

// Mock hooks
vi.mock('@/hooks', () => ({
  useRequireAuth: vi.fn(),
}));

vi.mock('@/hooks/usePost', () => ({
  useCreatePost: vi.fn(),
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock components
vi.mock('@/components/templates', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

vi.mock('@/components/atoms', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
  Badge: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <span className={className}>{children}</span>,
}));

// Mock molecules components
vi.mock('@/components/molecules', () => ({
  PreviewModal: ({ isOpen, onClose, title }: { isOpen: boolean; onClose: () => void; title: string }) =>
    isOpen ? (
      <div data-testid="preview-modal">
        <span>{title}</span>
        <button onClick={onClose}>닫기</button>
      </div>
    ) : null,
  ReferenceUrlInput: ({ value, onChange }: { value: string; onChange: (url: string) => void }) => (
    <div data-testid="reference-url-input">
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://"
      />
    </div>
  ),
  TagAutocomplete: ({
    selectedTags,
    onTagsChange,
    maxTags,
  }: {
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    maxTags: number;
  }) => (
    <div data-testid="tag-autocomplete">
      <input
        type="text"
        placeholder="태그 입력 후 Enter"
        disabled={selectedTags.length >= maxTags}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const target = e.target as HTMLInputElement;
            if (target.value.trim() && selectedTags.length < maxTags) {
              onTagsChange([...selectedTags, target.value.trim()]);
              target.value = '';
            }
          }
        }}
      />
      <button
        onClick={() => {
          const input = document.querySelector('[placeholder="태그 입력 후 Enter"]') as HTMLInputElement;
          if (input && input.value.trim() && selectedTags.length < maxTags) {
            onTagsChange([...selectedTags, input.value.trim()]);
            input.value = '';
          }
        }}
      >
        추가
      </button>
      <div>
        {selectedTags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
    </div>
  ),
  ImageUploadButton: ({
    images,
    onImagesChange,
    maxImages,
  }: {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages: number;
  }) => (
    <div data-testid="image-upload-button">
      <button disabled={images.length >= maxImages}>이미지 추가</button>
      <span>{images.length} / {maxImages}</span>
    </div>
  ),
}));

const mockUseRequireAuth = useRequireAuth as MockedFunction<typeof useRequireAuth>;
const mockUseCreatePost = useCreatePost as MockedFunction<typeof useCreatePost>;

// QueryClient wrapper
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

describe('Write Page', () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockMutate.mockClear();
    mockPush.mockClear();

    mockUseCreatePost.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
      data: undefined,
      variables: undefined,
      reset: vi.fn(),
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isIdle: true,
      isPaused: false,
      status: 'idle',
      submittedAt: 0,
      mutateAsync: vi.fn(),
    });
  });

  describe('로딩 상태', () => {
    it('로딩 중일 때 로딩 스피너 표시', () => {
      mockUseRequireAuth.mockReturnValue({
        user: null,
        isLoading: true,
        isAuthenticated: false,
      });

      render(<WritePage />, { wrapper: createTestWrapper() });

      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    it('비로그인 상태일 때 로딩 스피너 표시', () => {
      mockUseRequireAuth.mockReturnValue({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      render(<WritePage />, { wrapper: createTestWrapper() });

      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });
  });

  describe('로그인 상태에서 글 작성 폼 표시', () => {
    beforeEach(() => {
      mockUseRequireAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          isEmailVerified: true,
        },
        isLoading: false,
        isAuthenticated: true,
      });
    });

    it('글 작성 폼이 표시됨', () => {
      render(<WritePage />, { wrapper: createTestWrapper() });

      expect(screen.getByText('새 글 작성')).toBeInTheDocument();
      expect(screen.getByText('채널 선택 *')).toBeInTheDocument();
      expect(screen.getByText('제목 *')).toBeInTheDocument();
      expect(screen.getByText('내용 *')).toBeInTheDocument();
    });

    it('채널 목록이 표시됨', () => {
      render(<WritePage />, { wrapper: createTestWrapper() });

      expect(screen.getByText('일반')).toBeInTheDocument();
      expect(screen.getByText('기술')).toBeInTheDocument();
      expect(screen.getByText('커리어')).toBeInTheDocument();
      expect(screen.getByText('질문')).toBeInTheDocument();
      expect(screen.getByText('일상')).toBeInTheDocument();
    });

    it('필수 필드가 비어있으면 게시하기 버튼이 비활성화됨', () => {
      render(<WritePage />, { wrapper: createTestWrapper() });

      const submitButtons = screen.getAllByText('게시하기');
      submitButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('채널을 선택할 수 있음', async () => {
      const user = userEvent.setup();
      render(<WritePage />, { wrapper: createTestWrapper() });

      const techChannel = screen.getByText('기술');
      await user.click(techChannel);

      // 선택된 채널은 스타일이 변경됨 (클래스에 primary가 포함)
      expect(techChannel.className).toContain('bg-[var(--color-primary-500)]');
    });

    it('제목을 입력할 수 있음', async () => {
      const user = userEvent.setup();
      render(<WritePage />, { wrapper: createTestWrapper() });

      const titleInput = screen.getByPlaceholderText('제목을 입력하세요');
      await user.type(titleInput, '테스트 제목');

      expect(titleInput).toHaveValue('테스트 제목');
    });

    it('내용을 입력할 수 있음', async () => {
      const user = userEvent.setup();
      render(<WritePage />, { wrapper: createTestWrapper() });

      const contentInput = screen.getByPlaceholderText(
        '내용을 입력하세요. 마크다운 문법을 지원합니다.'
      );
      await user.type(contentInput, '테스트 내용입니다.');

      expect(contentInput).toHaveValue('테스트 내용입니다.');
    });

    it('제목 글자수 카운터가 표시됨', async () => {
      const user = userEvent.setup();
      render(<WritePage />, { wrapper: createTestWrapper() });

      expect(screen.getByText('0/100')).toBeInTheDocument();

      const titleInput = screen.getByPlaceholderText('제목을 입력하세요');
      await user.type(titleInput, '테스트');

      expect(screen.getByText('3/100')).toBeInTheDocument();
    });
  });

  describe('태그 기능', () => {
    beforeEach(() => {
      mockUseRequireAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          isEmailVerified: true,
        },
        isLoading: false,
        isAuthenticated: true,
      });
    });

    it('태그를 추가할 수 있음', async () => {
      const user = userEvent.setup();
      render(<WritePage />, { wrapper: createTestWrapper() });

      const tagInput = screen.getByPlaceholderText('태그 입력 후 Enter');
      await user.type(tagInput, 'javascript');

      const addButton = screen.getByText('추가');
      await user.click(addButton);

      expect(screen.getByText('#javascript')).toBeInTheDocument();
    });

    it('Enter 키로 태그를 추가할 수 있음', async () => {
      const user = userEvent.setup();
      render(<WritePage />, { wrapper: createTestWrapper() });

      const tagInput = screen.getByPlaceholderText('태그 입력 후 Enter');
      await user.type(tagInput, 'react{enter}');

      expect(screen.getByText('#react')).toBeInTheDocument();
    });

    it('최대 5개까지 태그 추가 가능', async () => {
      const user = userEvent.setup();
      render(<WritePage />, { wrapper: createTestWrapper() });

      const tagInput = screen.getByPlaceholderText('태그 입력 후 Enter');

      for (let i = 1; i <= 5; i++) {
        await user.type(tagInput, `tag${i}{enter}`);
      }

      // 5개 모두 추가되어야 함
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(`#tag${i}`)).toBeInTheDocument();
      }

      // 태그 입력 필드가 비활성화됨
      expect(tagInput).toBeDisabled();
    });
  });

  describe('게시글 작성 제출', () => {
    beforeEach(() => {
      mockUseRequireAuth.mockReturnValue({
        user: {
          id: '1',
          email: 'test@example.com',
          isEmailVerified: true,
        },
        isLoading: false,
        isAuthenticated: true,
      });
    });

    it('모든 필수 필드가 채워지면 게시하기 버튼이 활성화됨', async () => {
      const user = userEvent.setup();
      render(<WritePage />, { wrapper: createTestWrapper() });

      // 채널 선택
      await user.click(screen.getByText('기술'));

      // 제목 입력
      const titleInput = screen.getByPlaceholderText('제목을 입력하세요');
      await user.type(titleInput, '테스트 제목');

      // 내용 입력
      const contentInput = screen.getByPlaceholderText(
        '내용을 입력하세요. 마크다운 문법을 지원합니다.'
      );
      await user.type(contentInput, '테스트 내용');

      // 버튼 활성화 확인 (데스크톱 버튼)
      const submitButtons = screen.getAllByText('게시하기');
      expect(submitButtons[0]).not.toBeDisabled();
    });

    it('게시하기 버튼 클릭 시 createPost가 호출됨', async () => {
      const user = userEvent.setup();
      render(<WritePage />, { wrapper: createTestWrapper() });

      // 채널 선택
      await user.click(screen.getByText('기술'));

      // 제목 입력
      const titleInput = screen.getByPlaceholderText('제목을 입력하세요');
      await user.type(titleInput, '테스트 제목');

      // 내용 입력
      const contentInput = screen.getByPlaceholderText(
        '내용을 입력하세요. 마크다운 문법을 지원합니다.'
      );
      await user.type(contentInput, '테스트 내용');

      // 게시하기 버튼 클릭
      const submitButtons = screen.getAllByText('게시하기');
      await user.click(submitButtons[0]);

      // mutate 호출 확인 - images와 referenceUrl도 포함
      // TODO: 백엔드 채널 API 구현 후 channelSlug 테스트 복원
      expect(mockMutate).toHaveBeenCalledWith(
        {
          title: '테스트 제목',
          content: '테스트 내용',
          tags: [],
          images: undefined,
          referenceUrl: undefined,
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
        })
      );
    });

    it('태그와 함께 게시글 작성', async () => {
      const user = userEvent.setup();
      render(<WritePage />, { wrapper: createTestWrapper() });

      // 채널 선택
      await user.click(screen.getByText('기술'));

      // 제목 입력
      const titleInput = screen.getByPlaceholderText('제목을 입력하세요');
      await user.type(titleInput, '테스트 제목');

      // 내용 입력
      const contentInput = screen.getByPlaceholderText(
        '내용을 입력하세요. 마크다운 문법을 지원합니다.'
      );
      await user.type(contentInput, '테스트 내용');

      // 태그 추가
      const tagInput = screen.getByPlaceholderText('태그 입력 후 Enter');
      await user.type(tagInput, 'javascript{enter}');
      await user.type(tagInput, 'react{enter}');

      // 게시하기 버튼 클릭
      const submitButtons = screen.getAllByText('게시하기');
      await user.click(submitButtons[0]);

      // mutate 호출 확인
      // TODO: 백엔드 채널 API 구현 후 channelSlug 테스트 복원
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '테스트 제목',
          content: '테스트 내용',
          tags: ['javascript', 'react'],
        }),
        expect.any(Object)
      );
    });

    it('게시글 작성 성공 시 상세 페이지로 이동', async () => {
      const user = userEvent.setup();

      // mutate가 호출되면 onSuccess 콜백 실행
      mockMutate.mockImplementation((data, options) => {
        if (options?.onSuccess) {
          options.onSuccess({ data: { id: 'new-post-123' } });
        }
      });

      render(<WritePage />, { wrapper: createTestWrapper() });

      // 채널 선택
      await user.click(screen.getByText('기술'));

      // 제목/내용 입력
      await user.type(screen.getByPlaceholderText('제목을 입력하세요'), '테스트 제목');
      await user.type(
        screen.getByPlaceholderText('내용을 입력하세요. 마크다운 문법을 지원합니다.'),
        '테스트 내용'
      );

      // 게시하기 버튼 클릭
      const submitButtons = screen.getAllByText('게시하기');
      await user.click(submitButtons[0]);

      // router.push 호출 확인
      expect(mockPush).toHaveBeenCalledWith('/posts/new-post-123');
    });

    it('게시 중일 때 버튼이 비활성화되고 로딩 표시', () => {
      mockUseCreatePost.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
        isError: false,
        isSuccess: false,
        error: null,
        data: undefined,
        variables: undefined,
        reset: vi.fn(),
        context: undefined,
        failureCount: 0,
        failureReason: null,
        isIdle: false,
        isPaused: false,
        status: 'pending',
        submittedAt: Date.now(),
        mutateAsync: vi.fn(),
      });

      render(<WritePage />, { wrapper: createTestWrapper() });

      // '게시 중...' 텍스트 표시 확인
      expect(screen.getAllByText('게시 중...').length).toBeGreaterThan(0);
    });
  });
});
