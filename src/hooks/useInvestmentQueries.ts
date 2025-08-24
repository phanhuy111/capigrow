import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Investment, UserInvestment } from '@/types';
import investmentService from '@/services/investmentService';

// Query keys
export const investmentKeys = {
  all: ['investments'] as const,
  lists: () => [...investmentKeys.all, 'list'] as const,
  list: (filters: string) => [...investmentKeys.lists(), { filters }] as const,
  details: () => [...investmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...investmentKeys.details(), id] as const,
  userInvestments: () => [...investmentKeys.all, 'user'] as const,
  categories: () => [...investmentKeys.all, 'categories'] as const,
};

// Get all investments query
export const useInvestmentsQuery = () => {
  return useQuery({
    queryKey: investmentKeys.lists(),
    queryFn: async () => {
      const response = await investmentService.getInvestments();
      if (!response.success) {
        throw new Error(response.message || 'Failed to get investments');
      }
      return response.investments;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single investment query
export const useInvestmentQuery = (id: string) => {
  return useQuery({
    queryKey: investmentKeys.detail(id),
    queryFn: async () => {
      const response = await investmentService.getInvestment(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to get investment');
      }
      return response.investment;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user investments query
export const useUserInvestmentsQuery = () => {
  return useQuery({
    queryKey: investmentKeys.userInvestments(),
    queryFn: async () => {
      // Note: This should be handled by portfolioService or a separate endpoint
      // For now, we'll get all investments and filter user's investments
      const response = await investmentService.getInvestments();
      if (!response.success) {
        throw new Error(response.message || 'Failed to get user investments');
      }
      return response.investments;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get investment categories query
export const useInvestmentCategoriesQuery = () => {
  return useQuery({
    queryKey: investmentKeys.categories(),
    queryFn: async () => {
      const response = await investmentService.getCategories();
      if (!response.success) {
        throw new Error(response.message || 'Failed to get categories');
      }
      return response.categories;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
  });
};

// Register for investment mutation
export const useRegisterInvestmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount, paymentMethod, notes }: { id: string; amount: number; paymentMethod?: string; notes?: string }) => {
      const response = await investmentService.registerInvestment(id, { amount, paymentMethod, notes });
      if (!response.success) {
        throw new Error(response.message || 'Failed to register investment');
      }
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate user investments to refetch
      queryClient.invalidateQueries({ queryKey: investmentKeys.userInvestments() });
      // Also invalidate the specific investment
      queryClient.invalidateQueries({ queryKey: investmentKeys.detail(variables.id) });
    },
  });
};