import { MainLayout } from '@/components/templates';
import { Button } from '@/components/atoms';
import { ThumbsUp, ThumbsDown, MessageCircle, Bookmark, MoreHorizontal, Users, FileText, Bell, BellOff } from 'lucide-react';

// Sample channel data
const channelData: Record<string, {
  name: string;
  description: string;
  members: number;
  posts: number;
  color: string;
  isSubscribed: boolean;
}> = {
  general: {
    name: '일반',
    description: '자유롭게 이야기할 수 있는 공간입니다. 어떤 주제든 환영합니다!',
    members: 15234,
    posts: 12543,
    color: 'primary',
    isSubscribed: true,
  },
  tech: {
    name: '기술',
    description: '프로그래밍, 개발, IT 기술에 대해 이야기하는 채널입니다.',
    members: 12453,
    posts: 8923,
    color: 'success',
    isSubscribed: true,
  },
  career: {
    name: '커리어',
    description: '취업, 이직, 커리어 개발에 관한 정보를 공유하는 채널입니다.',
    members: 8721,
    posts: 5432,
    color: 'warning',
    isSubscribed: false,
  },
};

// Sample posts
const channelPosts = [
  {
    id: 1,
    title: '이 채널의 첫 번째 게시글입니다',
    content: '채널에 오신 것을 환영합니다! 자유롭게 이야기해주세요.',
    author: '운영자',
    upvotes: 45,
    downvotes: 2,
    comments: 12,
    createdAt: '1시간 전',
  },
  {
    id: 2,
    title: '질문있습니다! 도움 부탁드려요',
    content: '처음 글 올려봅니다. 궁금한 점이 있는데 답변 부탁드립니다.',
    author: '새회원',
    upvotes: 23,
    downvotes: 1,
    comments: 8,
    createdAt: '3시간 전',
  },
  {
    id: 3,
    title: '유용한 정보 공유합니다',
    content: '제가 최근에 알게 된 유용한 팁을 공유합니다. 많은 분들께 도움이 되셨으면 좋겠어요.',
    author: '정보왕',
    upvotes: 89,
    downvotes: 5,
    comments: 34,
    createdAt: '5시간 전',
  },
];

const colorMap: Record<string, string> = {
  primary: 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]',
  success: 'bg-[var(--color-success-50)] text-[var(--color-success-600)]',
  warning: 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]',
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChannelPage({ params }: PageProps) {
  const { slug } = await params;
  const channel = channelData[slug] || {
    name: slug,
    description: '채널 설명이 없습니다.',
    members: 0,
    posts: 0,
    color: 'primary',
    isSubscribed: false,
  };

  return (
    <MainLayout>
      {/* Channel Header */}
      <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-4">
          {/* Channel Icon */}
          <div className={`w-16 h-16 rounded-[var(--radius-lg)] flex items-center justify-center text-2xl font-bold ${colorMap[channel.color]}`}>
            {channel.name[0]}
          </div>

          {/* Channel Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">{channel.name}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={channel.isSubscribed ? 'secondary' : 'primary'} size="sm">
                  {channel.isSubscribed ? (
                    <>
                      <BellOff className="w-4 h-4 mr-1" />
                      구독 중
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 mr-1" />
                      구독하기
                    </>
                  )}
                </Button>
              </div>
            </div>

            <p className="text-[var(--text-secondary)] mb-4">{channel.description}</p>

            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                <Users className="w-4 h-4" />
                <span className="font-medium text-[var(--text-primary)]">{channel.members.toLocaleString()}</span>
                명
              </span>
              <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                <FileText className="w-4 h-4" />
                <span className="font-medium text-[var(--text-primary)]">{channel.posts.toLocaleString()}</span>
                개 게시글
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 mb-6 border-b border-[var(--border-default)]">
        <button className="px-4 py-2 text-[var(--color-primary-500)] font-medium border-b-2 border-[var(--color-primary-500)]">
          인기
        </button>
        <button className="px-4 py-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
          최신
        </button>
        <button className="px-4 py-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
          댓글순
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {channelPosts.map((post) => (
          <article
            key={post.id}
            className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 hover:border-[var(--border-strong)] transition-colors"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-tertiary)]">
                  {post.author} · {post.createdAt}
                </span>
              </div>
              <button className="p-1 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]">
                <MoreHorizontal className="w-5 h-5 text-[var(--text-tertiary)]" />
              </button>
            </div>

            {/* Post Content */}
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              {post.title}
            </h2>
            <p className="text-[var(--text-secondary)] line-clamp-2">
              {post.content}
            </p>

            {/* Post Actions */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border-default)]">
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <span className="text-sm text-[var(--text-secondary)] min-w-[2rem]">
                  {post.upvotes}
                </span>
                <button className="p-1.5 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
              <button className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)]">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm text-[var(--text-secondary)]">
                  {post.comments}
                </span>
              </button>
              <button className="p-1.5 hover:bg-[var(--bg-hover)] rounded-[var(--radius-md)] ml-auto">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-6 text-center">
        <Button variant="secondary">더 보기</Button>
      </div>
    </MainLayout>
  );
}
