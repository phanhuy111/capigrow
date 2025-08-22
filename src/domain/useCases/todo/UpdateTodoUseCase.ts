import { TodoRepository } from '../../repositories/TodoRepository';
import { Todo, updateTodo } from '../../entities/Todo';
import { Result } from '@/shared/types/common';

export const createUpdateTodoUseCase = (todoRepository: TodoRepository) =>
  async (id: string, updates: Partial<Todo>): Promise<Result<Todo>> => {
    if (!id) {
      return { success: false, error: new Error('Todo ID is required') };
    }

    const existingTodoResult = await todoRepository.findById(id);
    if (!existingTodoResult.success) {
      return existingTodoResult;
    }

    if (!existingTodoResult.data) {
      return { success: false, error: new Error('Todo not found') };
    }

    const updatedTodo = updateTodo(existingTodoResult.data, updates);
    return await todoRepository.update(id, updatedTodo);
  };

export type UpdateTodoUseCase = ReturnType<typeof createUpdateTodoUseCase>;