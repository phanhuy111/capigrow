import { create } from "zustand";
import type { User } from "@/types";

// Client-only state for authentication
interface AuthClientState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Client actions
  setAuthData: (user: User, token: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthClientStore = create<AuthClientState>((set) => ({
  // Initial state
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,

  // Actions
  setAuthData: (user: User, token: string, refreshToken: string) => {
    set({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  updateUser: (userData: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },
}));
