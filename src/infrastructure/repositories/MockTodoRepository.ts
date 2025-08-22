import { TodoRepository, TodoFilters } from '../../domain/repositories/TodoRepository';
import { Todo, TodoPriority, TodoCategory } from '../../domain/entities/Todo';
import { Result, PaginatedResponse } from '@/shared/types/common';

// Mock data for development
const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Complete project setup',
    description: 'Set up the entire architecture and basic components',
    completed: false,
    priority: TodoPriority.HIGH,
    category: TodoCategory.WORK,
    userId: '1',
    dueDate: new Date('2025-02-01'),
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, and vegetables',
    completed: false,
    priority: TodoPriority.MEDIUM,
    category: TodoCategory.SHOPPING,
    userId: '1',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
];

export const createMockTodoRepository = (): TodoRepository => ({
  findById: async (id: string): Promise<Result<Todo | null>> => {
    try {
      const todo = mockTodos.find(t => t.id === id) || null;
      return { success: true, data: todo };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  findMany: async (
    filters: TodoFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<Result<PaginatedResponse<Todo>>> => {
    try {
      let filteredTodos = mockTodos;

      // Apply filters
      if (filters.userId) {
        filteredTodos = filteredTodos.filter(t => t.userId === filters.userId);
      }
      if (filters.completed !== undefined) {
        filteredTodos = filteredTodos.filter(t => t.completed === filters.completed);
      }
      if (filters.category) {
        filteredTodos = filteredTodos.filter(t => t.category === filters.category);
      }
      if (filters.priority) {
        filteredTodos = filteredTodos.filter(t => t.priority === filters.priority);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTodos = filteredTodos.filter(t => 
          t.title.toLowerCase().includes(searchLower) ||
          (t.description && t.description.toLowerCase().includes(searchLower))
        );
      }

      // Pagination
      const total = filteredTodos.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedTodos = filteredTodos.slice(startIndex, startIndex + limit);

      const response: PaginatedResponse<Todo> = {
        data: paginatedTodos,
        success: true,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };

      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  create: async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<Todo>> => {
    try {
      const newTodo: Todo = {
        ...todoData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTodos.push(newTodo);
      return { success: true, data: newTodo };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  update: async (id: string, updates: Partial<Todo>): Promise<Result<Todo>> => {
    try {
      const todoIndex = mockTodos.findIndex(t => t.id === id);
      if (todoIndex === -1) {
        return { success: false, error: new Error('Todo not found') };
      }

      const updatedTodo = {
        ...mockTodos[todoIndex],
        ...updates,
        updatedAt: new Date(),
      };
      mockTodos[todoIndex] = updatedTodo;
      return { success: true, data: updatedTodo };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  delete: async (id: string): Promise<Result<void>> => {
    try {
      const todoIndex = mockTodos.findIndex(t => t.id === id);
      if (todoIndex === -1) {
        return { success: false, error: new Error('Todo not found') };
      }
      mockTodos.splice(todoIndex, 1);
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },
});