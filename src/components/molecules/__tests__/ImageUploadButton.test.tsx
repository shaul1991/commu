/**
 * ImageUploadButton 컴포넌트 테스트
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ImageUploadButton from '../ImageUploadButton';

// Mock useImageUpload hook
const mockUpload = vi.fn();
const mockClearError = vi.fn();
const mockReset = vi.fn();

let mockHookState = {
  upload: mockUpload,
  isUploading: false,
  progress: 0,
  error: null as string | null,
  uploadedImages: [],
  clearError: mockClearError,
  reset: mockReset,
};

vi.mock('@/hooks/useImageUpload', () => ({
  useImageUpload: () => mockHookState,
}));

describe('ImageUploadButton', () => {
  const defaultProps = {
    onImagesChange: vi.fn(),
    maxImages: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockHookState = {
      upload: mockUpload,
      isUploading: false,
      progress: 0,
      error: null,
      uploadedImages: [],
      clearError: mockClearError,
      reset: mockReset,
    };
  });

  describe('기본 렌더링', () => {
    it('업로드 버튼이 렌더링됨', () => {
      render(<ImageUploadButton {...defaultProps} />);
      expect(screen.getByText(/이미지 추가/)).toBeInTheDocument();
    });

    it('최대 업로드 개수가 표시됨', () => {
      render(<ImageUploadButton {...defaultProps} maxImages={10} />);
      expect(screen.getByText(/최대 10장/)).toBeInTheDocument();
    });

    it('허용 형식 안내가 표시됨', () => {
      render(<ImageUploadButton {...defaultProps} />);
      expect(screen.getByText(/JPG, PNG, GIF, WebP/)).toBeInTheDocument();
    });
  });

  describe('파일 선택', () => {
    it('버튼 클릭 시 파일 선택 다이얼로그 열림', () => {
      render(<ImageUploadButton {...defaultProps} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = vi.spyOn(input, 'click');

      const button = screen.getByText(/이미지 추가/).closest('button');
      fireEvent.click(button!);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('파일 선택 시 upload 함수 호출', async () => {
      mockUpload.mockResolvedValue([
        { id: '1', url: 'https://example.com/image.jpg', filename: 'image.jpg', size: 1000, mimeType: 'image/jpeg' },
      ]);

      render(<ImageUploadButton {...defaultProps} />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      Object.defineProperty(input, 'files', {
        value: [file],
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(mockUpload).toHaveBeenCalledWith([file]);
      });
    });

    it('여러 파일 선택 가능', () => {
      render(<ImageUploadButton {...defaultProps} />);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toHaveAttribute('multiple');
    });

    it('이미지 파일만 허용', () => {
      render(<ImageUploadButton {...defaultProps} />);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toHaveAttribute('accept', 'image/jpeg,image/png,image/gif,image/webp');
    });
  });

  describe('업로드된 이미지 표시', () => {
    it('업로드된 이미지 썸네일이 표시됨', () => {
      const images = ['https://example.com/1.jpg', 'https://example.com/2.jpg'];
      render(<ImageUploadButton {...defaultProps} images={images} />);

      const thumbnails = screen.getAllByRole('img');
      expect(thumbnails).toHaveLength(2);
    });

    it('이미지 삭제 버튼 클릭 시 onImagesChange 호출', () => {
      const onImagesChange = vi.fn();
      const images = ['https://example.com/1.jpg', 'https://example.com/2.jpg'];
      render(<ImageUploadButton {...defaultProps} images={images} onImagesChange={onImagesChange} />);

      const deleteButtons = screen.getAllByRole('button', { name: /삭제/ });
      fireEvent.click(deleteButtons[0]);

      expect(onImagesChange).toHaveBeenCalledWith(['https://example.com/2.jpg']);
    });
  });

  describe('업로드 상태', () => {
    it('업로드 중일 때 로딩 표시', () => {
      mockHookState.isUploading = true;
      mockHookState.progress = 50;

      render(<ImageUploadButton {...defaultProps} />);
      expect(screen.getByText(/업로드 중/)).toBeInTheDocument();
    });

    it('업로드 진행률 표시', () => {
      mockHookState.isUploading = true;
      mockHookState.progress = 75;

      render(<ImageUploadButton {...defaultProps} />);
      expect(screen.getByText(/75%/)).toBeInTheDocument();
    });

    it('업로드 에러 표시', () => {
      mockHookState.error = '파일 크기가 너무 큽니다';

      render(<ImageUploadButton {...defaultProps} />);
      expect(screen.getByText(/파일 크기가 너무 큽니다/)).toBeInTheDocument();
    });
  });

  describe('최대 개수 제한', () => {
    it('최대 개수 도달 시 버튼 비활성화', () => {
      const images = Array(10).fill('https://example.com/image.jpg');
      render(<ImageUploadButton {...defaultProps} images={images} maxImages={10} />);

      const button = screen.getByText(/이미지 추가/).closest('button');
      expect(button).toBeDisabled();
    });

    it('남은 업로드 가능 개수 표시', () => {
      const images = ['https://example.com/1.jpg', 'https://example.com/2.jpg'];
      render(<ImageUploadButton {...defaultProps} images={images} maxImages={10} />);

      expect(screen.getByText(/2 \/ 10/)).toBeInTheDocument();
    });
  });

  describe('드래그 앤 드롭', () => {
    it('드래그 영역에 파일 드롭 시 업로드', async () => {
      mockUpload.mockResolvedValue([
        { id: '1', url: 'https://example.com/image.jpg', filename: 'image.jpg', size: 1000, mimeType: 'image/jpeg' },
      ]);

      render(<ImageUploadButton {...defaultProps} />);

      const dropZone = screen.getByTestId('drop-zone');
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(mockUpload).toHaveBeenCalledWith([file]);
      });
    });

    it('드래그 오버 시 하이라이트 표시', () => {
      render(<ImageUploadButton {...defaultProps} />);

      const dropZone = screen.getByTestId('drop-zone');
      fireEvent.dragOver(dropZone);

      expect(dropZone).toHaveClass('border-[var(--color-primary-500)]');
    });

    it('드래그 리브 시 하이라이트 제거', () => {
      render(<ImageUploadButton {...defaultProps} />);

      const dropZone = screen.getByTestId('drop-zone');
      fireEvent.dragOver(dropZone);
      fireEvent.dragLeave(dropZone);

      expect(dropZone).not.toHaveClass('border-[var(--color-primary-500)]');
    });
  });

  describe('접근성', () => {
    it('파일 입력에 aria-label 설정', () => {
      render(<ImageUploadButton {...defaultProps} />);
      const input = document.querySelector('input[type="file"]');
      expect(input).toHaveAttribute('aria-label');
    });

    it('삭제 버튼에 aria-label 설정', () => {
      const images = ['https://example.com/1.jpg'];
      render(<ImageUploadButton {...defaultProps} images={images} />);

      const deleteButton = screen.getByRole('button', { name: /삭제/ });
      expect(deleteButton).toHaveAttribute('aria-label');
    });
  });
});
