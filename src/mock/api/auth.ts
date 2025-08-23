import { mockDelay, mockApiResponse } from './index';
import { mockAuthData, mockLoginResponse, mockRegisterResponse } from '@/mock/data/auth';

export const mockAuthApi = {
  login: async (email: string, password: string) => {
    await mockDelay(1500);

    // Simulate login validation
    if (email === 'user@example.com' && password === 'password123') {
      return mockApiResponse(mockAuthData, true, 'Login successful');
    }

    return mockApiResponse(null, false, 'Invalid credentials');
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    await mockDelay(2000);

    // Simulate registration
    return mockApiResponse(mockAuthData, true, 'Registration successful');
  },

  verifyPhone: async (phone: string, otp: string) => {
    await mockDelay(1000);

    // Simulate OTP verification - accept common test OTPs
    if (otp === '0000' || otp === '1234' || otp === '1111') {
      return mockApiResponse({ verified: true }, true, 'Phone verified successfully');
    }

    return mockApiResponse(null, false, 'Invalid OTP');
  },

  sendOtp: async (phone: string) => {
    await mockDelay(500);

    // Simulate OTP sending
    return mockApiResponse({ sent: true }, true, 'OTP sent successfully');
  },

  refreshToken: async (refreshToken: string) => {
    await mockDelay(500);

    return mockApiResponse({
      accessToken: 'new_mock_access_token',
      refreshToken: 'new_mock_refresh_token',
      expiresIn: 3600,
    }, true, 'Token refreshed');
  },

  logout: async () => {
    await mockDelay(500);

    return mockApiResponse({ success: true }, true, 'Logged out successfully');
  },

  forgotPassword: async (email: string) => {
    await mockDelay(1000);

    return mockApiResponse({ sent: true }, true, 'Password reset email sent');
  },

  resetPassword: async (token: string, newPassword: string) => {
    await mockDelay(1000);

    return mockApiResponse({ success: true }, true, 'Password reset successfully');
  },

  createAccount: async (userData: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
  }) => {
    await mockDelay(2000);

    // Simulate account creation
    return mockApiResponse(mockAuthData, true, 'Account created successfully');
  },
};
