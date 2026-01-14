'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/templates';
import { Button, Badge, Avatar } from '@/components/atoms';
import { Calendar, MapPin, Link as LinkIcon, Edit2, ThumbsUp, MessageCircle, Bookmark, MoreHorizontal, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRequireAuth } from '@/hooks';

// Sample posts data
const userPosts = [
  {
    id: 1,
    title: 'Next.js 16 새로운 기능 총정리',
    content: 'Next.js 16에서 추가된 새로운 기능들을 정리했습니다.',
    channel: '기술',
    upvotes: 523,
    comments: 89,
    createdAt: '2일 전',
  },
  {
    id: 2,
    title: 'TypeScript 5.0 마이그레이션 가이드',
    content: 'TypeScript 5.0으로 마이그레이션하는 방법을 단계별로 설명합니다.',
    channel: '기술',
    upvotes: 345,
    comments: 56,
    createdAt: '1주 전',
  },
  {
    id: 3,
    title: '개발자의 사이드 프로젝트 이야기',
    content: '사이드 프로젝트를 진행하면서 배운 점들을 공유합니다.',
    channel: '일상',
    upvotes: 234,
    comments: 42,
    createdAt: '2주 전',
  },
];

type TabType = 'posts' | 'comments' | 'likes';

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useRequireAuth();
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  // 사용자 표시 정보 계산
  const displayName = user?.displayName ||
    (user?.firstName && user?.lastName ? `${user.lastName}${user.firstName}` : null) ||
    user?.email?.split('@')[0] ||
    '사용자';

  const username = user?.email?.split('@')[0] || 'user';

  if (isLoading || !isAuthenticated) {
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
      {/* Profile Header */}
      <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <Avatar name={displayName} src={user?.profileImage} size="xl" />

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">{displayName}</h1>
                <p className="text-[var(--text-tertiary)]">@{username}</p>
              </div>
              <Link href="/settings/profile">
                <Button variant="secondary" size="sm">
                  <Edit2 className="w-4 h-4 mr-1" />
                  프로필 수정
                </Button>
              </Link>
            </div>

            {/* Email */}
            <p className="text-[var(--text-secondary)] mb-4">{user?.email}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-[var(--text-tertiary)] mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                커뮤 회원
              </span>
              {user?.isEmailVerified && (
                <span className="flex items-center gap-1 text-[var(--color-success-500)]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  이메일 인증됨
                </span>
              )}
            </div>

            {/* Stats - TODO: API 연동 후 실제 데이터로 대체 */}
            <div className="flex gap-6">
              <span>
                <span className="font-bold text-[var(--text-primary)]">0</span>
                <span className="text-[var(--text-secondary)] ml-1">팔로워</span>
              </span>
              <span>
                <span className="font-bold text-[var(--text-primary)]">0</span>
                <span className="text-[var(--text-secondary)] ml-1">팔로잉</span>
              </span>
              <span>
                <span className="font-bold text-[var(--text-primary)]">0</span>
                <span className="text-[var(--text-secondary)] ml-1">게시글</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[var(--border-default)]">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'posts'
              ? 'text-[var(--color-primary-500)] border-[var(--color-primary-500)]'
              : 'text-[var(--text-tertiary)] border-transparent hover:text-[var(--text-primary)]'
          }`}
        >
          게시글
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'comments'
              ? 'text-[var(--color-primary-500)] border-[var(--color-primary-500)]'
              : 'text-[var(--text-tertiary)] border-transparent hover:text-[var(--text-primary)]'
          }`}
        >
          댓글
        </button>
        <button
          onClick={() => setActiveTab('likes')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'likes'
              ? 'text-[var(--color-primary-500)] border-[var(--color-primary-500)]'
              : 'text-[var(--text-tertiary)] border-transparent hover:text-[var(--text-primary)]'
          }`}
        >
          좋아요
        </button>
      </div>

      {/* Content */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 hover:border-[var(--border-strong)] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="primary">{post.channel}</Badge>
                  <span className="text-sm text-[var(--text-tertiary)]">{post.createdAt}</span>
                </div>
                <button className="p-1 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]">
                  <MoreHorizontal className="w-5 h-5 text-[var(--text-tertiary)]" />
                </button>
              </div>

              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {post.title}
              </h2>
              <p className="text-[var(--text-secondary)] line-clamp-2">
                {post.content}
              </p>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border-default)]">
                <span className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                  <ThumbsUp className="w-4 h-4" />
                  {post.upvotes}
                </span>
                <span className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments}
                </span>
                <button className="p-1.5 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)] ml-auto">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
            작성한 댓글이 없습니다
          </h3>
          <p className="text-[var(--text-secondary)]">
            게시글에 댓글을 남겨보세요
          </p>
        </div>
      )}

      {activeTab === 'likes' && (
        <div className="text-center py-12">
          <ThumbsUp className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
            좋아요한 게시글이 없습니다
          </h3>
          <p className="text-[var(--text-secondary)]">
            마음에 드는 게시글에 좋아요를 눌러보세요
          </p>
        </div>
      )}
    </MainLayout>
  );
}
