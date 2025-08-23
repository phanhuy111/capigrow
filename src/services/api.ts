import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getToken, getRefreshToken, removeToken } from './storage';
import { ApiResponse } from '../types';

// Extend the AxiosRequestConfig to include metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    requestId: string;
    startTime: number;
  };
}

const BASE_URL = 'http://localhost:8080/api/v1';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token and log requests
    this.client.interceptors.request.use(
      async (config: ExtendedAxiosRequestConfig) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log API request
        const requestId = this.generateRequestId();
        config.metadata = { requestId, startTime: Date.now() };

        const requestData = {
          id: requestId,
          method: config.method?.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          headers: this.sanitizeHeaders(config.headers),
          data: config.data,
          params: config.params,
          timestamp: new Date().toISOString(),
        };

        console.log('🚀 API REQUEST:', requestData);

        return config;
      },
      (error) => {
        const errorData = {
          error: error.message,
          timestamp: new Date().toISOString(),
        };

        console.error('❌ API REQUEST ERROR:', errorData);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors and log responses
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const config = response.config as ExtendedAxiosRequestConfig;
        const duration = config.metadata ? Date.now() - config.metadata.startTime : 0;

        // Log API response
        const responseData = {
          id: config.metadata?.requestId,
          method: config.method?.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data.data,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        };

        console.log('✅ API RESPONSE:', responseData);

        return response;
      },
      async (error) => {
        const config = error.config as ExtendedAxiosRequestConfig;
        const duration = config?.metadata ? Date.now() - config.metadata.startTime : 0;

        // Log API error response
        const errorResponseData = {
          id: config?.metadata?.requestId,
          method: config?.method?.toUpperCase(),
          url: config ? `${config.baseURL}${config.url}` : 'Unknown',
          status: error.response?.status,
          statusText: error.response?.statusText,
          headers: error.response?.headers,
          data: error.response?.data,
          message: error.message,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        };

        console.error('❌ API ERROR RESPONSE:', errorResponseData);

        if (error.response?.status === 401) {
          // Token expired or invalid, remove it and redirect to login
          await removeToken();
          // You can add navigation logic here if needed
        }
        return Promise.reject(error);
      }
    );
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    // Hide sensitive information
    if (sanitized.Authorization) {
      sanitized.Authorization = sanitized.Authorization.replace(/Bearer .+/, 'Bearer ***');
    }
    return sanitized;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, config);
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data, config);
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data, config);
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url, config);
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      });
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse {
    if (error.response) {
      // Server responded with error status
      return {
        error: error.response.data.data?.message || error.response.data.data?.error || 'Server error',
        status: error.response.status,
      };
    } else if (error.request) {
      // Network error
      return {
        error: 'Network error. Please check your connection.',
        status: 0,
      };
    } else {
      // Other error
      return {
        error: error.message || 'An unexpected error occurred',
        status: 0,
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.get('/health');
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.post('/auth/login', { email, password });
  }

  async register(userData: any): Promise<ApiResponse> {
    return this.post('/auth/register', userData);
  }

  async refreshToken(): Promise<ApiResponse> {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return this.post('/auth/refresh', { refresh_token: refreshToken });
  }

  async logout(): Promise<ApiResponse> {
    return this.post('/auth/logout');
  }

  // User endpoints
  async getProfile(): Promise<ApiResponse> {
    return this.get('/users/profile');
  }

  async updateProfile(userData: any): Promise<ApiResponse> {
    return this.put('/users/profile', userData);
  }

  async changePassword(passwordData: any): Promise<ApiResponse> {
    return this.post('/users/change-password', passwordData);
  }

  // Investment endpoints
  async getInvestments(): Promise<ApiResponse> {
    return this.get('/investments');
  }

  async getInvestment(id: string): Promise<ApiResponse> {
    return this.get(`/investments/${id}`);
  }

  async registerInvestment(id: string, amount: number): Promise<ApiResponse> {
    return this.post(`/investments/${id}/register`, { amount });
  }

  // Portfolio endpoints
  async getPortfolio(): Promise<ApiResponse> {
    return this.get('/portfolio');
  }

  async getPortfolioPerformance(): Promise<ApiResponse> {
    return this.get('/portfolio/performance');
  }

  // Transaction endpoints
  async getTransactions(): Promise<ApiResponse> {
    return this.get('/transactions');
  }

  async getTransaction(id: string): Promise<ApiResponse> {
    return this.get(`/transactions/${id}`);
  }

  async processPayment(paymentData: any): Promise<ApiResponse> {
    return this.post('/transactions/payment', paymentData);
  }

  // Verification endpoints
  async uploadDocument(formData: FormData): Promise<ApiResponse> {
    return this.upload('/verification/documents', formData);
  }

  async uploadSelfie(formData: FormData): Promise<ApiResponse> {
    return this.upload('/verification/selfie', formData);
  }

  async getVerificationStatus(): Promise<ApiResponse> {
    return this.get('/verification/status');
  }

  // File endpoints
  async uploadFile(formData: FormData): Promise<ApiResponse> {
    return this.upload('/files/upload', formData);
  }

  async getFile(id: string): Promise<ApiResponse> {
    return this.get(`/files/${id}`);
  }

  async deleteFile(id: string): Promise<ApiResponse> {
    return this.delete(`/files/${id}`);
  }
}

export default new ApiService();
