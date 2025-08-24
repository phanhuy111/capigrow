import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { ApiResponse } from '@/types';

// Types for investment operations
export interface Investment {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
  minimumAmount: number;
  expectedReturn: number;
  duration: number;
  status: 'draft' | 'active' | 'paused' | 'closed' | 'completed';
  totalRaised: number;
  targetAmount: number;
  investorCount: number;
  startDate: string;
  endDate: string;
  images: string[];
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentRegistrationRequest {
  amount: number;
  paymentMethod?: string;
  notes?: string;
}

export interface InvestmentListResponse {
  success: boolean;
  message: string;
  investments: Investment[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InvestmentDetailResponse {
  success: boolean;
  message: string;
  investment: Investment;
}

export interface InvestmentRegistrationResponse {
  success: boolean;
  message: string;
  registrationId: string;
  paymentUrl?: string;
}

export interface InvestmentCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface InvestmentCategoriesResponse {
  success: boolean;
  message: string;
  categories: InvestmentCategory[];
}

// Investment service API functions
const investmentService = {
  // Get all investments
  getInvestments: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    riskLevel?: string;
    status?: string;
  }): Promise<InvestmentListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.riskLevel) queryParams.append('riskLevel', params.riskLevel);
    if (params?.status) queryParams.append('status', params.status);
    
    const url = `${API_ENDPOINTS.INVESTMENTS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get(url);
  },

  // Get investment details
  getInvestment: async (id: string): Promise<InvestmentDetailResponse> => {
    const url = API_ENDPOINTS.INVESTMENTS.DETAILS.replace(':id', id);
    return apiClient.get(url);
  },

  // Get investment categories
  getCategories: async (): Promise<InvestmentCategoriesResponse> => {
    return apiClient.get(API_ENDPOINTS.INVESTMENTS.CATEGORIES);
  },

  // Register for investment
  registerInvestment: async (id: string, data: InvestmentRegistrationRequest): Promise<InvestmentRegistrationResponse> => {
    const url = API_ENDPOINTS.INVESTMENTS.REGISTER.replace(':id', id);
    return apiClient.post(url, data);
  },
};

export default investmentService;