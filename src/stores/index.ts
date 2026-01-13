/**
 * Zustand 스토어 - Barrel Export
 *
 * 사용 예시:
 * import { useAuthStore, useUIStore, useSidebar, useModal, toast } from '@/stores';
 */

// Auth Store
export { useAuthStore, type User } from './authStore';

// UI Store
export {
  useUIStore,
  useSidebar,
  useModal,
  useToast,
  toast,
  type ModalType,
  type ModalData,
  type ToastType,
  type Toast,
} from './uiStore';
