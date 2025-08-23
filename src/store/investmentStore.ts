import { create } from 'zustand';
import { InvestmentState, Investment, UserInvestment } from '@/types';
import apiService from '@/services/api';

interface InvestmentStore extends InvestmentState {
  // Actions
  fetchInvestments: () => Promise<void>;
  fetchInvestment: (id: string) => Promise<void>;
  registerForInvestment: (id: string, amount: number) => Promise<void>;
  clearError: () => void;
  setSelectedInvestment: (investment: Investment | null) => void;
  clearSelectedInvestment: () => void;
}

export const useInvestmentStore = create<InvestmentStore>((set, get) => ({
  // Initial state
  investments: [],
  userInvestments: [],
  selectedInvestment: null,
  isLoading: false,
  error: null,

  // Actions
  fetchInvestments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getInvestments();
      if (response.error) {
        throw new Error(response.error);
      }
      set({
        isLoading: false,
        investments: response.data,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch investments',
      });
      throw error;
    }
  },

  fetchInvestment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getInvestment(id);
      if (response.error) {
        throw new Error(response.error);
      }
      set({
        isLoading: false,
        selectedInvestment: response.data,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch investment',
      });
      throw error;
    }
  },

  registerForInvestment: async (id: string, amount: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.registerInvestment(id, amount);
      if (response.error) {
        throw new Error(response.error);
      }
      const currentState = get();
      set({
        isLoading: false,
        userInvestments: [...currentState.userInvestments, response.data],
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to register for investment',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setSelectedInvestment: (investment: Investment | null) => {
    set({ selectedInvestment: investment });
  },

  clearSelectedInvestment: () => {
    set({ selectedInvestment: null });
  },
}));