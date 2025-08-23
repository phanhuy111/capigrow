import { create } from 'zustand';
import { AuthState, User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';
import apiService from '@/services/api';
import { setToken, setRefreshToken, setUserData, clearAllData } from '@/services/storage';

interface AuthStore extends AuthState {
  // Actions
  loginUser: (credentials: LoginRequest) => Promise<void>;
  registerUser: (userData: RegisterRequest) => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  setAuthData: (authData: AuthResponse) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  loginUser: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.login(credentials.email, credentials.password);
      if (response.error) {
        throw new Error(response.error);
      }

      const authData: AuthResponse = response.data;
      // Validate tokens before storing
      if (!authData.access_token || !authData.refresh_token) {
        throw new Error('Invalid response: missing tokens');
      }

      // Store tokens and user data
      await setToken(authData.access_token);
      await setRefreshToken(authData.refresh_token);
      await setUserData(authData.user);

      set({
        isLoading: false,
        user: authData.user,
        token: authData.access_token,
        refreshToken: authData.refresh_token,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Login failed',
      });
      throw error;
    }
  },

  registerUser: async (userData: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.register(userData);
      if (response.error) {
        throw new Error(response.error);
      }

      const authData: AuthResponse = response.data;
      // Validate tokens before storing
      if (!authData.access_token || !authData.refresh_token) {
        throw new Error('Invalid response: missing tokens');
      }

      // Store tokens and user data
      await setToken(authData.access_token);
      await setRefreshToken(authData.refresh_token);
      await setUserData(authData.user);

      set({
        isLoading: false,
        user: authData.user,
        token: authData.access_token,
        refreshToken: authData.refresh_token,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Registration failed',
      });
      throw error;
    }
  },

  logoutUser: async () => {
    set({ isLoading: true });
    try {
      await clearAllData();
      set({
        isLoading: false,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      // Even if logout fails, clear local state
      set({
        isLoading: false,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  refreshToken: async () => {
    try {
      const currentState = get();
      if (!currentState.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.refreshToken(currentState.refreshToken);
      if (response.error) {
        throw new Error(response.error);
      }

      const authData: AuthResponse = response.data;
      await setToken(authData.access_token);
      await setRefreshToken(authData.refresh_token);

      set({
        token: authData.access_token,
        refreshToken: authData.refresh_token,
      });
    } catch (error) {
      // If refresh fails, clear auth state
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await apiService.getProfile();
      if (response.error) {
        throw new Error(response.error);
      }

      set({ user: response.data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to get profile' });
      throw error;
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.updateProfile(userData);
      if (response.error) {
        throw new Error(response.error);
      }

      set({
        isLoading: false,
        user: response.data,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to update profile',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setAuthData: (authData: AuthResponse) => {
    set({
      user: authData.user,
      token: authData.access_token,
      refreshToken: authData.refresh_token,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));