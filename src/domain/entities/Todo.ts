import { BaseEntity } from '@/shared/types/common';

export interface Todo extends BaseEntity {
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  category: TodoCategory;
  userId: string;
  dueDate?: Date;
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TodoCategory {
  PERSONAL = 'personal',
  WORK = 'work',
  SHOPPING = 'shopping',
  HEALTH = 'health',
}

export const createTodo = (
  data: Pick<Todo, 'title' | 'userId'> & Partial<Pick<Todo, 'description' | 'priority' | 'category' | 'dueDate'>>
): Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: data.title,
  description: data.description,
  completed: false,
  priority: data.priority ?? TodoPriority.MEDIUM,
  category: data.category ?? TodoCategory.PERSONAL,
  userId: data.userId,
  dueDate: data.dueDate,
});

export const toggleTodoCompletion = (todo: Todo): Todo => ({
  ...todo,
  completed: !todo.completed,
  updatedAt: new Date(),
});

export const updateTodo = (
  todo: Todo,
  updates: Partial<Pick<Todo, 'title' | 'description' | 'priority' | 'category' | 'dueDate'>>
): Todo => ({
  ...todo,
  ...updates,
  updatedAt: new Date(),
});