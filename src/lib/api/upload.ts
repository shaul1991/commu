/**
 * Upload API
 * 이미지 업로드 관련 함수들
 */

import { apiClient } from './client';
import type { ApiResponse, UploadedImage } from '@/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB
const MAX_FILES = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export interface ImageUploadError {
  code: 'FILE_TOO_LARGE' | 'INVALID_FILE_FORMAT' | 'TOO_MANY_FILES' | 'TOTAL_SIZE_EXCEEDED';
  message: string;
}

/**
 * 파일 유효성 검사
 */
export function validateFiles(files: File[]): ImageUploadError | null {
  if (files.length > MAX_FILES) {
    return {
      code: 'TOO_MANY_FILES',
      message: `최대 ${MAX_FILES}개까지 업로드할 수 있습니다.`,
    };
  }

  let totalSize = 0;
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return {
        code: 'FILE_TOO_LARGE',
        message: `파일 크기가 10MB를 초과합니다: ${file.name}`,
      };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        code: 'INVALID_FILE_FORMAT',
        message: `지원하지 않는 파일 형식입니다: ${file.name}`,
      };
    }

    totalSize += file.size;
  }

  if (totalSize > MAX_TOTAL_SIZE) {
    return {
      code: 'TOTAL_SIZE_EXCEEDED',
      message: '총 파일 크기가 30MB를 초과합니다.',
    };
  }

  return null;
}

/**
 * 이미지 업로드
 */
export async function uploadImages(
  files: File[]
): Promise<ApiResponse<{ images: UploadedImage[] }>> {
  const validationError = validateFiles(files);
  if (validationError) {
    throw new Error(validationError.message);
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await apiClient.post<{ images: UploadedImage[] }>(
    '/upload/images',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (!response.success) {
    throw new Error(response.error?.message || '이미지 업로드에 실패했습니다.');
  }

  return {
    success: true,
    data: response.data!,
  };
}
