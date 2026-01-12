'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/templates';
import { Button, Badge, Avatar } from '@/components/atoms';
import { Bell, ThumbsUp, MessageCircle, UserPlus, AtSign, Settings, Check } from 'lucide-react';
import Link from 'next/link';

type NotificationType = 'like' | 'comment' | 'follow' | 'mention';

interface Notification {
  id: number;
  type: NotificationType;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  postTitle?: string;
  postId?: number;
  createdAt: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: 'like',
    user: { name: '개발자김' },
    content: '님이 회원님의 게시글을 좋아합니다.',
    postTitle: 'Next.js 16 새로운 기능 총정리',
    postId: 1,
    createdAt: '5분 전',
    read: false,
  },
  {
    id: 2,
    type: 'comment',
    user: { name: 'AI연구자' },
    content: '님이 댓글을 남겼습니다: "좋은 글 감사합니다!"',
    postTitle: 'TypeScript 5.0 가이드',
    postId: 2,
    createdAt: '30분 전',
    read: false,
  },
  {
    id: 3,
    type: 'follow',
    user: { name: '커리어코치' },
    content: '님이 회원님을 팔로우하기 시작했습니다.',
    createdAt: '1시간 전',
    read: false,
  },
  {
    id: 4,
    type: 'mention',
    user: { name: '스타트업러' },
    content: '님이 회원님을 언급했습니다: "@user 어떻게 생각하세요?"',
    postTitle: '스타트업 vs 대기업',
    postId: 3,
    createdAt: '2시간 전',
    read: true,
  },
  {
    id: 5,
    type: 'like',
    user: { name: '프론트엔드마스터' },
    content: '님이 회원님의 댓글을 좋아합니다.',
    postTitle: 'React vs Vue 비교',
    postId: 4,
    createdAt: '5시간 전',
    read: true,
  },
];

const iconMap: Record<NotificationType, typeof ThumbsUp> = {
  like: ThumbsUp,
  comment: MessageCircle,
  follow: UserPlus,
  mention: AtSign,
};

const colorMap: Record<NotificationType, string> = {
  like: 'bg-[var(--color-error-50)] text-[var(--color-error-500)]',
  comment: 'bg-[var(--color-primary-100)] text-[var(--color-primary-500)]',
  follow: 'bg-[var(--color-success-50)] text-[var(--color-success-600)]',
  mention: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]',
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.read);

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-6 h-6 text-[var(--color-primary-500)]" />
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">알림</h1>
              {unreadCount > 0 && (
                <Badge variant="error">{unreadCount}</Badge>
              )}
            </div>
            <p className="mt-1 text-[var(--text-secondary)]">
              새로운 활동을 확인하세요
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Check className="w-4 h-4 mr-1" />
              모두 읽음
            </Button>
            <Link href="/settings/notifications">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[var(--border-default)]">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            filter === 'all'
              ? 'text-[var(--color-primary-500)] border-[var(--color-primary-500)]'
              : 'text-[var(--text-tertiary)] border-transparent hover:text-[var(--text-primary)]'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
            filter === 'unread'
              ? 'text-[var(--color-primary-500)] border-[var(--color-primary-500)]'
              : 'text-[var(--text-tertiary)] border-transparent hover:text-[var(--text-primary)]'
          }`}
        >
          읽지 않음
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-[var(--color-error-500)] text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => {
            const Icon = iconMap[notification.type];
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-[var(--radius-lg)] border transition-colors cursor-pointer ${
                  notification.read
                    ? 'bg-[var(--bg-surface)] border-[var(--border-default)] hover:bg-[var(--bg-hover)]'
                    : 'bg-[var(--color-primary-50)] border-[var(--color-primary-200)] hover:bg-[var(--color-primary-100)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`p-2 rounded-full flex-shrink-0 ${colorMap[notification.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--text-primary)]">
                      <span className="font-medium">{notification.user.name}</span>
                      <span className="text-[var(--text-secondary)]"> {notification.content}</span>
                    </p>
                    {notification.postTitle && (
                      <p className="mt-1 text-sm text-[var(--color-primary-500)] truncate">
                        {notification.postTitle}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                      {notification.createdAt}
                    </p>
                  </div>

                  {/* Avatar */}
                  <Avatar name={notification.user.name} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
            {filter === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
          </h3>
          <p className="text-[var(--text-secondary)]">
            새로운 활동이 있으면 여기에 표시됩니다
          </p>
        </div>
      )}
    </MainLayout>
  );
}
