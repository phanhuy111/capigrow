import { mockDelay, mockApiResponse } from './index';
import { mockTransactions, mockPaymentMethods } from '@/mock/data/transactions';

export const mockTransactionApi = {
  getTransactions: async (filters?: {
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    await mockDelay(1000);
    
    let filteredTransactions = [...mockTransactions];
    
    if (filters?.type) {
      filteredTransactions = filteredTransactions.filter(
        tx => tx.type === filters.type
      );
    }
    
    if (filters?.status) {
      filteredTransactions = filteredTransactions.filter(
        tx => tx.status === filters.status
      );
    }
    
    return mockApiResponse(filteredTransactions, true, 'Transactions retrieved successfully');
  },

  getTransactionDetails: async (transactionId: string) => {
    await mockDelay(500);
    
    const transaction = mockTransactions.find(tx => tx.id === transactionId);
    
    if (transaction) {
      return mockApiResponse(transaction, true, 'Transaction details retrieved successfully');
    }
    
    return mockApiResponse(null, false, 'Transaction not found');
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
