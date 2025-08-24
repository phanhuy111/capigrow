import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/utils/constants";

// Types for portfolio operations
export interface PortfolioItem {
  id: string;
  investmentId: string;
  investmentName: string;
  category: string;
  riskLevel: "low" | "medium" | "high";
  investedAmount: number;
  currentValue: number;
  returnAmount: number;
  returnPercentage: number;
  status: "active" | "completed" | "cancelled";
  investmentDate: string;
  maturityDate?: string;
  lastUpdated: string;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
  activeInvestments: number;
  completedInvestments: number;
}

export interface PortfolioPerformance {
  period: "daily" | "weekly" | "monthly" | "yearly";
  data: {
    date: string;
    value: number;
    return: number;
    returnPercentage: number;
  }[];
}

export interface PortfolioResponse {
  success: boolean;
  message: string;
  summary: PortfolioSummary;
  investments: PortfolioItem[];
}

export interface PortfolioPerformanceResponse {
  success: boolean;
  message: string;
  performance: PortfolioPerformance;
}

// Portfolio service API functions
const portfolioService = {
  // Get portfolio overview
  getPortfolio: async (): Promise<PortfolioResponse> => {
    return apiClient.get(API_ENDPOINTS.PORTFOLIO.OVERVIEW);
  },

  // Get portfolio performance
  getPortfolioPerformance: async (params?: {
    period?: "daily" | "weekly" | "monthly" | "yearly";
    startDate?: string;
    endDate?: string;
  }): Promise<PortfolioPerformanceResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append("period", params.period);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const url = `${API_ENDPOINTS.PORTFOLIO.PERFORMANCE}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return apiClient.get(url);
  },
};

export default portfolioService;
