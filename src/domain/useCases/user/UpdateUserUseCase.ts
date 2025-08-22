import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../entities/User';
import { Result } from '@/shared/types/common';

export const createUpdateUserUseCase = (userRepository: UserRepository) =>
  async (id: string, userData: Partial<User>): Promise<Result<User>> => {
    if (!id) {
      return { success: false, error: new Error('User ID is required') };
    }

    return await userRepository.update(id, userData);
  };

export type UpdateUserUseCase = ReturnType<typeof createUpdateUserUseCase>;