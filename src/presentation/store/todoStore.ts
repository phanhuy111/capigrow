import { create } from 'zustand';
import { Todo, TodoPriority, TodoCategory } from '../../domain/entities/Todo';

interface TodoFilters {
  search: string;
  category: TodoCategory | 'all';
  priority: TodoPriority | 'all';
  showCompleted: boolean;
}

interface TodoState {
  selectedTodo: Todo | null;
  filters: TodoFilters;
  isCreating: boolean;
  isEditing: boolean;
}

interface TodoActions {
  setSelectedTodo: (todo: Todo | null) => void;
  updateFilters: (filters: Partial<TodoFilters>) => void;
  resetFilters: () => void;
  setCreating: (creating: boolean) => void;
  setEditing: (editing: boolean) => void;
}

const initialFilters: TodoFilters = {
  search: '',
  category: 'all',
  priority: 'all',
  showCompleted: true,
};

export const useTodoStore = create<TodoState & TodoActions>((set) => ({
  // State
  selectedTodo: null,
  filters: initialFilters,
  isCreating: false,
  isEditing: false,

  // Actions
  setSelectedTodo: (selectedTodo) => set({ selectedTodo }),
  
  updateFilters: (filterUpdates) => 
    set((state) => ({
      filters: { ...state.filters, ...filterUpdates }
    })),
    
  resetFilters: () => set({ filters: initialFilters }),
  
  setCreating: (isCreating) => set({ isCreating }),
  
  setEditing: (isEditing) => set({ isEditing }),
}));

// Functional selectors
export const selectSelectedTodo = (state: TodoState & TodoActions) => state.selectedTodo;
export const selectFilters = (state: TodoState & TodoActions) => state.filters;
export const selectIsCreating = (state: TodoState & TodoActions) => state.isCreating;
export const selectIsEditing = (state: TodoState & TodoActions) => state.isEditing;