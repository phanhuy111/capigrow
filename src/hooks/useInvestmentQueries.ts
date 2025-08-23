import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Investment, UserInvestment } from '../types';
import apiService from '../services/api';

// Query keys
export const investmentKeys = {
  all: ['investments'] as const,
  lists: () => [...investmentKeys.all, 'list'] as const,
  list: (filters: string) => [...investmentKeys.lists(), { filters }] as const,
  details: () => [...investmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...investmentKeys.details(), id] as const,
  userInvestments: () => [...investmentKeys.all, 'user'] as const,
};

// Get all investments query
export const useInvestmentsQuery = () => {
  return useQuery({
    queryKey: investmentKeys.lists(),
    queryFn: async () => {
      const response = await apiService.getInvestments();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as Investment[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single investment query
export const useInvestmentQuery = (id: string) => {
  return useQuery({
    queryKey: investmentKeys.detail(id),
    queryFn: async () => {
      const response = await apiService.getInvestment(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as Investment;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user investments query (from portfolio)
export const useUserInvestmentsQuery = () => {
  return useQuery({
    queryKey: investmentKeys.userInvestments(),
    queryFn: async () => {
      const response = await apiService.getPortfolio();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data.investments as UserInvestment[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Register for investment mutation
export const useRegisterInvestmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const response = await apiService.registerInvestment(id, amount);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch investments
      queryClient.invalidateQueries({ queryKey: investmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: investmentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: investmentKeys.userInvestments() });
    },
  });
};