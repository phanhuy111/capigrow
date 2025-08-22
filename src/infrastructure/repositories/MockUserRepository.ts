import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { Result } from '@/shared/types/common';

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    preferences: {
      theme: 'system',
      notifications: true,
      language: 'en',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const createMockUserRepository = (): UserRepository => ({
  findById: async (id: string): Promise<Result<User | null>> => {
    try {
      const user = mockUsers.find(u => u.id === id) || null;
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  findByEmail: async (email: string): Promise<Result<User | null>> => {
    try {
      const user = mockUsers.find(u => u.email === email) || null;
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  create: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<User>> => {
    try {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsers.push(newUser);
      return { success: true, data: newUser };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  update: async (id: string, updates: Partial<User>): Promise<Result<User>> => {
    try {
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return { success: false, error: new Error('User not found') };
      }

      const updatedUser = {
        ...mockUsers[userIndex],
        ...updates,
        updatedAt: new Date(),
      };
      mockUsers[userIndex] = updatedUser;
      return { success: true, data: updatedUser };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  delete: async (id: string): Promise<Result<void>> => {
    try {
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return { success: false, error: new Error('User not found') };
      }
      mockUsers.splice(userIndex, 1);
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },
});