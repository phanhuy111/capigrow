import { Todo } from '../entities/Todo';
import { Result, PaginatedResponse } from '@/shared/types/common';

export interface TodoFilters {
  userId?: string;
  completed?: boolean;
  category?: string;
  priority?: string;
  search?: string;
}

export interface TodoRepository {
  findById: (id: string) => Promise<Result<Todo | null>>;
  findMany: (filters: TodoFilters, page?: number, limit?: number) => Promise<Result<PaginatedResponse<Todo>>>;
  create: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Result<Todo>>;
  update: (id: string, todo: Partial<Todo>) => Promise<Result<Todo>>;
  delete: (id: string) => Promise<Result<void>>;
}