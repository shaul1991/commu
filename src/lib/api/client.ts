const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  token?: string; // 직접 토큰 전달 (로그인 직후 getMe 호출 등)
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * 에러 메시지를 사용자 친화적인 한국어로 변환
 */
function getErrorMessage(statusCode: number, message: string, path?: string): string {
  // 경로별 특화 메시지
  if (path?.includes('/auth/register')) {
    if (statusCode === 409 || message.toLowerCase().includes('email already exists')) {
      return '이미 가입된 이메일입니다. 로그인을 시도하시거나 비밀번호 찾기를 이용해주세요.';
    }
    if (message.includes('비밀번호')) {
      return message; // 이미 한국어
    }
  }

  if (path?.includes('/auth/login')) {
    if (statusCode === 401) {
      return '이메일 또는 비밀번호가 올바르지 않습니다.';
    }
    if (statusCode === 403) {
      return '이메일 인증이 필요합니다. 이메일을 확인해주세요.';
    }
  }

  // 공통 에러 메시지 매핑
  const errorMessages: Record<string, string> = {
    'Email already exists': '이미 가입된 이메일입니다. 로그인을 시도하시거나 비밀번호 찾기를 이용해주세요.',
    'Invalid credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'User not found': '등록되지 않은 이메일입니다.',
    'Invalid token': '인증 토큰이 만료되었거나 유효하지 않습니다.',
    'Token expired': '인증 토큰이 만료되었습니다. 다시 시도해주세요.',
    'Unauthorized': '로그인이 필요합니다.',
    'Forbidden': '접근 권한이 없습니다.',
    'Not found': '요청하신 리소스를 찾을 수 없습니다.',
    'Too many requests': '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  };

  // 정확히 매칭
  if (errorMessages[message]) {
    return errorMessages[message];
  }

  // 부분 매칭
  for (const [key, value] of Object.entries(errorMessages)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // 상태 코드 기반 기본 메시지
  const statusMessages: Record<number, string> = {
    400: '입력값을 확인해주세요.',
    401: '로그인이 필요합니다.',
    403: '접근 권한이 없습니다.',
    404: '요청하신 리소스를 찾을 수 없습니다.',
    409: '이미 존재하는 리소스입니다.',
    422: '요청을 처리할 수 없습니다.',
    429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  };

  return statusMessages[statusCode] || message || '알 수 없는 오류가 발생했습니다.';
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const authStore = localStorage.getItem('commu-auth');
      if (authStore) {
        const parsed = JSON.parse(authStore);
        return parsed.state?.accessToken || null;
      }
    } catch {
      return null;
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { skipAuth = false, token: providedToken, ...fetchConfig } = config;
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchConfig.headers,
    };

    if (!skipAuth) {
      // 직접 제공된 토큰 우선, 없으면 저장된 토큰 사용
      const token = providedToken || this.getAccessToken();
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        // NestJS 에러 응답 형식: { statusCode, message, error, errors?, path? }
        const statusCode = data.statusCode || response.status;
        const rawMessage = data.message || data.error || '';

        // 상세 에러 메시지 추출 (validation errors 등)
        let detailMessage = rawMessage;
        if (data.errors) {
          const errorDetails = Object.values(data.errors).flat();
          if (errorDetails.length > 0) {
            detailMessage = errorDetails.join(' ');
          }
        }

        // 사용자 친화적인 메시지로 변환
        const friendlyMessage = getErrorMessage(statusCode, detailMessage, endpoint);

        return {
          success: false,
          error: {
            code: data.error || `HTTP_${statusCode}`,
            message: friendlyMessage,
            statusCode,
            details: data.errors,
          },
        };
      }

      // 백엔드 응답 구조에 따라 적절히 반환
      // - { data: {...} } 형태: data.data 추출
      // - { data: [...], meta: {...} } 형태: 전체 반환 (페이지네이션)
      const hasMetaWithData = data.data !== undefined && data.meta !== undefined;
      return {
        success: true,
        data: hasMetaWithData ? data : (data.data ?? data),
      };
    } catch {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: '네트워크 오류가 발생했습니다.',
        },
      };
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export type { ApiResponse };
