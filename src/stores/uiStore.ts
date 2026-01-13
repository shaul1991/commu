'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ============================================
// 타입 정의
// ============================================

/**
 * 모달 종류
 */
export type ModalType =
  | 'login'
  | 'register'
  | 'confirm'
  | 'alert'
  | 'postWrite'
  | 'postDelete'
  | 'commentDelete'
  | 'userProfile'
  | 'settings'
  | 'share'
  | 'report'
  | null;

/**
 * 모달 데이터 (모달 종류에 따라 다른 데이터)
 */
export interface ModalData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  // 특정 모달에서 사용하는 데이터
  postId?: string;
  commentId?: string;
  userId?: string;
  shareUrl?: string;
  reportTargetType?: 'post' | 'comment' | 'user';
  reportTargetId?: string;
}

/**
 * 토스트 알림 종류
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * 토스트 알림 데이터
 */
export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms, 기본값 3000
}

// ============================================
// 상태 및 액션 정의
// ============================================

interface SidebarState {
  isOpen: boolean;
}

interface ModalState {
  type: ModalType;
  data: ModalData | null;
}

interface ToastState {
  toasts: Toast[];
}

interface UIState extends SidebarState, ModalState, ToastState {
  // 추가 UI 상태
  isLoading: boolean; // 전역 로딩 상태
  isMobileMenuOpen: boolean; // 모바일 메뉴 상태
}

interface UIActions {
  // 사이드바 액션
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

  // 모달 액션
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;

  // 토스트 액션
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // 로딩 액션
  setLoading: (isLoading: boolean) => void;

  // 모바일 메뉴 액션
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

type UIStore = UIState & UIActions;

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 고유 ID 생성
 */
function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================
// Zustand 스토어
// ============================================

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      // =====================================
      // 초기 상태
      // =====================================

      // 사이드바
      isOpen: true,

      // 모달
      type: null,
      data: null,

      // 토스트
      toasts: [],

      // 로딩
      isLoading: false,

      // 모바일 메뉴
      isMobileMenuOpen: false,

      // =====================================
      // 사이드바 액션
      // =====================================

      openSidebar: () => set({ isOpen: true }, false, 'sidebar/open'),

      closeSidebar: () => set({ isOpen: false }, false, 'sidebar/close'),

      toggleSidebar: () =>
        set((state) => ({ isOpen: !state.isOpen }), false, 'sidebar/toggle'),

      // =====================================
      // 모달 액션
      // =====================================

      openModal: (type, data) =>
        set({ type, data: data ?? null }, false, 'modal/open'),

      closeModal: () => set({ type: null, data: null }, false, 'modal/close'),

      // =====================================
      // 토스트 액션
      // =====================================

      addToast: (toast) => {
        const id = generateToastId();
        const newToast: Toast = {
          ...toast,
          id,
          duration: toast.duration ?? 3000,
        };

        set(
          (state) => ({ toasts: [...state.toasts, newToast] }),
          false,
          'toast/add'
        );

        // 자동 제거
        if (newToast.duration && newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, newToast.duration);
        }
      },

      removeToast: (id) =>
        set(
          (state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
          }),
          false,
          'toast/remove'
        ),

      clearToasts: () => set({ toasts: [] }, false, 'toast/clear'),

      // =====================================
      // 로딩 액션
      // =====================================

      setLoading: (isLoading) =>
        set({ isLoading }, false, 'loading/set'),

      // =====================================
      // 모바일 메뉴 액션
      // =====================================

      openMobileMenu: () =>
        set({ isMobileMenuOpen: true }, false, 'mobileMenu/open'),

      closeMobileMenu: () =>
        set({ isMobileMenuOpen: false }, false, 'mobileMenu/close'),

      toggleMobileMenu: () =>
        set(
          (state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }),
          false,
          'mobileMenu/toggle'
        ),
    }),
    {
      name: 'commu-ui-store',
    }
  )
);

// ============================================
// 편의 훅
// ============================================

/**
 * 사이드바 상태만 선택
 */
export const useSidebar = () =>
  useUIStore((state) => ({
    isOpen: state.isOpen,
    open: state.openSidebar,
    close: state.closeSidebar,
    toggle: state.toggleSidebar,
  }));

/**
 * 모달 상태만 선택
 */
export const useModal = () =>
  useUIStore((state) => ({
    type: state.type,
    data: state.data,
    open: state.openModal,
    close: state.closeModal,
    isOpen: state.type !== null,
  }));

/**
 * 토스트 상태만 선택
 */
export const useToast = () =>
  useUIStore((state) => ({
    toasts: state.toasts,
    add: state.addToast,
    remove: state.removeToast,
    clear: state.clearToasts,
  }));

/**
 * 편의 토스트 함수
 */
export const toast = {
  success: (message: string, title?: string) =>
    useUIStore.getState().addToast({ type: 'success', message, title }),

  error: (message: string, title?: string) =>
    useUIStore.getState().addToast({ type: 'error', message, title }),

  warning: (message: string, title?: string) =>
    useUIStore.getState().addToast({ type: 'warning', message, title }),

  info: (message: string, title?: string) =>
    useUIStore.getState().addToast({ type: 'info', message, title }),
};
