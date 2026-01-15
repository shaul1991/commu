'use client';

import { useState, useCallback } from 'react';
import { uploadImages, validateFiles } from '@/lib/api/upload';
import type { UploadedImage } from '@/types';

interface UseImageUploadReturn {
  upload: (files: File[]) => Promise<UploadedImage[]>;
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadedImages: UploadedImage[];
  clearError: () => void;
  reset: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const upload = useCallback(async (files: File[]): Promise<UploadedImage[]> => {
    // 유효성 검사
    const validationError = validateFiles(files);
    if (validationError) {
      setError(validationError.message);
      return [];
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await uploadImages(files);
      const images = response.data.images;
      setUploadedImages((prev) => [...prev, ...images]);
      setProgress(100);
      return images;
    } catch (err) {
      const message = err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.';
      setError(message);
      return [];
    } finally {
      setIsUploading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setUploadedImages([]);
  }, []);

  return {
    upload,
    isUploading,
    progress,
    error,
    uploadedImages,
    clearError,
    reset,
  };
}
