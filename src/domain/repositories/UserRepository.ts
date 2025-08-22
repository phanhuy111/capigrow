import { User } from '../entities/User';
import { Result } from '@/shared/types/common';

export interface UserRepository {
  findById: (id: string) => Promise<Result<User | null>>;
  findByEmail: (email: string) => Promise<Result<User | null>>;
  create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Result<User>>;
  update: (id: string, user: Partial<User>) => Promise<Result<User>>;
  delete: (id: string) => Promise<Result<void>>;
}