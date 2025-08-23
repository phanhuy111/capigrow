import { useQuery } from '@tanstack/react-query';
import { Portfolio } from '../types';
import apiService from '../services/api';

// Query keys
export const portfolioKeys = {
  all: ['portfolio'] as const,
  details: () => [...portfolioKeys.all, 'detail'] as const,
  performance: () => [...portfolioKeys.all, 'performance'] as const,
};

// Get portfolio query
export const usePortfolioQuery = () => {
  return useQuery({
    queryKey: portfolioKeys.details(),
    queryFn: async () => {
      const response = await apiService.getPortfolio();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as Portfolio;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get portfolio performance query
export const usePortfolioPerformanceQuery = () => {
  return useQuery({
    queryKey: portfolioKeys.performance(),
    queryFn: async () => {
      const response = await apiService.getPortfolioPerformance();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};