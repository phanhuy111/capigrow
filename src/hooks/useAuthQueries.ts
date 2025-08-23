import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';
import apiService from '../services/api';
import { useAuthClientStore } from '../store/authClientStore';
import { setToken, setRefreshToken, setUserData, clearAllData } from '../services/storage';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Login mutation
export const useLoginMutation = () => {
  const { setAuthData } = useAuthClientStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await apiService.login(credentials.email, credentials.password);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as AuthResponse;
    },
    onSuccess: async (authData: AuthResponse) => {
      // Validate tokens before storing
      if (!authData.access_token || !authData.refresh_token) {
        throw new Error('Invalid response: missing tokens');
      }

      // Store tokens and user data
      await setToken(authData.access_token);
      await setRefreshToken(authData.refresh_token);
      await setUserData(authData.user);

      // Update client state
      setAuthData(authData.user, authData.access_token, authData.refresh_token);
      
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};

// Register mutation
export const useRegisterMutation = () => {
  const { setAuthData } = useAuthClientStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await apiService.register(userData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as AuthResponse;
    },
    onSuccess: async (authData: AuthResponse) => {
      // Store tokens and user data
      await setToken(authData.access_token);
      await setRefreshToken(authData.refresh_token);
      await setUserData(authData.user);

      // Update client state
      setAuthData(authData.user, authData.access_token, authData.refresh_token);
      
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};

// Logout mutation
export const useLogoutMutation = () => {
  const { clearAuth } = useAuthClientStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call logout API if needed
      await apiService.logout();
    },
    onSuccess: async () => {
      // Clear stored data
      await clearAllData();
      
      // Clear client state
      clearAuth();
      
      // Clear all queries
      queryClient.clear();
    },
    onError: async () => {
      // Even if logout API fails, clear local data
      await clearAllData();
      clearAuth();
      queryClient.clear();
    },
  });
};

// Get profile query
export const useProfileQuery = () => {
  const { token } = useAuthClientStore();
  
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await apiService.getProfile();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as User;
    },
    enabled: !!token, // Only fetch if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update profile mutation
export const useUpdateProfileMutation = () => {
  const { updateUser } = useAuthClientStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const response = await apiService.updateProfile(userData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as User;
    },
    onSuccess: (updatedUser: User) => {
      // Update client state
      updateUser(updatedUser);
      
      // Update cached profile data
      queryClient.setQueryData(authKeys.profile(), updatedUser);
    },
  });
};

// OTP Verification mutation
export const useOTPVerificationMutation = () => {
  const { setAuthData } = useAuthClientStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, otp }: { sessionId: string; otp: string }) => {
      const response = await apiService.verifyOTP(sessionId, otp);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: async (data: any) => {
      if (data.access_token && data.refresh_token) {
        // Store tokens and user data
        await setToken(data.access_token);
        await setRefreshToken(data.refresh_token);
        await setUserData(data.user);

        // Update client state
        setAuthData(data.user, data.access_token, data.refresh_token);
        
        // Invalidate and refetch user profile
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      }
    },
  });
};

// Phone verification mutation
export const usePhoneVerificationMutation = () => {
  return useMutation({
    mutationFn: async ({ phoneNumber, countryCode }: { phoneNumber: string; countryCode: string }) => {
      const response = await apiService.sendPhoneVerification(phoneNumber, countryCode);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
};

// Resend OTP mutation
export const useResendOTPMutation = () => {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiService.resendOTP(sessionId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
};

// Refresh token mutation
export const useRefreshTokenMutation = () => {
  const { setAuthData, clearAuth } = useAuthClientStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiService.refreshToken();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as AuthResponse;
    },
    onSuccess: async (authData: AuthResponse) => {
      // Store new tokens
      await setToken(authData.access_token);
      await setRefreshToken(authData.refresh_token);
      await setUserData(authData.user);

      // Update client state
      setAuthData(authData.user, authData.access_token, authData.refresh_token);
    },
    onError: async () => {
      // If refresh fails, logout user
      await clearAllData();
      clearAuth();
      queryClient.clear();
    },
  });
};