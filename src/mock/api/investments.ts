import { mockDelay, mockApiResponse } from './index';
import { mockInvestments, mockInvestmentCategories } from '@/mock/data/investments';

export const mockInvestmentApi = {
  getInvestments: async (filters?: {
    category?: string;
    riskLevel?: string;
    minAmount?: number;
    maxAmount?: number;
  }) => {
    await mockDelay(1000);
    
    let filteredInvestments = [...mockInvestments];
    
    if (filters?.category) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }
    
    if (filters?.riskLevel) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.riskLevel === filters.riskLevel
      );
    }
    
    return mockApiResponse(filteredInvestments, true, 'Investments retrieved successfully');
  },

  getInvestmentDetails: async (investmentId: string) => {
    await mockDelay(800);
    
    const investment = mockInvestments.find(inv => inv.id === investmentId);
    
    if (investment) {
      return mockApiResponse(investment, true, 'Investment details retrieved successfully');
    }
    
    return mockApiResponse(null, false, 'Investment not found');
  },

  getCategories: async () => {
    await mockDelay(500);
    return mockApiResponse(mockInvestmentCategories, true, 'Categories retrieved successfully');
  },

  registerInvestment: async (investmentId: string, amount: number) => {
    await mockDelay(2000);
    
    const investment = mockInvestments.find(inv => inv.id === investmentId);
    
    if (!investment) {
      return mockApiResponse(null, false, 'Investment not found');
    }
    
    if (amount < investment.minInvestment) {
      return mockApiResponse(null, false, `Minimum investment amount is ${investment.minInvestment.toLocaleString()} VND`);
    }
    
    if (amount > investment.maxInvestment) {
      return mockApiResponse(null, false, `Maximum investment amount is ${investment.maxInvestment.toLocaleString()} VND`);
    }
    
    return mockApiResponse({
      registrationId: `reg_${Date.now()}`,
      investmentId,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }, true, 'Investment registration successful');
  },
};
