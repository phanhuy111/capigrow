import { create } from 'zustand';
import { TransactionState, Transaction } from '@/types';
import apiService from '@/services/api';

interface TransactionStore extends TransactionState {
  // Actions
  fetchTransactions: () => Promise<void>;
  fetchTransaction: (id: string) => Promise<void>;
  processPayment: (paymentData: any) => Promise<void>;
  clearError: () => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  // Initial state
  transactions: [],
  isLoading: false,
  error: null,

  // Actions
  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getTransactions();
      if (response.error) {
        throw new Error(response.error);
      }
      set({
        isLoading: false,
        transactions: response.data,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch transactions',
      });
      throw error;
    }
  },

  fetchTransaction: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getTransaction(id);
      if (response.error) {
        throw new Error(response.error);
      }
      
      const currentState = get();
      const transactions = [...currentState.transactions];
      const index = transactions.findIndex(t => t.id === response.data.id);
      
      if (index >= 0) {
        transactions[index] = response.data;
      } else {
        transactions.push(response.data);
      }
      
      set({
        isLoading: false,
        transactions,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch transaction',
      });
      throw error;
    }
  },

  processPayment: async (paymentData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.processPayment(paymentData);
      if (response.error) {
        throw new Error(response.error);
      }
      
      const currentState = get();
      set({
        isLoading: false,
        transactions: [response.data, ...currentState.transactions],
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to process payment',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearTransactions: () => {
    set({ transactions: [] });
  },
}));