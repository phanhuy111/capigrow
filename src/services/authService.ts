import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/utils/constants';

// Types for authentication
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
  token?: string;
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
  user: {
    id: string;
    phoneNumber: string;
    fullName: string;
    email: string;
  };
  token: string;
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
  user: {
    id: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  token: string;
}

// API functions
const authApi = {
  sendPhoneVerification: async (data: PhoneVerificationRequest): Promise<PhoneVerificationResponse> => {
    return apiClient.post(API_ENDPOINTS.PHONE_VERIFICATION, data);
  },

  verifyOTP: async (data: OTPVerificationRequest): Promise<OTPVerificationResponse> => {
    return apiClient.post(API_ENDPOINTS.OTP_VERIFICATION, data);
  },

  registerUser: async (data: UserRegistrationRequest): Promise<UserRegistrationResponse> => {
    return apiClient.post(API_ENDPOINTS.USER_REGISTRATION, data);
  },

  resendOTP: async (sessionId: string): Promise<PhoneVerificationResponse> => {
    return apiClient.post(API_ENDPOINTS.RESEND_OTP, { sessionId });
  },

  createAccount: async (data: CreateAccountRequest): Promise<CreateAccountResponse> => {
    return apiClient.post(API_ENDPOINTS.CREATE_ACCOUNT, data);
  },
};

// Note: React Query hooks have been migrated to useAuthQueries.ts
// This file now only contains API functions and type definitions

export default authApi;