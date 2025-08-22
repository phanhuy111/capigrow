import { BaseEntity } from '@/shared/types/common';

export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
}

export const createUser = (
  data: Pick<User, 'email' | 'name'> & { avatar?: string }
): Omit<User, 'id' | 'createdAt' | 'updatedAt'> => ({
  ...data,
  preferences: {
    theme: 'system',
    notifications: true,
    language: 'en',
  },
});

export const updateUserPreferences = (
  user: User,
  preferences: Partial<UserPreferences>
): User => ({
  ...user,
  preferences: { ...user.preferences, ...preferences },
  updatedAt: new Date(),
});