import { useQuery } from "@tanstack/react-query";
import portfolioService from "@/services/portfolioService";

// Query keys
const portfolioKeys = {
  all: ["portfolio"] as const,
  details: () => [...portfolioKeys.all, "detail"] as const,
  performance: (period?: string) => [...portfolioKeys.all, "performance", period] as const,
};

// Get portfolio query
export const usePortfolioQuery = () => {
  return useQuery({
    queryKey: portfolioKeys.details(),
    queryFn: async () => {
      const response = await portfolioService.getPortfolio();
      if (!response.success) {
        throw new Error(response.message || "Failed to get portfolio");
      }
      return {
        summary: response.summary,
        investments: response.investments,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get portfolio performance query
export const usePortfolioPerformanceQuery = (
  period?: "daily" | "weekly" | "monthly" | "yearly"
) => {
  return useQuery({
    queryKey: portfolioKeys.performance(period),
    queryFn: async () => {
      const response = await portfolioService.getPortfolioPerformance(
        period ? { period } : undefined
      );
      if (!response.success) {
        throw new Error(response.message || "Failed to get portfolio performance");
      }
      return response.performance;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
