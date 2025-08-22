// Dependency Injection Container using functional approach
import { createMockUserRepository } from '../repositories/MockUserRepository';
import { createMockTodoRepository } from '../repositories/MockTodoRepository';
import { createGetUserUseCase } from '../../domain/useCases/user/GetUserUseCase';
import { createUpdateUserUseCase } from '../../domain/useCases/user/UpdateUserUseCase';
import { createGetTodosUseCase } from '../../domain/useCases/todo/GetTodosUseCase';
import { createCreateTodoUseCase } from '../../domain/useCases/todo/CreateTodoUseCase';
import { createUpdateTodoUseCase } from '../../domain/useCases/todo/UpdateTodoUseCase';

// Repository instances
export const userRepository = createMockUserRepository();
export const todoRepository = createMockTodoRepository();

// Use case instances
export const getUserUseCase = createGetUserUseCase(userRepository);
export const updateUserUseCase = createUpdateUserUseCase(userRepository);
export const getTodosUseCase = createGetTodosUseCase(todoRepository);
export const createTodoUseCase = createCreateTodoUseCase(todoRepository);
export const updateTodoUseCase = createUpdateTodoUseCase(todoRepository);

// Container type for dependency injection
export interface DIContainer {
  userRepository: typeof userRepository;
  todoRepository: typeof todoRepository;
  getUserUseCase: typeof getUserUseCase;
  updateUserUseCase: typeof updateUserUseCase;
  getTodosUseCase: typeof getTodosUseCase;
  createTodoUseCase: typeof createTodoUseCase;
  updateTodoUseCase: typeof updateTodoUseCase;
}

export const createDIContainer = (): DIContainer => ({
  userRepository,
  todoRepository,
  getUserUseCase,
  updateUserUseCase,
  getTodosUseCase,
  createTodoUseCase,
  updateTodoUseCase,
});