import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { ApiResponse } from '@/types';

// Types for transaction operations
export interface Transaction {
  id: string;
  type: 'investment' | 'withdrawal' | 'dividend' | 'fee' | 'refund';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  description: string;
  investmentId?: string;
  investmentName?: string;
  paymentMethod: string;
  paymentReference?: string;
  fees: number;
  netAmount: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface PaymentRequest {
  amount: number;
  currency?: string;
  paymentMethod: 'bank_transfer' | 'credit_card' | 'debit_card' | 'e_wallet';
  investmentId?: string;
  description?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface TransactionListResponse {
  success: boolean;
  message: string;
  transactions: Transaction[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TransactionDetailResponse {
  success: boolean;
  message: string;
  transaction: Transaction;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId: string;
  paymentUrl?: string;
  paymentReference: string;
  status: string;
}

// Transaction service API functions
const transactionService = {
  // Get all transactions
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<TransactionListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const url = `${API_ENDPOINTS.TRANSACTIONS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get(url);
  },

  // Get transaction details
  getTransaction: async (id: string): Promise<TransactionDetailResponse> => {
    const url = API_ENDPOINTS.TRANSACTIONS.DETAILS.replace(':id', id);
    return apiClient.get(url);
  },

  // Process payment
  processPayment: async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    return apiClient.post(API_ENDPOINTS.TRANSACTIONS.PAYMENT, paymentData);
  },
};

export default transactionService;