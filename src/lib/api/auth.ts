import { apiClient, ApiResponse } from './client';
import { User } from '@/stores/authStore';

// Request DTOs
interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
  passwordConfirm: string;
}

interface VerifyEmailRequest {
  token: string;
}

// Response DTOs
interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user?: User;
}

interface MessageResponse {
  message: string;
}

// 다중 세션 관련 Response
interface SessionsResponse {
  sessions: string[];
  count: number;
}

// Auth API
export const authApi = {
  register: (data: RegisterRequest): Promise<ApiResponse<User>> =>
    apiClient.post('/auth/register', data, { skipAuth: true }),

  login: (data: LoginRequest): Promise<ApiResponse<TokenResponse>> =>
    apiClient.post('/auth/login', data, { skipAuth: true }),

  logout: (): Promise<ApiResponse<MessageResponse>> =>
    apiClient.post('/auth/logout'),

  // 다중 세션 관리
  logoutAll: (): Promise<ApiResponse<MessageResponse>> =>
    apiClient.post('/auth/logout-all'),

  getActiveSessions: (): Promise<ApiResponse<SessionsResponse>> =>
    apiClient.get('/auth/sessions'),

  refresh: (): Promise<ApiResponse<TokenResponse>> =>
    apiClient.post('/auth/refresh', undefined, { skipAuth: true }),

  getMe: (token?: string): Promise<ApiResponse<User>> =>
    apiClient.get('/auth/me', token ? { token } : undefined),

  changePassword: (data: ChangePasswordRequest): Promise<ApiResponse<MessageResponse>> =>
    apiClient.post('/auth/change-password', data),

  forgotPassword: (email: string): Promise<ApiResponse<MessageResponse>> =>
    apiClient.post('/auth/password/forgot', { email }, { skipAuth: true }),

  resetPassword: (token: string, password: string): Promise<ApiResponse<MessageResponse>> =>
    apiClient.post('/auth/password/reset', { token, password, passwordConfirm: password }, { skipAuth: true }),

  sendVerificationEmail: (email: string): Promise<ApiResponse<MessageResponse>> =>
    apiClient.post('/auth/email/send-verification', { email }, { skipAuth: true }),

  verifyEmail: (token: string): Promise<ApiResponse<MessageResponse>> =>
    apiClient.post('/auth/email/verify', { token }, { skipAuth: true }),

  // OAuth URLs
  getGoogleAuthUrl: (): string =>
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/google`,

  getKakaoAuthUrl: (): string =>
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/kakao`,

  getGithubAuthUrl: (): string =>
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/github`,
};

export type {
  RegisterRequest,
  LoginRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  TokenResponse,
  MessageResponse,
  SessionsResponse,
};
