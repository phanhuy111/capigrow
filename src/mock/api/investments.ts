import { mockDelay, mockApiResponse } from './index';
import { mockInvestments, mockInvestmentCategories } from '@/mock/data/investments';

export const mockInvestmentApi = {
  getInvestments: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    riskLevel?: string;
    status?: string;
  }) => {
    await mockDelay(1000);
    
    const mockInvestmentsList = [
      {
        id: 'INV001',
        name: 'Quỹ Cân Bằng VN',
        description: 'Quỹ đầu tư cân bằng với danh mục đa dạng',
        category: 'Mutual Fund',
        riskLevel: 'medium' as const,
        minimumAmount: 1000000,
        expectedReturn: 12.5,
        duration: 12,
        status: 'active' as const,
        totalRaised: 50000000000,
        targetAmount: 100000000000,
        investorCount: 1250,
        startDate: '2024-01-01',
        endDate: '2025-12-31',
        images: ['/images/fund1.jpg'],
        documents: ['/docs/fund1-prospectus.pdf'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-12-20T00:00:00Z'
      },
      {
        id: 'INV002',
        name: 'Trái Phiếu Chính Phủ 5 Năm',
        description: 'Trái phiếu chính phủ kỳ hạn 5 năm với lãi suất cố định',
        category: 'Bond',
        riskLevel: 'low' as const,
        minimumAmount: 5000000,
        expectedReturn: 6.8,
        duration: 60,
        status: 'active' as const,
        totalRaised: 200000000000,
        targetAmount: 500000000000,
        investorCount: 3500,
        startDate: '2024-02-01',
        endDate: '2029-02-01',
        images: ['/images/bond1.jpg'],
        documents: ['/docs/bond1-terms.pdf'],
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-12-20T00:00:00Z'
      }
    ];
    
    let filteredInvestments = [...mockInvestmentsList];
    
    if (params?.category) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.category.toLowerCase() === params.category?.toLowerCase()
      );
    }
    
    if (params?.riskLevel) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.riskLevel === params.riskLevel
      );
    }
    
    if (params?.status) {
      filteredInvestments = filteredInvestments.filter(
        inv => inv.status === params.status
      );
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedInvestments = filteredInvestments.slice(startIndex, endIndex);
    
    const responseData = {
      investments: paginatedInvestments,
      pagination: {
        page,
        limit,
        total: filteredInvestments.length,
        totalPages: Math.ceil(filteredInvestments.length / limit)
      }
    };
    
    return mockApiResponse(responseData, true, 'Investments retrieved successfully');
  },

  getInvestment: async (investmentId: string) => {
    await mockDelay(800);
    
    const mockInvestment = {
      id: investmentId,
      name: 'Quỹ Cân Bằng VN',
      description: 'Quỹ đầu tư cân bằng với danh mục đa dạng bao gồm cổ phiếu và trái phiếu',
      category: 'Mutual Fund',
      riskLevel: 'medium' as const,
      minimumAmount: 1000000,
      expectedReturn: 12.5,
      duration: 12,
      status: 'active' as const,
      totalRaised: 50000000000,
      targetAmount: 100000000000,
      investorCount: 1250,
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      images: ['/images/fund1.jpg', '/images/fund1-chart.jpg'],
      documents: ['/docs/fund1-prospectus.pdf', '/docs/fund1-annual-report.pdf'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-20T00:00:00Z'
    };
    
    const responseData = {
      investment: mockInvestment
    };
    
    return mockApiResponse(responseData, true, 'Investment details retrieved successfully');
  },

  getCategories: async () => {
    await mockDelay(500);
    return mockApiResponse(mockInvestmentCategories, true, 'Categories retrieved successfully');
  },

  registerInvestment: async (investmentId: string, data: {
    amount: number;
    paymentMethod?: string;
    notes?: string;
  }) => {
    await mockDelay(2000);
    
    // Simulate minimum investment validation
    if (data.amount < 1000000) {
      return mockApiResponse(null, false, `Minimum investment amount is 1,000,000 VND`);
    }
    
    const responseData = {
      registrationId: `reg_${Date.now()}`,
      paymentUrl: `https://payment.example.com/pay/${investmentId}/${Date.now()}`
    };
    
    return mockApiResponse(responseData, true, 'Investment registration successful');
  },
};
