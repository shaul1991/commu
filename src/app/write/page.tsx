'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates';
import { Button } from '@/components/atoms';
import {
  PreviewModal,
  ReferenceUrlInput,
  TagAutocomplete,
  ImageUploadButton,
} from '@/components/molecules';
import { PenLine, Eye, Send, Loader2 } from 'lucide-react';
import { useRequireAuth } from '@/hooks';
import { useCreatePost } from '@/hooks/usePost';

const channels = [
  { slug: 'general', name: '일반' },
  { slug: 'tech', name: '기술' },
  { slug: 'career', name: '커리어' },
  { slug: 'question', name: '질문' },
  { slug: 'daily', name: '일상' },
];

export default function WritePage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useRequireAuth();
  const createPostMutation = useCreatePost();

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [referenceUrl, setReferenceUrl] = useState('');

  // UI State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // 드래그 앤 드롭 핸들러 (본문 영역) - 훅은 조건문 전에 선언해야 함
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // 파일은 ImageUploadButton에서 처리
  }, []);

  // 인증 로딩 중
  if (isLoading || !isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-500)]" />
        </div>
      </MainLayout>
    );
  }

  // 채널 이름 가져오기
  const selectedChannelName =
    channels.find((c) => c.slug === selectedChannel)?.name || '';

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!title || !content || !selectedChannel) return;

    createPostMutation.mutate(
      {
        title,
        content,
        channelSlug: selectedChannel,
        tags,
        images: images.length > 0 ? images : undefined,
        referenceUrl: referenceUrl || undefined,
      },
      {
        onSuccess: (response) => {
          if (response.data?.id) {
            router.push(`/posts/${response.data.id}`);
          } else {
            router.push('/');
          }
        },
      }
    );
  };

  const isFormValid = title && content && selectedChannel;

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenLine className="w-6 h-6 text-[var(--color-primary-500)]" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              새 글 작성
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              disabled={!title && !content}
            >
              <Eye className="w-4 h-4 mr-1" />
              미리보기
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!isFormValid || createPostMutation.isPending}
              onClick={handleSubmit}
            >
              {createPostMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-1" />
              )}
              {createPostMutation.isPending ? '게시 중...' : '게시하기'}
            </Button>
          </div>
        </div>
      </div>

      {/* Write Form */}
      <div className="space-y-6">
        {/* Channel Selection */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            채널 선택 *
          </label>
          <div className="flex flex-wrap gap-2">
            {channels.map((channel) => (
              <button
                key={channel.slug}
                onClick={() => setSelectedChannel(channel.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedChannel === channel.slug
                    ? 'bg-[var(--color-primary-500)] text-white'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {channel.name}
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            제목 *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={100}
            className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
          />
          <p className="mt-1 text-xs text-[var(--text-tertiary)] text-right">
            {title.length}/100
          </p>
        </div>

        {/* Content Textarea with Drag & Drop */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            내용 *
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-[var(--bg-surface)] border rounded-[var(--radius-lg)] overflow-hidden transition-colors ${
              isDragOver
                ? 'border-[var(--color-primary-500)] ring-2 ring-[var(--color-primary-500)]'
                : 'border-[var(--border-default)] focus-within:ring-2 focus-within:ring-[var(--color-primary-500)] focus-within:border-transparent'
            }`}
          >
            {/* Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요. 마크다운 문법을 지원합니다."
              rows={12}
              className="w-full px-4 py-3 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] resize-none focus:outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">
            마크다운 문법을 사용할 수 있습니다.
          </p>
        </div>

        {/* Image Upload */}
        <ImageUploadButton
          images={images}
          onImagesChange={setImages}
          maxImages={10}
        />

        {/* Reference URL */}
        <ReferenceUrlInput value={referenceUrl} onChange={setReferenceUrl} />

        {/* Tags */}
        <TagAutocomplete
          selectedTags={tags}
          onTagsChange={setTags}
          maxTags={5}
        />

        {/* Submit Buttons (Mobile) */}
        <div className="flex gap-3 pt-4 border-t border-[var(--border-default)] md:hidden">
          <Button variant="secondary" className="flex-1">
            임시저장
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!isFormValid || createPostMutation.isPending}
            onClick={handleSubmit}
          >
            {createPostMutation.isPending ? '게시 중...' : '게시하기'}
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title || '제목 없음'}
        content={content || '내용 없음'}
        channelName={selectedChannelName || '채널 미선택'}
        tags={tags}
        images={images}
        referenceUrl={referenceUrl}
      />
    </MainLayout>
  );
}
