import { TodoRepository } from '../../repositories/TodoRepository';
import { Todo, createTodo } from '../../entities/Todo';
import { Result } from '@/shared/types/common';

interface CreateTodoData {
  title: string;
  description?: string;
  priority?: Todo['priority'];
  category?: Todo['category'];
  dueDate?: Date;
}

export const createCreateTodoUseCase = (todoRepository: TodoRepository) =>
  async (userId: string, data: CreateTodoData): Promise<Result<Todo>> => {
    if (!userId) {
      return { success: false, error: new Error('User ID is required') };
    }

    if (!data.title.trim()) {
      return { success: false, error: new Error('Todo title is required') };
    }

    const todoData = createTodo({ ...data, userId });
    return await todoRepository.create(todoData);
  };

export type CreateTodoUseCase = ReturnType<typeof createCreateTodoUseCase>;