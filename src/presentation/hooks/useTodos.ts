import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTodosUseCase, 
  createTodoUseCase, 
  updateTodoUseCase 
} from '../../infrastructure/di/container';
import { Todo } from '../../domain/entities/Todo';
import { TodoFilters } from '../../domain/repositories/TodoRepository';

// Query keys factory
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: TodoFilters) => [...todoKeys.lists(), filters] as const,
  detail: (id: string) => [...todoKeys.all, 'detail', id] as const,
};

// Custom hooks
export const useTodos = (filters: TodoFilters = {}, page: number = 1, limit: number = 20) =>
  useQuery({
    queryKey: todoKeys.list(filters),
    queryFn: () => getTodosUseCase(filters, page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Parameters<typeof createTodoUseCase>[1] }) =>
      createTodoUseCase(userId, data),
    onSuccess: () => {
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Todo> }) =>
      updateTodoUseCase(id, updates),
    onSuccess: (result, variables) => {
      if (result.success) {
        // Update specific todo in cache
        queryClient.setQueryData(todoKeys.detail(variables.id), result);
        // Invalidate todo lists
        queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      }
    },
  });
};

// Higher-order hook for todo operations
export const useTodoOperations = () => {
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  const toggleTodoCompletion = (todo: Todo) =>
    updateTodo.mutate({
      id: todo.id,
      updates: { completed: !todo.completed }
    });

  return {
    createTodo: createTodo.mutate,
    updateTodo: updateTodo.mutate,
    toggleTodoCompletion,
    isCreating: createTodo.isPending,
    isUpdating: updateTodo.isPending,
  };
};