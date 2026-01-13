import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { SocialLoginButtons } from '../SocialLoginButtons';

// Mock the auth API
vi.mock('@/lib/api/auth', () => ({
  authApi: {
    getGoogleAuthUrl: vi.fn(() => 'http://localhost:3001/api/v1/auth/google'),
    getKakaoAuthUrl: vi.fn(() => 'http://localhost:3001/api/v1/auth/kakao'),
    getGithubAuthUrl: vi.fn(() => 'http://localhost:3001/api/v1/auth/github'),
  },
}));

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('SocialLoginButtons Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = '';
  });

  it('should render Google, Kakao and GitHub login buttons', () => {
    render(<SocialLoginButtons />);

    expect(screen.getByText('Google로 계속하기')).toBeInTheDocument();
    expect(screen.getByText('카카오로 계속하기')).toBeInTheDocument();
    expect(screen.getByText('GitHub으로 계속하기')).toBeInTheDocument();
  });

  it('should render divider with "또는" text', () => {
    render(<SocialLoginButtons />);

    expect(screen.getByText('또는')).toBeInTheDocument();
  });

  it('should redirect to Google OAuth when Google button is clicked', () => {
    render(<SocialLoginButtons />);

    const googleButton = screen.getByText('Google로 계속하기').closest('button');
    fireEvent.click(googleButton!);

    expect(mockLocation.href).toBe('http://localhost:3001/api/v1/auth/google');
  });

  it('should redirect to Kakao OAuth when Kakao button is clicked', () => {
    render(<SocialLoginButtons />);

    const kakaoButton = screen.getByText('카카오로 계속하기').closest('button');
    fireEvent.click(kakaoButton!);

    expect(mockLocation.href).toBe('http://localhost:3001/api/v1/auth/kakao');
  });

  it('should redirect to GitHub OAuth when GitHub button is clicked', () => {
    render(<SocialLoginButtons />);

    const githubButton = screen.getByText('GitHub으로 계속하기').closest('button');
    fireEvent.click(githubButton!);

    expect(mockLocation.href).toBe('http://localhost:3001/api/v1/auth/github');
  });

  it('should have correct button styles', () => {
    render(<SocialLoginButtons />);

    const googleButton = screen.getByText('Google로 계속하기').closest('button');
    const kakaoButton = screen.getByText('카카오로 계속하기').closest('button');
    const githubButton = screen.getByText('GitHub으로 계속하기').closest('button');

    // Google button should have border
    expect(googleButton).toHaveClass('border');

    // Kakao button should have yellow background
    expect(kakaoButton).toHaveClass('bg-[#FEE500]');

    // GitHub button should have dark background
    expect(githubButton).toHaveClass('bg-[#24292e]');
  });

  it('should have type="button" to prevent form submission', () => {
    render(<SocialLoginButtons />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('should render SVG icons for each provider', () => {
    render(<SocialLoginButtons />);

    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBe(3); // Google, Kakao and GitHub icons
  });
});
