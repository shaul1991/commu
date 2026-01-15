'use client';

import { useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import { X, Link2 } from 'lucide-react';
import { Button, Badge } from '@/components/atoms';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  channelName: string;
  tags: string[];
  images?: string[];
  referenceUrl?: string;
}

export default function PreviewModal({
  isOpen,
  onClose,
  title,
  content,
  channelName,
  tags,
  images = [],
  referenceUrl,
}: PreviewModalProps) {
  // ESC 키로 닫기
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  // XSS 방지를 위한 sanitize
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'strong', 'em', 'del', 'code', 'pre',
      'blockquote', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        data-testid="modal-backdrop"
        className="absolute inset-0 bg-black/50"
        onClick={handleBackdropClick}
      />

      {/* Modal Content */}
      <div
        data-testid="modal-content"
        className="relative w-full max-w-3xl max-h-[80vh] md:max-h-[80vh] h-full md:h-auto mx-4 bg-[var(--bg-surface)] rounded-[var(--radius-lg)] shadow-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">미리보기</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)] transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Channel & Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="primary">{channelName}</Badge>
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1
            id="preview-title"
            className="text-2xl font-bold text-[var(--text-primary)] mb-4"
          >
            {title}
          </h1>

          {/* Content */}
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mb-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // 이미지에 스타일 적용
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    className="max-w-full h-auto rounded-[var(--radius-md)]"
                    loading="lazy"
                  />
                ),
                // 링크에 target="_blank" 적용
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {sanitizedContent}
            </ReactMarkdown>
          </div>

          {/* Images Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
              {images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`이미지 ${index + 1}`}
                  className="w-full h-32 object-cover rounded-[var(--radius-md)]"
                />
              ))}
            </div>
          )}

          {/* Reference URL */}
          {referenceUrl && (
            <div className="flex items-center gap-2 p-3 bg-[var(--bg-hover)] rounded-[var(--radius-md)]">
              <Link2 className="w-4 h-4 text-[var(--text-secondary)]" />
              <a
                href={referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-primary-500)] hover:underline truncate"
              >
                {referenceUrl}
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-[var(--border-default)]">
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
