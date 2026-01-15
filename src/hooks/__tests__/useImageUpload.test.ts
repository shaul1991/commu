/**
 * useImageUpload 훅 테스트
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useImageUpload } from '../useImageUpload';
import * as uploadApi from '@/lib/api/upload';

// Mock API
vi.mock('@/lib/api/upload', () => ({
  uploadImages: vi.fn(),
  validateFiles: vi.fn(),
}));

const mockUploadImages = uploadApi.uploadImages as ReturnType<typeof vi.fn>;
const mockValidateFiles = uploadApi.validateFiles as ReturnType<typeof vi.fn>;

describe('useImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockValidateFiles.mockReturnValue(null);
  });

  const createMockFile = (name: string, size: number = 1024, type: string = 'image/jpeg') => {
    const file = new File([''], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  it('초기 상태가 올바름', () => {
    const { result } = renderHook(() => useImageUpload());

    expect(result.current.isUploading).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.error).toBeNull();
    expect(result.current.uploadedImages).toEqual([]);
  });

  it('파일 선택 시 업로드 시작', async () => {
    const mockImages = [
      { id: '1', url: 'https://example.com/1.jpg', filename: 'test.jpg', size: 1024, mimeType: 'image/jpeg' },
    ];
    mockUploadImages.mockResolvedValue({ success: true, data: { images: mockImages } });

    const { result } = renderHook(() => useImageUpload());
    const file = createMockFile('test.jpg');

    await act(async () => {
      await result.current.upload([file]);
    });

    expect(mockUploadImages).toHaveBeenCalledWith([file]);
    expect(result.current.uploadedImages).toEqual(mockImages);
  });

  it('업로드 중 isUploading이 true', async () => {
    let resolveUpload: (value: unknown) => void;
    mockUploadImages.mockImplementation(() => new Promise((resolve) => {
      resolveUpload = resolve;
    }));

    const { result } = renderHook(() => useImageUpload());
    const file = createMockFile('test.jpg');

    act(() => {
      result.current.upload([file]);
    });

    expect(result.current.isUploading).toBe(true);

    await act(async () => {
      resolveUpload!({ success: true, data: { images: [] } });
    });

    expect(result.current.isUploading).toBe(false);
  });

  it('업로드 완료 시 URL 배열 반환', async () => {
    const mockImages = [
      { id: '1', url: 'https://example.com/1.jpg', filename: 'test1.jpg', size: 1024, mimeType: 'image/jpeg' },
      { id: '2', url: 'https://example.com/2.jpg', filename: 'test2.jpg', size: 2048, mimeType: 'image/jpeg' },
    ];
    mockUploadImages.mockResolvedValue({ success: true, data: { images: mockImages } });

    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.upload([createMockFile('test1.jpg'), createMockFile('test2.jpg')]);
    });

    expect(result.current.uploadedImages).toHaveLength(2);
    expect(result.current.uploadedImages[0].url).toBe('https://example.com/1.jpg');
  });

  it('업로드 실패 시 에러 반환', async () => {
    mockUploadImages.mockRejectedValue(new Error('업로드 실패'));

    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.upload([createMockFile('test.jpg')]);
    });

    expect(result.current.error).toBe('업로드 실패');
    expect(result.current.isUploading).toBe(false);
  });

  it('10MB 초과 파일 거부', async () => {
    mockValidateFiles.mockReturnValue({
      code: 'FILE_TOO_LARGE',
      message: '파일 크기가 10MB를 초과합니다.',
    });

    const { result } = renderHook(() => useImageUpload());
    const largeFile = createMockFile('large.jpg', 11 * 1024 * 1024);

    await act(async () => {
      await result.current.upload([largeFile]);
    });

    expect(result.current.error).toBe('파일 크기가 10MB를 초과합니다.');
    expect(mockUploadImages).not.toHaveBeenCalled();
  });

  it('지원하지 않는 형식 거부', async () => {
    mockValidateFiles.mockReturnValue({
      code: 'INVALID_FILE_FORMAT',
      message: '지원하지 않는 파일 형식입니다.',
    });

    const { result } = renderHook(() => useImageUpload());
    const pdfFile = createMockFile('doc.pdf', 1024, 'application/pdf');

    await act(async () => {
      await result.current.upload([pdfFile]);
    });

    expect(result.current.error).toBe('지원하지 않는 파일 형식입니다.');
  });

  it('10장 초과 거부', async () => {
    mockValidateFiles.mockReturnValue({
      code: 'TOO_MANY_FILES',
      message: '최대 10개까지 업로드할 수 있습니다.',
    });

    const { result } = renderHook(() => useImageUpload());
    const files = Array.from({ length: 11 }, (_, i) => createMockFile(`file${i}.jpg`));

    await act(async () => {
      await result.current.upload(files);
    });

    expect(result.current.error).toBe('최대 10개까지 업로드할 수 있습니다.');
  });

  it('에러 초기화', async () => {
    mockValidateFiles.mockReturnValue({
      code: 'FILE_TOO_LARGE',
      message: '파일 크기가 10MB를 초과합니다.',
    });

    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.upload([createMockFile('large.jpg', 11 * 1024 * 1024)]);
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
