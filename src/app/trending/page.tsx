import { MainLayout } from '@/components/templates';
import { Button, Badge } from '@/components/atoms';
import { ThumbsUp, ThumbsDown, MessageCircle, Bookmark, MoreHorizontal, Flame, Clock } from 'lucide-react';

// Sample trending posts data
const trendingPosts = [
  {
    id: 1,
    title: 'Next.js 16 새로운 기능 총정리',
    content: 'Next.js 16에서 추가된 새로운 기능들을 정리했습니다. Turbopack의 정식 지원, 개선된 캐싱 전략, 그리고 새로운 API 라우트 기능까지 모두 살펴봅니다.',
    author: '개발자김',
    channel: '기술',
    upvotes: 523,
    downvotes: 12,
    comments: 89,
    createdAt: '2시간 전',
    trending: true,
  },
  {
    id: 2,
    title: '2024년 개발자 연봉 현황 분석',
    content: '국내 IT 기업들의 2024년 개발자 연봉 데이터를 분석했습니다. 직군별, 경력별, 회사 규모별 연봉 분포를 확인해보세요.',
    author: '커리어코치',
    channel: '커리어',
    upvotes: 891,
    downvotes: 45,
    comments: 234,
    createdAt: '5시간 전',
    trending: true,
  },
  {
    id: 3,
    title: 'AI 시대, 개발자의 역할은?',
    content: 'ChatGPT, Copilot 등 AI 도구가 일상화된 시대에서 개발자의 역할과 가치는 어떻게 변화할까요? 현업 개발자들의 생생한 의견을 모았습니다.',
    author: 'AI연구자',
    channel: '토론',
    upvotes: 456,
    downvotes: 23,
    comments: 178,
    createdAt: '8시간 전',
    trending: true,
  },
  {
    id: 4,
    title: 'React vs Vue vs Svelte 2024 비교',
    content: '2024년 기준 세 프레임워크의 성능, 생태계, 학습 곡선, 채용 시장까지 종합적으로 비교 분석했습니다.',
    author: '프론트엔드마스터',
    channel: '기술',
    upvotes: 367,
    downvotes: 89,
    comments: 145,
    createdAt: '12시간 전',
    trending: true,
  },
  {
    id: 5,
    title: '스타트업 3년차 회고록',
    content: '스타트업에서 3년간 일하며 배운 것들, 좋았던 점과 힘들었던 점을 솔직하게 공유합니다.',
    author: '스타트업러',
    channel: '일상',
    upvotes: 289,
    downvotes: 8,
    comments: 67,
    createdAt: '1일 전',
    trending: false,
  },
];

export default function TrendingPage() {
  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-6 h-6 text-[var(--color-error-500)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">트렌딩</h1>
        </div>
        <p className="mt-1 text-[var(--text-secondary)]">
          지금 가장 뜨거운 게시글을 확인하세요
        </p>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2 mb-6">
        <Button variant="primary" size="sm">
          <Clock className="w-4 h-4 mr-1" />
          오늘
        </Button>
        <Button variant="secondary" size="sm">이번 주</Button>
        <Button variant="secondary" size="sm">이번 달</Button>
        <Button variant="secondary" size="sm">전체</Button>
      </div>

      {/* Trending Post List */}
      <div className="space-y-4">
        {trendingPosts.map((post, index) => (
          <article
            key={post.id}
            className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-default)] p-4 hover:border-[var(--border-strong)] transition-colors"
          >
            {/* Rank Badge */}
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index < 3
                  ? 'bg-[var(--color-primary-500)] text-white'
                  : 'bg-[var(--bg-muted)] text-[var(--text-tertiary)]'
              }`}>
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={post.trending ? 'error' : 'primary'}>{post.channel}</Badge>
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
              </div>
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
