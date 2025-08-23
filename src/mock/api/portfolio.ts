import { mockDelay, mockApiResponse } from './index';
import { mockPortfolio } from '../data/portfolio';

export const mockPortfolioApi = {
  getPortfolio: async () => {
    await mockDelay(1000);
    return mockApiResponse(mockPortfolio, true, 'Portfolio retrieved successfully');
  },

  getPerformance: async (period: 'daily' | 'monthly' | 'yearly' = 'monthly') => {
    await mockDelay(800);
    
    const performanceData = mockPortfolio.performance[period] || mockPortfolio.performance.monthly;
    
    return mockApiResponse(performanceData, true, 'Performance data retrieved successfully');
  },

  getInvestmentDetails: async (investmentId: string) => {
    await mockDelay(500);
    
    const investment = mockPortfolio.investments.find(inv => inv.investmentId === investmentId);
    
    if (investment) {
      return mockApiResponse(investment, true, 'Investment details retrieved successfully');
    }
    
    return mockApiResponse(null, false, 'Investment not found in portfolio');
  },
};
