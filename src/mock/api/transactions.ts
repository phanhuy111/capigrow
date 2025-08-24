import { mockDelay, mockApiResponse } from './index';
import { mockTransactions, mockPaymentMethods } from '@/mock/data/transactions';

export const mockTransactionApi = {
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    await mockDelay(1000);
    
    const mockTransactionsList = [
      {
        id: 'TXN001',
        type: 'investment' as const,
        status: 'completed' as const,
        amount: 10000000,
        currency: 'VND',
        description: 'Đầu tư vào Quỹ Cân Bằng VN',
        investmentId: 'INV001',
        investmentName: 'Quỹ Cân Bằng VN',
        paymentMethod: 'bank_transfer',
        paymentReference: 'PAY001',
        fees: 50000,
        netAmount: 9950000,
        createdAt: '2024-12-01T10:00:00Z',
        updatedAt: '2024-12-01T10:30:00Z',
        completedAt: '2024-12-01T10:30:00Z'
      },
      {
        id: 'TXN002',
        type: 'dividend' as const,
        status: 'completed' as const,
        amount: 500000,
        currency: 'VND',
        description: 'Cổ tức từ Quỹ Cân Bằng VN',
        investmentId: 'INV001',
        investmentName: 'Quỹ Cân Bằng VN',
        paymentMethod: 'bank_transfer',
        paymentReference: 'DIV001',
        fees: 0,
        netAmount: 500000,
        createdAt: '2024-12-15T09:00:00Z',
        updatedAt: '2024-12-15T09:15:00Z',
        completedAt: '2024-12-15T09:15:00Z'
      }
    ];
    
    let filteredTransactions = [...mockTransactionsList];
    
    if (params?.type) {
      filteredTransactions = filteredTransactions.filter(
        tx => tx.type === params.type
      );
    }
    
    if (params?.status) {
      filteredTransactions = filteredTransactions.filter(
        tx => tx.status === params.status
      );
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    const responseData = {
      transactions: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / limit)
      }
    };
    
    return mockApiResponse(responseData, true, 'Transactions retrieved successfully');
  },

  getTransaction: async (transactionId: string) => {
    await mockDelay(500);
    
    const mockTransaction = {
      id: transactionId,
      type: 'investment' as const,
      status: 'completed' as const,
      amount: 10000000,
      currency: 'VND',
      description: 'Đầu tư vào Quỹ Cân Bằng VN',
      investmentId: 'INV001',
      investmentName: 'Quỹ Cân Bằng VN',
      paymentMethod: 'bank_transfer',
      paymentReference: 'PAY001',
      fees: 50000,
      netAmount: 9950000,
      createdAt: '2024-12-01T10:00:00Z',
      updatedAt: '2024-12-01T10:30:00Z',
      completedAt: '2024-12-01T10:30:00Z'
    };
    
    const responseData = {
      transaction: mockTransaction
    };
    
    return mockApiResponse(responseData, true, 'Transaction details retrieved successfully');
  },

  getPaymentMethods: async () => {
    await mockDelay(500);
    return mockApiResponse(mockPaymentMethods, true, 'Payment methods retrieved successfully');
  },

  processPayment: async (paymentData: {
    amount: number;
    paymentMethodId: string;
    investmentId: string;
  }) => {
    await mockDelay(3000);
    
    const transactionId = `tx_${Date.now()}`;
    
    return mockApiResponse({
      transactionId,
      status: 'processing',
      amount: paymentData.amount,
      estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }, true, 'Payment initiated successfully');
  },
};
