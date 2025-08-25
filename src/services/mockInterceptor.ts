import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { mockApiResponse, mockDelay } from "@/mock/api";
import { mockAuthApi } from "@/mock/api/auth";
import { mockInvestmentApi } from "@/mock/api/investments";
import { mockPortfolioApi } from "@/mock/api/portfolio";
import { mockTransactionApi } from "@/mock/api/transactions";
import { mockUserApi } from "@/mock/api/user";
import { API_ENDPOINTS } from "@/utils/constants";

// Mock API interceptor to replace real API calls with mock data
export class MockInterceptor {
  private static instance: MockInterceptor;
  private isEnabled: boolean = true;

  static getInstance(): MockInterceptor {
    if (!MockInterceptor.instance) {
      MockInterceptor.instance = new MockInterceptor();
    }
    return MockInterceptor.instance;
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  setupInterceptor(axiosInstance: AxiosInstance) {
    axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (!this.isEnabled) {
          return config;
        }

        // Add delay to simulate network latency
        await mockDelay(500);

        const mockResponse = await this.getMockResponse(config);
        if (mockResponse) {
          // Create a mock axios response
          const response: AxiosResponse = {
            data: mockResponse,
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          };

          // Throw the response to be caught by the response interceptor
          throw { response, isMockResponse: true };
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle mock responses in response interceptor
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // If it's a mock response, return it as successful
        if (error.isMockResponse) {
          return Promise.resolve(error.response);
        }
        return Promise.reject(error);
      }
    );
  }

