import { MainLayout } from '@/components/templates';
import { Button, Badge } from '@/components/atoms';
import { ThumbsUp, ThumbsDown, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';

// Sample post data
const samplePosts = [
  {
    id: 1,
    title: '커뮤 프로젝트를 시작합니다!',
    content: '안녕하세요, 모던하고 클린한 MZ세대를 위한 신세대 커뮤니티 "커뮤"를 소개합니다. 새로운 커뮤니티 경험을 함께 만들어가요.',
    author: '운영자',
    channel: '공지사항',
    upvotes: 128,
    downvotes: 3,
    comments: 42,
    createdAt: '1시간 전',
  },
  {
    id: 2,
    title: '다크 모드 기능이 추가되었습니다',
    content: '사용자 여러분의 요청에 따라 다크 모드를 추가했습니다. 우측 상단의 테마 토글 버튼을 눌러 변경해보세요!',
    author: '개발팀',
    channel: '업데이트',
    upvotes: 89,
    downvotes: 1,
    comments: 23,
    createdAt: '3시간 전',
  },
  {
    id: 3,
    title: '모바일 앱 개발 계획 공유',
    content: '많은 분들이 요청하신 모바일 앱 개발을 시작합니다. iOS와 Android 모두 지원할 예정이며, React Native를 사용할 계획입니다.',
    author: 'PM',
    channel: '기술',
    upvotes: 156,
    downvotes: 8,
    comments: 67,
    createdAt: '5시간 전',
  },
];

export default function Home() {
  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">홈</h1>
        <p className="mt-1 text-[var(--text-secondary)]">
          최신 게시글을 확인하세요
        </p>
      </div>

      {/* Feed Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[var(--border-default)]">
        <button className="px-4 py-2 text-[var(--color-primary-500)] font-medium border-b-2 border-[var(--color-primary-500)]">
          트렌딩
        </button>
        <button className="px-4 py-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
          최신
        </button>
        <button className="px-4 py-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
          팔로잉
        </button>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {samplePosts.map((post) => (
          <article
            key={post.id}
            className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 hover:border-[var(--border-strong)] transition-colors"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="primary">{post.channel}</Badge>
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
