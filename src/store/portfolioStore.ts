import { create } from 'zustand';
import { PortfolioState, Portfolio } from '@/types';
import apiService from '@/services/api';

interface PortfolioStore extends PortfolioState {
  // Actions
  fetchPortfolio: () => Promise<void>;
  fetchPortfolioPerformance: () => Promise<void>;
  clearError: () => void;
  clearPortfolio: () => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  // Initial state
  portfolio: null,
  performance: null,
  isLoading: false,
  error: null,

  // Actions
  fetchPortfolio: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getPortfolio();
      if (response.error) {
        throw new Error(response.error);
      }
      set({
        isLoading: false,
        portfolio: response.data,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch portfolio',
      });
      throw error;
    }
  },

  fetchPortfolioPerformance: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getPortfolioPerformance();
      if (response.error) {
        throw new Error(response.error);
      }
      set({
        isLoading: false,
        performance: response.data,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch portfolio performance',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearPortfolio: () => {
    set({ portfolio: null, performance: null });
  },
}));