'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/templates';
import { Button, Badge } from '@/components/atoms';
import { PenLine, ImageIcon, Link2, Hash, X, Eye, Send, Loader2 } from 'lucide-react';
import { useRequireAuth } from '@/hooks';

const channels = [
  { slug: 'general', name: '일반' },
  { slug: 'tech', name: '기술' },
  { slug: 'career', name: '커리어' },
  { slug: 'question', name: '질문' },
  { slug: 'daily', name: '일상' },
];

export default function WritePage() {
  const { isLoading, isAuthenticated } = useRequireAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  if (isLoading || !isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-500)]" />
        </div>
      </MainLayout>
    );
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenLine className="w-6 h-6 text-[var(--color-primary-500)]" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">새 글 작성</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              미리보기
            </Button>
            <Button variant="primary" size="sm" disabled={!title || !content || !selectedChannel}>
              <Send className="w-4 h-4 mr-1" />
              게시하기
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

        {/* Content Textarea */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            내용 *
          </label>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-lg)] overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-primary-500)] focus-within:border-transparent">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-[var(--border-default)]">
              <button className="p-2 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]" title="이미지 추가">
                <ImageIcon className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
              <button className="p-2 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]" title="링크 추가">
                <Link2 className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>
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

        {/* Tags Input */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            <Hash className="w-4 h-4 inline mr-1" />
            태그 (최대 5개)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                #{tag}
                <button onClick={() => removeTag(tag)} className="ml-1 hover:text-[var(--color-error-500)]">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="태그 입력 후 Enter"
              disabled={tags.length >= 5}
              className="flex-1 px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent disabled:opacity-50"
            />
            <Button variant="secondary" onClick={addTag} disabled={tags.length >= 5 || !tagInput.trim()}>
              추가
            </Button>
          </div>
        </div>

        {/* Submit Buttons (Mobile) */}
        <div className="flex gap-3 pt-4 border-t border-[var(--border-default)] md:hidden">
          <Button variant="secondary" className="flex-1">임시저장</Button>
          <Button variant="primary" className="flex-1" disabled={!title || !content || !selectedChannel}>
            게시하기
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
