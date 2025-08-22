import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../entities/User';
import { Result } from '@/shared/types/common';

export const createGetUserUseCase = (userRepository: UserRepository) => 
  async (id: string): Promise<Result<User | null>> => {
    if (!id) {
      return { success: false, error: new Error('User ID is required') };
    }

    return await userRepository.findById(id);
  };

export type GetUserUseCase = ReturnType<typeof createGetUserUseCase>;