import { mockDelay, mockApiResponse } from './index';
import { mockPortfolio } from '@/mock/data/portfolio';

export const mockPortfolioApi = {
  getPortfolio: async () => {
    await mockDelay(1000);
    
    const portfolioData = {
      summary: {
        totalInvested: 50000000,
        currentValue: 55500000,
        totalReturn: 5500000,
        totalReturnPercentage: 11.0,
        activeInvestments: 5,
        completedInvestments: 2
      },
      investments: [
        {
          id: '1',
          investmentId: 'INV001',
          investmentName: 'Quỹ Cân Bằng VN',
          category: 'Mutual Fund',
          riskLevel: 'medium' as const,
          investedAmount: 10000000,
          currentValue: 11200000,
          returnAmount: 1200000,
          returnPercentage: 12.0,
          status: 'active' as const,
          investmentDate: '2024-01-15',
          maturityDate: '2025-01-15',
          lastUpdated: '2024-12-20'
        },
        {
          id: '2',
          investmentId: 'INV002',
          investmentName: 'Trái Phiếu Chính Phủ',
          category: 'Bond',
          riskLevel: 'low' as const,
          investedAmount: 20000000,
          currentValue: 21000000,
          returnAmount: 1000000,
          returnPercentage: 5.0,
          status: 'active' as const,
          investmentDate: '2024-02-01',
          maturityDate: '2026-02-01',
          lastUpdated: '2024-12-20'
        }
      ]
    };
    
    return mockApiResponse(portfolioData, true, 'Portfolio retrieved successfully');
  },

  getPerformance: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') => {
    await mockDelay(800);
    
    const performanceData = {
      performance: {
        period,
        data: [
          {
            date: '2024-11-01',
            value: 52000000,
            return: 2000000,
            returnPercentage: 4.0
          },
          {
            date: '2024-11-15',
            value: 53500000,
            return: 3500000,
            returnPercentage: 7.0
          },
          {
            date: '2024-12-01',
            value: 55000000,
            return: 5000000,
            returnPercentage: 10.0
          },
          {
            date: '2024-12-20',
            value: 55500000,
            return: 5500000,
            returnPercentage: 11.0
          }
        ]
      }
    };
    
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
