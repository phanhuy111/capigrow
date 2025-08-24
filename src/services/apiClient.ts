import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { getToken, removeToken } from "@/services/storage";
import { API_ENDPOINTS } from "@/utils/constants";
import { MockInterceptor } from "./mockInterceptor";

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_ENDPOINTS.BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        // Handle mock responses
        if (error.isMockResponse) {
          return Promise.resolve(error.response);
        }

        // Handle common errors
        if (error.response?.status === 401) {
          // Handle unauthorized access
          await this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );

    // Setup mock interceptor for development
    const mockInterceptor = new MockInterceptor();
    mockInterceptor.setupInterceptor(this.instance);
  }

  private async getAuthToken(): Promise<string | null> {
    return await getToken();
  }

  private async handleUnauthorized() {
    await removeToken();
    console.log("Unauthorized access - token removed");
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.request<T>(config);
    return response.data;
  }

  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  // POST request
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  // PUT request
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
