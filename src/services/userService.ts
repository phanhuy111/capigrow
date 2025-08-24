import apiClient from "@/services/apiClient";
import type { ApiResponse } from "@/types";
import { API_ENDPOINTS } from "@/utils/constants";

// Types for user operations
export interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  user: User;
}

// User service API functions
const userService = {
  // Get user profile
  getProfile: async (): Promise<UserProfileResponse> => {
    return apiClient.get(API_ENDPOINTS.USER.PROFILE);
  },

  // Update user profile
  updateProfile: async (userData: UpdateProfileRequest): Promise<UserProfileResponse> => {
    return apiClient.put(API_ENDPOINTS.USER.PROFILE, userData);
  },

  // Change password
  changePassword: async (passwordData: ChangePasswordRequest): Promise<ApiResponse> => {
    return apiClient.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, passwordData);
  },
};

export default userService;
