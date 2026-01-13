/**
 * User Mock 데이터 팩토리
 */

import { faker } from '@faker-js/faker/locale/ko';
import type { User } from '@/types';

export interface CreateMockUserOptions {
  id?: string;
  email?: string;
  username?: string;
  displayName?: string;
  profileImage?: string;
  bio?: string;
  isEmailVerified?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mock User 데이터 생성
 */
export function createMockUser(options: CreateMockUserOptions = {}): User {
  const now = new Date();
  const createdAt = options.createdAt ?? faker.date.past({ years: 2 });

  return {
    id: options.id ?? faker.string.uuid(),
    email: options.email ?? faker.internet.email(),
    username: options.username ?? faker.internet.username(),
    displayName: options.displayName ?? faker.person.fullName(),
    profileImage: options.profileImage ?? faker.image.avatar(),
    bio: options.bio ?? faker.lorem.sentence(),
    isEmailVerified: options.isEmailVerified ?? true,
    isActive: options.isActive ?? true,
    createdAt,
    updatedAt: options.updatedAt ?? faker.date.between({ from: createdAt, to: now }),
  };
}

/**
 * 다수의 Mock User 데이터 생성
 */
export function createMockUsers(count: number, options: CreateMockUserOptions = {}): User[] {
  return Array.from({ length: count }, () => createMockUser(options));
}

/**
 * 비활성 사용자 Mock 데이터 생성
 */
export function createMockInactiveUser(options: CreateMockUserOptions = {}): User {
  return createMockUser({
    ...options,
    isActive: false,
  });
}

/**
 * 이메일 미인증 사용자 Mock 데이터 생성
 */
export function createMockUnverifiedUser(options: CreateMockUserOptions = {}): User {
  return createMockUser({
    ...options,
    isEmailVerified: false,
  });
}
