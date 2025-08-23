import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '@/types';
import apiService from '@/services/api';

// Query keys
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: string) => [...transactionKeys.lists(), { filters }] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

// Get all transactions query
export const useTransactionsQuery = () => {
  return useQuery({
    queryKey: transactionKeys.lists(),
    queryFn: async () => {
      const response = await apiService.getTransactions();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as Transaction[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single transaction query
export const useTransactionQuery = (id: string) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: async () => {
      const response = await apiService.getTransaction(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as Transaction;
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
      const response = await apiService.processPayment(paymentData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      // Also invalidate portfolio as it might be affected
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });
};