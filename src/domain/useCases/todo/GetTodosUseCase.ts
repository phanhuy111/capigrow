import { TodoRepository, TodoFilters } from '../../repositories/TodoRepository';
import { Todo } from '../../entities/Todo';
import { Result, PaginatedResponse } from '@/shared/types/common';

export const createGetTodosUseCase = (todoRepository: TodoRepository) =>
  async (
    filters: TodoFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<Result<PaginatedResponse<Todo>>> => {
    return await todoRepository.findMany(filters, page, limit);
  };

export type GetTodosUseCase = ReturnType<typeof createGetTodosUseCase>;