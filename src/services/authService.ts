import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { getRefreshToken } from '@/services/storage';

// Types for authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
  };
}

export interface PhoneVerificationRequest {
  phoneNumber: string;
  countryCode: string;
}

export interface PhoneVerificationResponse {
  success: boolean;
  message: string;
  sessionId: string;
}

export interface OTPVerificationRequest {
  sessionId: string;
  otp: string;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: string;
    phoneNumber: string;
    fullName: string;
    email: string;
  };
  isNewUser: boolean;
}

export interface UserRegistrationRequest {
  phoneNumber: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  referralCode?: string;
}

export interface UserRegistrationResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    phoneNumber: string;
    fullName: string;
    email: string;
  };
}

export interface CreateAccountRequest {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

export interface CreateAccountResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// API functions
const authApi = {
  // Login with email and password
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  // Logout user
  logout: async (): Promise<LogoutResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  // Refresh access token
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const refreshToken = await getRefreshToken();
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    });
  },

  // Send OTP to phone number
  sendPhoneVerification: async (data: PhoneVerificationRequest): Promise<PhoneVerificationResponse> => {
    return apiClient.post(API_ENDPOINTS.PHONE_VERIFICATION, data);
  },

  // Verify OTP
  verifyOTP: async (data: OTPVerificationRequest): Promise<OTPVerificationResponse> => {
    return apiClient.post(API_ENDPOINTS.OTP_VERIFICATION, data);
  },

  // Register new user
  register: async (data: UserRegistrationRequest): Promise<UserRegistrationResponse> => {
    return apiClient.post(API_ENDPOINTS.USER_REGISTRATION, data);
  },

  // Resend OTP
  resendOTP: async (sessionId: string): Promise<PhoneVerificationResponse> => {
    return apiClient.post(API_ENDPOINTS.RESEND_OTP, { sessionId });
  },

  // Create account after OTP verification
  createAccount: async (data: CreateAccountRequest): Promise<CreateAccountResponse> => {
    return apiClient.post(API_ENDPOINTS.CREATE_ACCOUNT, data);
  },
};

export default authApi;