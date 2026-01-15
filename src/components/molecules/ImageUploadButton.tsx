'use client';

import { useState, useCallback, useRef } from 'react';
import { ImagePlus, X, Loader2, AlertCircle } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/atoms';

interface ImageUploadButtonProps {
  images?: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function ImageUploadButton({
  images = [],
  onImagesChange,
  maxImages = 10,
}: ImageUploadButtonProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    upload,
    isUploading,
    progress,
    error,
    clearError,
  } = useImageUpload();

  const remainingSlots = maxImages - images.length;
  const isMaxReached = remainingSlots <= 0;

  // 파일 선택 버튼 클릭
  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 파일 업로드 처리
  const handleUpload = useCallback(
    async (files: File[]) => {
      if (isMaxReached) return;

      // 남은 슬롯만큼만 업로드
      const filesToUpload = files.slice(0, remainingSlots);

      try {
        const uploadedImages = await upload(filesToUpload);
        const newUrls = uploadedImages.map((img) => img.url);
        onImagesChange([...images, ...newUrls]);
      } catch (err) {
        // 에러는 hook에서 처리됨
      }
    },
    [images, remainingSlots, isMaxReached, upload, onImagesChange]
  );

  // 파일 입력 변경
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length > 0) {
        handleUpload(files);
      }
      // 같은 파일 다시 선택 가능하도록 리셋
      event.target.value = '';
    },
    [handleUpload]
  );

  // 이미지 삭제
  const handleRemoveImage = useCallback(
    (indexToRemove: number) => {
      onImagesChange(images.filter((_, index) => index !== indexToRemove));
    },
    [images, onImagesChange]
  );

  // 드래그 앤 드롭 핸들러
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      const files = Array.from(event.dataTransfer.files).filter((file) =>
        ALLOWED_TYPES.includes(file.type)
      );

      if (files.length > 0) {
        handleUpload(files);
      }
    },
    [handleUpload]
  );

  return (
    <div className="space-y-3">
      {/* 라벨 */}
      <label className="block text-sm font-medium text-[var(--text-primary)]">
        <ImagePlus className="w-4 h-4 inline mr-1" />
        이미지 <span className="text-[var(--text-tertiary)]">(최대 {maxImages}장)</span>
      </label>

      {/* 드롭 영역 */}
      <div
        data-testid="drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-[var(--radius-md)] p-4 transition-colors ${
          isDragOver
            ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
            : 'border-[var(--border-default)]'
        } ${isMaxReached ? 'opacity-50' : ''}`}
      >
        {/* 업로드 버튼 */}
        <div className="flex flex-col items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleButtonClick}
            disabled={isUploading || isMaxReached}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                업로드 중... {progress}%
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4" />
                이미지 추가
              </>
            )}
          </Button>

          <p className="text-xs text-[var(--text-tertiary)]">
            JPG, PNG, GIF, WebP (각 10MB 이하)
          </p>

          <p className="text-xs text-[var(--text-tertiary)]">
            {images.length} / {maxImages}
          </p>
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          multiple
          onChange={handleFileChange}
          className="hidden"
          aria-label="이미지 파일 선택"
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-[var(--color-error-50)] border border-[var(--color-error-200)] rounded-[var(--radius-md)]">
          <AlertCircle className="w-4 h-4 text-[var(--color-error-500)]" />
          <span className="text-sm text-[var(--color-error-700)]">{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="ml-auto text-[var(--color-error-500)] hover:text-[var(--color-error-700)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 업로드된 이미지 썸네일 */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group aspect-square">
              <img
                src={url}
                alt={`업로드된 이미지 ${index + 1}`}
                className="w-full h-full object-cover rounded-[var(--radius-md)]"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`이미지 ${index + 1} 삭제`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 진행률 바 */}
      {isUploading && (
        <div className="w-full h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary-500)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
