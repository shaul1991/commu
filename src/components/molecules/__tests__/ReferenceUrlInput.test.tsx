/**
 * ReferenceUrlInput 컴포넌트 테스트
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ReferenceUrlInput from '../ReferenceUrlInput';

describe('ReferenceUrlInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('입력 필드가 렌더링됨', () => {
    render(<ReferenceUrlInput {...defaultProps} />);
    expect(screen.getByPlaceholderText(/https:\/\//)).toBeInTheDocument();
  });

  it('유효한 URL 입력 시 에러 없음', () => {
    render(<ReferenceUrlInput {...defaultProps} value="https://example.com" />);
    expect(screen.queryByText(/올바른 URL/)).not.toBeInTheDocument();
    expect(screen.getByText(/유효한 URL/)).toBeInTheDocument();
  });

  it('무효한 URL 입력 시 에러 표시', () => {
    render(<ReferenceUrlInput {...defaultProps} value="not-a-url" />);
    expect(screen.getByText(/올바른 URL 형식이 아닙니다/)).toBeInTheDocument();
  });

  it('빈 값은 유효함 (에러 없음)', () => {
    render(<ReferenceUrlInput {...defaultProps} value="" />);
    expect(screen.queryByText(/올바른 URL/)).not.toBeInTheDocument();
    expect(screen.queryByText(/유효한 URL/)).not.toBeInTheDocument();
  });

  it('onChange 핸들러 호출됨', () => {
    render(<ReferenceUrlInput {...defaultProps} />);
    const input = screen.getByPlaceholderText(/https:\/\//);
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith('https://test.com');
  });

  it('http 프로토콜 허용', () => {
    render(<ReferenceUrlInput {...defaultProps} value="http://example.com" />);
    expect(screen.getByText(/유효한 URL/)).toBeInTheDocument();
  });

  it('프로토콜 없는 URL은 무효', () => {
    render(<ReferenceUrlInput {...defaultProps} value="example.com" />);
    expect(screen.getByText(/올바른 URL 형식이 아닙니다/)).toBeInTheDocument();
  });

  it('라벨이 표시됨', () => {
    render(<ReferenceUrlInput {...defaultProps} />);
    expect(screen.getByText(/참고 링크/)).toBeInTheDocument();
    expect(screen.getByText(/선택사항/)).toBeInTheDocument();
  });
});
