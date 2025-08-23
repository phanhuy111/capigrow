import { useMutation } from '@tanstack/react-query';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

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
    return apiClient.post(API_ENDPOINTS.SEND_OTP, data);
  },

  verifyOTP: async (data: OTPVerificationRequest): Promise<OTPVerificationResponse> => {
    return apiClient.post(API_ENDPOINTS.VERIFY_OTP, data);
  },

  registerUser: async (data: UserRegistrationRequest): Promise<UserRegistrationResponse> => {
    return apiClient.post(API_ENDPOINTS.REGISTER, data);
  },

  resendOTP: async (sessionId: string): Promise<PhoneVerificationResponse> => {
    return apiClient.post(API_ENDPOINTS.RESEND_OTP, { sessionId });
  },

  createAccount: async (data: CreateAccountRequest): Promise<CreateAccountResponse> => {
    return apiClient.post(API_ENDPOINTS.CREATE_ACCOUNT, data);
  },
};

// React Query hooks
export const usePhoneVerification = () => {
  return useMutation({
    mutationFn: authApi.sendPhoneVerification,
    onSuccess: (data) => {
      console.log('Phone verification sent:', data.message);
    },
    onError: (error: any) => {
      console.error('Phone verification failed:', error.response?.data?.message || error.message);
    },
  });
};

export const useOTPVerification = () => {
  return useMutation({
    mutationFn: authApi.verifyOTP,
    onSuccess: (data) => {
      console.log('OTP verification successful:', data.message);
    },
    onError: (error: any) => {
      console.error('OTP verification failed:', error.response?.data?.message || error.message);
    },
  });
};

export const useUserRegistration = () => {
  return useMutation({
    mutationFn: authApi.registerUser,
    onSuccess: (data) => {
      console.log('User registration successful:', data.message);
    },
    onError: (error: any) => {
      console.error('User registration failed:', error.response?.data?.message || error.message);
    },
  });
};

export const useResendOTP = () => {
  return useMutation({
    mutationFn: authApi.resendOTP,
    onSuccess: (data) => {
      console.log('OTP resent:', data.message);
    },
    onError: (error: any) => {
      console.error('Resend OTP failed:', error.response?.data?.message || error.message);
    },
  });
};

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: authApi.createAccount,
    onSuccess: (data) => {
      console.log('Account created successfully:', data.message);
    },
    onError: (error: any) => {
      console.error('Account creation failed:', error.response?.data?.message || error.message);
    },
  });
};

export default authApi;