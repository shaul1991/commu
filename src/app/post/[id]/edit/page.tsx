'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/templates';
import { Button } from '@/components/atoms';
import {
  PreviewModal,
  ReferenceUrlInput,
  TagAutocomplete,
  ImageUploadButton,
} from '@/components/molecules';
import { PenLine, Eye, Save, Loader2, ArrowLeft } from 'lucide-react';
import { useRequireAuth } from '@/hooks';
import { usePost, useUpdatePost } from '@/hooks/usePost';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/uiStore';
import type { Post } from '@/types';

const channels = [
  { slug: 'general', name: '일반' },
  { slug: 'tech', name: '기술' },
  { slug: 'career', name: '커리어' },
  { slug: 'question', name: '질문' },
  { slug: 'daily', name: '일상' },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

// 폼 컴포넌트 분리 - post 데이터가 있을 때만 렌더링
function EditPostForm({ post, postId }: { post: Post; postId: string }) {
  const router = useRouter();
  const updatePostMutation = useUpdatePost();

  // Form State - post 데이터로 초기값 설정
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [selectedChannel] = useState(post.channelSlug || '');
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [images, setImages] = useState<string[]>(post.images || []);
  const [referenceUrl, setReferenceUrl] = useState(post.referenceUrl || '');

  // UI State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 채널 이름 가져오기
  const selectedChannelName =
    channels.find((c) => c.slug === selectedChannel)?.name || '';

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error('제목과 내용을 입력해주세요.');
      return;
    }

    updatePostMutation.mutate(
      {
        id: postId,
        data: {
          title,
          content,
          tags,
        },
      },
      {
        onSuccess: () => {
          router.push(`/post/${postId}`);
        },
      }
    );
  };

  const isFormValid = title && content;
  const hasChanges =
    title !== post.title ||
    content !== post.content ||
    JSON.stringify(tags) !== JSON.stringify(post.tags || []);

  return (
    <>
      {/* Back Button */}
      <div className="mb-4">
        <Link
          href={`/post/${postId}`}
          className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>게시글로 돌아가기</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenLine className="w-6 h-6 text-[var(--color-primary-500)]" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              글 수정
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
              disabled={!isFormValid || !hasChanges || updatePostMutation.isPending}
              onClick={handleSubmit}
            >
              {updatePostMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              {updatePostMutation.isPending ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="space-y-6">
        {/* Channel Selection (읽기 전용) */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            채널
          </label>
          <div className="flex flex-wrap gap-2">
            {channels.map((channel) => (
              <button
                key={channel.slug}
                disabled
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedChannel === channel.slug
                    ? 'bg-[var(--color-primary-500)] text-white'
                    : 'bg-[var(--bg-surface)] text-[var(--text-tertiary)] border border-[var(--border-default)] opacity-50'
                }`}
              >
                {channel.name}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">
            채널은 수정할 수 없습니다.
          </p>
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

        {/* Content Textarea */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            내용 *
          </label>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)] overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-primary-500)] focus-within:border-transparent">
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
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => router.push(`/post/${postId}`)}
          >
            취소
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!isFormValid || !hasChanges || updatePostMutation.isPending}
            onClick={handleSubmit}
          >
            {updatePostMutation.isPending ? '저장 중...' : '저장'}
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
    </>
  );
}

export default function EditPostPage({ params }: PageProps) {
  const { id: postId } = use(params);
  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth();
  const { user } = useAuthStore();
  const { data: post, isLoading: postLoading } = usePost(postId);

  // 작성자 권한 체크
  useEffect(() => {
    if (post && user && post.author?.id !== user.id) {
      toast.error('수정 권한이 없습니다.');
      router.push(`/post/${postId}`);
    }
  }, [post, user, postId, router]);

  // 로딩 중
  if (authLoading || !isAuthenticated || postLoading || !post) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-500)]" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <EditPostForm post={post} postId={postId} />
    </MainLayout>
  );
}
