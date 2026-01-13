'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/templates';
import { Button, Badge } from '@/components/atoms';
import { Bookmark, ThumbsUp, MessageCircle, Trash2, FolderPlus, MoreHorizontal, Loader2 } from 'lucide-react';
import { useRequireAuth } from '@/hooks';

// Sample bookmarked posts
const bookmarkedPosts = [
  {
    id: 1,
    title: 'Next.js 16 새로운 기능 총정리',
    content: 'Next.js 16에서 추가된 새로운 기능들을 정리했습니다.',
    author: '개발자김',
    channel: '기술',
    upvotes: 523,
    comments: 89,
    savedAt: '1시간 전',
    folder: '개발',
  },
  {
    id: 2,
    title: '2024년 개발자 연봉 현황 분석',
    content: '국내 IT 기업들의 2024년 개발자 연봉 데이터를 분석했습니다.',
    author: '커리어코치',
    channel: '커리어',
    upvotes: 891,
    comments: 234,
    savedAt: '3시간 전',
    folder: '커리어',
  },
  {
    id: 3,
    title: 'TypeScript 5.0 마이그레이션 가이드',
    content: 'TypeScript 5.0으로 마이그레이션하는 방법을 단계별로 설명합니다.',
    author: 'TS마스터',
    channel: '기술',
    upvotes: 345,
    comments: 56,
    savedAt: '1일 전',
    folder: '개발',
  },
  {
    id: 4,
    title: '효과적인 면접 준비 방법',
    content: '기술 면접과 인성 면접을 효과적으로 준비하는 방법을 공유합니다.',
    author: '면접관',
    channel: '커리어',
    upvotes: 234,
    comments: 78,
    savedAt: '2일 전',
    folder: '커리어',
  },
];

const folders = ['전체', '개발', '커리어', '일상'];

export default function BookmarksPage() {
  const { isLoading, isAuthenticated } = useRequireAuth();
  const [selectedFolder, setSelectedFolder] = useState('전체');

  if (isLoading || !isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-500)]" />
        </div>
      </MainLayout>
    );
  }

  const filteredPosts = selectedFolder === '전체'
    ? bookmarkedPosts
    : bookmarkedPosts.filter(post => post.folder === selectedFolder);

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bookmark className="w-6 h-6 text-[var(--color-primary-500)]" />
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">북마크</h1>
            </div>
            <p className="mt-1 text-[var(--text-secondary)]">
              저장한 게시글 {bookmarkedPosts.length}개
            </p>
          </div>
          <Button variant="secondary" size="sm">
            <FolderPlus className="w-4 h-4 mr-1" />
            폴더 추가
          </Button>
        </div>
      </div>

      {/* Folder Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {folders.map((folder) => (
          <button
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedFolder === folder
                ? 'bg-[var(--color-primary-500)] text-white'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            {folder}
          </button>
        ))}
      </div>

      {/* Bookmarked Posts */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 hover:border-[var(--border-strong)] transition-colors"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="primary">{post.channel}</Badge>
                  <span className="text-sm text-[var(--text-tertiary)]">
                    {post.author}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-tertiary)]">
                    저장: {post.savedAt}
                  </span>
                  <button className="p-1 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]">
                    <MoreHorizontal className="w-5 h-5 text-[var(--text-tertiary)]" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {post.title}
              </h2>
              <p className="text-[var(--text-secondary)] line-clamp-2">
                {post.content}
              </p>

              {/* Post Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-default)]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                    <ThumbsUp className="w-4 h-4" />
                    {post.upvotes}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{post.folder}</Badge>
                  <button className="p-1.5 hover:bg-[var(--color-error-50)] rounded-[var(--radius-md)] text-[var(--text-tertiary)] hover:text-[var(--color-error-500)] transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bookmark className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
            저장한 게시글이 없습니다
          </h3>
          <p className="text-[var(--text-secondary)]">
            관심 있는 게시글을 북마크해보세요
          </p>
        </div>
      )}
    </MainLayout>
  );
}
