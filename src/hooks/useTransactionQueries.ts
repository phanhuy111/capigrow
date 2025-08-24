import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '@/types';
import transactionService from '@/services/transactionService';

// Query keys
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: string) => [...transactionKeys.lists(), { filters }] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

// Get transactions query
export const useTransactionsQuery = (filters?: any) => {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: async () => {
      const response = await transactionService.getTransactions(filters);
      if (!response.success) {
        throw new Error(response.message || 'Failed to get transactions');
      }
      return response.transactions;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get transaction by ID query
export const useTransactionQuery = (id: string) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: async () => {
      const response = await transactionService.getTransaction(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to get transaction');
      }
      return response.transaction;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Process payment mutation
export const useProcessPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await transactionService.processPayment(paymentData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to process payment');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate transactions list to refetch
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
};