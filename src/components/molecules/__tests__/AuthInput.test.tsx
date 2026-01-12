import { render, screen, fireEvent } from '@testing-library/react';
import { AuthInput } from '../AuthInput';

describe('AuthInput Component', () => {
  const defaultProps = {
    label: '이메일',
    type: 'email' as const,
    name: 'email',
    value: '',
    onChange: jest.fn(),
    placeholder: '이메일을 입력하세요',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render label and input correctly', () => {
    render(<AuthInput {...defaultProps} />);

    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('이메일을 입력하세요')).toBeInTheDocument();
  });

  it('should call onChange when input value changes', () => {
    render(<AuthInput {...defaultProps} />);

    const input = screen.getByLabelText('이메일');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it('should display error message when error prop is provided', () => {
    render(<AuthInput {...defaultProps} error="올바른 이메일 형식이 아닙니다." />);

    expect(screen.getByText('올바른 이메일 형식이 아닙니다.')).toBeInTheDocument();
  });

  it('should show required asterisk when required prop is true', () => {
    render(<AuthInput {...defaultProps} required />);

    const label = screen.getByText('이메일');
    expect(label.parentElement).toHaveTextContent('*');
  });

  describe('Password Toggle', () => {
    const passwordProps = {
      ...defaultProps,
      label: '비밀번호',
      type: 'password' as const,
      name: 'password',
      placeholder: '비밀번호를 입력하세요',
    };

    it('should show password toggle button for password type', () => {
      render(<AuthInput {...passwordProps} />);

      const toggleButton = screen.getByRole('button');
      expect(toggleButton).toBeInTheDocument();
    });

    it('should toggle password visibility when button is clicked', () => {
      render(<AuthInput {...passwordProps} value="password123" />);

      const input = screen.getByLabelText('비밀번호');
      const toggleButton = screen.getByRole('button');

      // Initially password is hidden
      expect(input).toHaveAttribute('type', 'password');

      // Click to show password
      fireEvent.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');

      // Click again to hide password
      fireEvent.click(toggleButton);
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should not show toggle button for non-password types', () => {
      render(<AuthInput {...defaultProps} type="email" />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  it('should apply error styles when error is present', () => {
    render(<AuthInput {...defaultProps} error="에러 메시지" />);

    const input = screen.getByLabelText('이메일');
    expect(input).toHaveClass('border-red-500');
  });

  it('should have proper accessibility attributes', () => {
    render(<AuthInput {...defaultProps} required error="에러 메시지" />);

    const input = screen.getByLabelText('이메일');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