  private async getMockResponse(config: InternalAxiosRequestConfig): Promise<unknown> {
    const { method = "get", url = "" } = config;
    const normalizedUrl = url.toLowerCase();

    // Auth endpoints
    if (normalizedUrl.includes(API_ENDPOINTS.AUTH.LOGIN.toLowerCase())) {
      return method === "post"
        ? await mockAuthApi.login(config.data?.email, config.data?.password)
        : null;
    }

    if (normalizedUrl.includes(API_ENDPOINTS.AUTH.REGISTER.toLowerCase())) {
      return method === "post" ? await mockAuthApi.register(config.data) : null;
    }

    if (normalizedUrl.includes(API_ENDPOINTS.AUTH.REFRESH.toLowerCase())) {
      return method === "post" ? await mockAuthApi.refreshToken(config.data?.refreshToken) : null;
    }

    if (normalizedUrl.includes(API_ENDPOINTS.AUTH.LOGOUT.toLowerCase())) {
      return method === "post" ? await mockAuthApi.logout() : null;
    }

    // Phone verification endpoints
    if (normalizedUrl.includes(API_ENDPOINTS.PHONE_VERIFICATION.toLowerCase())) {
      return method === "post" ? await mockAuthApi.sendPhoneVerification(config.data) : null;
    }

    if (normalizedUrl.includes(API_ENDPOINTS.OTP_VERIFICATION.toLowerCase())) {
      return method === "post" ? await mockAuthApi.verifyOTP(config.data) : null;
    }

    if (normalizedUrl.includes(API_ENDPOINTS.RESEND_OTP.toLowerCase())) {
      return method === "post" ? await mockAuthApi.resendOTP(config.data?.sessionId) : null;
    }

    // User endpoints
    if (normalizedUrl.includes(API_ENDPOINTS.USER.PROFILE.toLowerCase())) {
      if (method === "get") {
        return await mockUserApi.getProfile();
      }
      if (method === "put") {
        return await mockUserApi.updateProfile(config.data);
      }
    }

    if (normalizedUrl.includes(API_ENDPOINTS.USER.CHANGE_PASSWORD.toLowerCase())) {
      return method === "post"
        ? await mockUserApi.changePassword(config.data?.currentPassword, config.data?.newPassword)
        : null;
    }

    // Investment endpoints
    if (normalizedUrl.includes(API_ENDPOINTS.INVESTMENTS.LIST.toLowerCase())) {
      return method === "get" ? await mockInvestmentApi.getInvestments() : null;
    }

    if (normalizedUrl.includes("/investments/") && normalizedUrl.includes("/register")) {
      const investmentId = this.extractIdFromUrl(url, "/investments/", "/register");
      return method === "post"
        ? await mockInvestmentApi.registerInvestment(investmentId, config.data)
        : null;
    }

    if (normalizedUrl.includes("/investments/") && !normalizedUrl.includes("/register")) {
      const investmentId = this.extractIdFromUrl(url, "/investments/");
      return method === "get" ? await mockInvestmentApi.getInvestmentDetails(investmentId) : null;
    }

    // Portfolio endpoints
    if (normalizedUrl.includes(API_ENDPOINTS.PORTFOLIO.OVERVIEW.toLowerCase())) {
      return method === "get" ? await mockPortfolioApi.getPortfolio() : null;
    }

    if (normalizedUrl.includes(API_ENDPOINTS.PORTFOLIO.PERFORMANCE.toLowerCase())) {
      return method === "get" ? await mockPortfolioApi.getPerformance() : null;
    }

    // Transaction endpoints
    if (normalizedUrl.includes(API_ENDPOINTS.TRANSACTIONS.LIST.toLowerCase())) {
      return method === "get" ? await mockTransactionApi.getTransactions() : null;
    }

    if (normalizedUrl.includes("/transactions/") && !normalizedUrl.includes("/payment")) {
      const transactionId = this.extractIdFromUrl(url, "/transactions/");
      return method === "get"
        ? await mockTransactionApi.getTransactionDetails(transactionId)
        : null;
    }

    if (normalizedUrl.includes(API_ENDPOINTS.TRANSACTIONS.PAYMENT.toLowerCase())) {
      return method === "post" ? await mockTransactionApi.processPayment(config.data) : null;
    }

    // Verification endpoints
    if (normalizedUrl.includes(API_ENDPOINTS.VERIFICATION.STATUS.toLowerCase())) {
      return method === "get" ? this.mockGetVerificationStatus() : null;
    }

    if (normalizedUrl.includes(API_ENDPOINTS.VERIFICATION.DOCUMENTS.toLowerCase())) {
      return method === "post" ? this.mockUploadDocument(config.data) : null;
    }

    if (normalizedUrl.includes(API_ENDPOINTS.VERIFICATION.SELFIE.toLowerCase())) {
      return method === "post" ? this.mockUploadSelfie(config.data) : null;
    }

    return null;
  }

  private extractIdFromUrl(url: string, basePath: string, endPath?: string): string {
    const startIndex = url.indexOf(basePath) + basePath.length;
    let endIndex = url.length;

    if (endPath) {
      const endPathIndex = url.indexOf(endPath, startIndex);
      if (endPathIndex !== -1) {
        endIndex = endPathIndex;
      }
    } else {
      const queryIndex = url.indexOf("?", startIndex);
      if (queryIndex !== -1) {
        endIndex = queryIndex;
      }
    }

    return url.substring(startIndex, endIndex);
  }

  private mockGetVerificationStatus() {
    return mockApiResponse({
      verification: {
        id: "1",
        status: "pending",
        documentsUploaded: true,
        selfieUploaded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }

  private mockUploadDocument(data: unknown) {
    const documentData = data as { type?: string };
    return mockApiResponse({
      document: {
        id: "1",
        type: documentData?.type || "id_card",
        url: "https://example.com/document.jpg",
        status: "uploaded",
        uploadedAt: new Date().toISOString(),
      },
    });
  }

  private mockUploadSelfie(_data: unknown) {
    return mockApiResponse({
      document: {
        id: "2",
        type: "selfie",
        url: "https://example.com/selfie.jpg",
        status: "uploaded",
        uploadedAt: new Date().toISOString(),
      },
    });
  }
}

export default MockInterceptor.getInstance();
