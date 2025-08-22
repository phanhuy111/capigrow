import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../../domain/entities/User';
import { storage, setItem, getItem, removeItem } from '../../infrastructure/storage/MMKVStorage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const mmkvStorage = {
  getItem: (name: string) => {
    const value = getItem<string>(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    setItem(name, value);
  },
  removeItem: (name: string) => {
    removeItem(name);
  },
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true,
        isLoading: false 
      }),
      
      logout: () => {
        removeItem('auth_token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      },
      
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Functional selectors
export const selectUser = (state: AuthState & AuthActions) => state.user;
export const selectIsAuthenticated = (state: AuthState & AuthActions) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState & AuthActions) => state.isLoading;