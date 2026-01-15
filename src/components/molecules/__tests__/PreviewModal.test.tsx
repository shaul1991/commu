/**
 * PreviewModal 컴포넌트 테스트
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PreviewModal from '../PreviewModal';

describe('PreviewModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: '테스트 제목',
    content: '테스트 내용입니다.',
    channelName: '기술',
    tags: ['react', 'typescript'],
    images: ['https://example.com/image.jpg'],
    referenceUrl: 'https://example.com/reference',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('isOpen이 true일 때 모달이 표시됨', () => {
    render(<PreviewModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('isOpen이 false일 때 모달이 숨겨짐', () => {
    render(<PreviewModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('제목이 올바르게 표시됨', () => {
    render(<PreviewModal {...defaultProps} />);
    expect(screen.getByText('테스트 제목')).toBeInTheDocument();
  });

  it('채널명이 올바르게 표시됨', () => {
    render(<PreviewModal {...defaultProps} />);
    expect(screen.getByText('기술')).toBeInTheDocument();
  });

  it('태그들이 표시됨', () => {
    render(<PreviewModal {...defaultProps} />);
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#typescript')).toBeInTheDocument();
  });

  it('마크다운 내용이 렌더링됨', () => {
    render(<PreviewModal {...defaultProps} content="## 마크다운제목\n\n**굵은 글씨**" />);
    // getAllByRole 사용 (모달 헤더 h2와 마크다운 h2가 둘 다 존재)
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings.some((h) => h.textContent?.includes('마크다운제목'))).toBe(true);
    expect(screen.getByText('굵은 글씨')).toBeInTheDocument();
  });

  it('이미지가 표시됨', () => {
    render(<PreviewModal {...defaultProps} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('참고 링크가 표시됨', () => {
    render(<PreviewModal {...defaultProps} />);
    expect(screen.getByText('https://example.com/reference')).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose 호출', () => {
    render(<PreviewModal {...defaultProps} />);
    // 여러 닫기 버튼 중 footer의 닫기 버튼 사용
    const closeButtons = screen.getAllByRole('button', { name: /닫기/i });
    fireEvent.click(closeButtons[0]);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('배경 클릭 시 onClose 호출', () => {
    render(<PreviewModal {...defaultProps} />);
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('ESC 키 입력 시 onClose 호출', () => {
    render(<PreviewModal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('XSS 공격 코드가 sanitize됨', () => {
    const xssContent = '<script>alert("xss")</script>안전한텍스트';
    render(<PreviewModal {...defaultProps} content={xssContent} />);

    // script 태그가 없어야 함
    expect(document.querySelector('script')).toBeNull();
    // 안전한 내용은 표시되어야 함 (ReactMarkdown이 텍스트로 렌더링)
    expect(screen.getByText(/안전한텍스트/)).toBeInTheDocument();
  });

  it('모달 내부 클릭 시 닫히지 않음', () => {
    render(<PreviewModal {...defaultProps} />);
    const modalContent = screen.getByTestId('modal-content');
    fireEvent.click(modalContent);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});
