import { create } from 'zustand';

interface TransactionClientState {
  // UI state
  selectedTransactionType: 'deposit' | 'withdrawal' | 'investment' | null;
  amount: string;
  selectedPaymentMethod: string;
  isProcessing: boolean;
  showConfirmation: boolean;
  
  // Filter state
  dateFilter: {
    startDate: Date | null;
    endDate: Date | null;
  };
  typeFilter: string[];
  statusFilter: string[];
  
  // Actions
  setSelectedTransactionType: (type: 'deposit' | 'withdrawal' | 'investment' | null) => void;
  setAmount: (amount: string) => void;
  setSelectedPaymentMethod: (method: string) => void;
  setIsProcessing: (processing: boolean) => void;
  setShowConfirmation: (show: boolean) => void;
  setDateFilter: (startDate: Date | null, endDate: Date | null) => void;
  setTypeFilter: (types: string[]) => void;
  setStatusFilter: (statuses: string[]) => void;
  clearFilters: () => void;
  reset: () => void;
}

export const useTransactionClientStore = create<TransactionClientState>((set) => ({
  // Initial state
  selectedTransactionType: null,
  amount: '',
  selectedPaymentMethod: '',
  isProcessing: false,
  showConfirmation: false,
  dateFilter: {
    startDate: null,
    endDate: null,
  },
  typeFilter: [],
  statusFilter: [],

  // Actions
  setSelectedTransactionType: (type) => set({ selectedTransactionType: type }),
  setAmount: (amount) => set({ amount }),
  setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
  setIsProcessing: (processing) => set({ isProcessing: processing }),
  setShowConfirmation: (show) => set({ showConfirmation: show }),
  
  setDateFilter: (startDate, endDate) => set({
    dateFilter: { startDate, endDate }
  }),
  
  setTypeFilter: (types) => set({ typeFilter: types }),
  setStatusFilter: (statuses) => set({ statusFilter: statuses }),
  
  clearFilters: () => set({
    dateFilter: { startDate: null, endDate: null },
    typeFilter: [],
    statusFilter: [],
  }),
  
  reset: () => set({
    selectedTransactionType: null,
    amount: '',
    selectedPaymentMethod: '',
    isProcessing: false,
    showConfirmation: false,
    dateFilter: { startDate: null, endDate: null },
    typeFilter: [],
    statusFilter: [],
  }),
}));