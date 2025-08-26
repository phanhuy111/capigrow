import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authService, {
  type LoginRequest,
  type LoginResponse,
  type OTPVerificationRequest,
  type OTPVerificationResponse,
  type PhoneVerificationRequest,
  type UserRegistrationRequest,
  type UserRegistrationResponse,
} from "@/services/authService";
import { clearAllData, setRefreshToken, setToken, setUserData } from "@/services/storage";
import userService, { type UpdateProfileRequest } from "@/services/userService";
import { useAuthClientStore } from "@/store/authClientStore";
import type { User } from "@/types";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

// Login mutation
export const useLoginMutation = () => {
  const { setAuthData } = useAuthClientStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authService.login(credentials);
      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }
      return response;
    },
    onSuccess: async (data: LoginResponse) => {
      // Store tokens
      await setToken(data.access_token);
      await setRefreshToken(data.refresh_token);
      await setUserData(data.user);

      // Convert authService user to types User format
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.fullName.split(" ")[0] || "",
        last_name: data.user.fullName.split(" ").slice(1).join(" ") || "",
        phone_number: data.user.phoneNumber,
        is_active: true,
        is_verified: false,
        verification_status: "pending",
        two_factor_enabled: false,
        timezone: "UTC",
        language: "en",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Update client state
      setAuthData(user, data.access_token, data.refresh_token);

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
    mutationFn: async (userData: UserRegistrationRequest) => {
      const response = await authService.register(userData);
      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }
      return response;
    },
    onSuccess: async (data: UserRegistrationResponse) => {
      await setToken(data.access_token);
      await setRefreshToken(data.refresh_token);
      await setUserData(data.user);

      // Convert authService user to types User format
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.fullName.split(" ")[0] || "",
        last_name: data.user.fullName.split(" ").slice(1).join(" ") || "",
        phone_number: data.user.phoneNumber,
        is_active: true,
        is_verified: false,
        verification_status: "pending",
        two_factor_enabled: false,
        timezone: "UTC",
        language: "en",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Update client state
      setAuthData(user, data.access_token, data.refresh_token);

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
      await authService.logout();
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
      const response = await userService.getProfile();
      if (!response.success) {
        throw new Error(response.message || "Failed to get profile");
      }

      // Convert userService User to types User format
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        first_name: response.user.firstName || response.user.fullName.split(" ")[0] || "",
        last_name:
          response.user.lastName || response.user.fullName.split(" ").slice(1).join(" ") || "",
        phone_number: response.user.phoneNumber,
        date_of_birth: response.user.dateOfBirth,
        profile_image_url: response.user.avatar,
        is_active: true,
        is_verified: response.user.isVerified,
        verification_status: "pending",
        two_factor_enabled: false,
        timezone: "UTC",
        language: "en",
        created_at: response.user.createdAt,
        updated_at: response.user.updatedAt,
      };

      return user;
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
    mutationFn: async (userData: UpdateProfileRequest) => {
      const response = await userService.updateProfile(userData);
      if (!response.success) {
        throw new Error(response.message || "Failed to update profile");
      }

      // Convert userService User to types User format
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        first_name: response.user.firstName || response.user.fullName.split(" ")[0] || "",
        last_name:
          response.user.lastName || response.user.fullName.split(" ").slice(1).join(" ") || "",
        phone_number: response.user.phoneNumber,
        date_of_birth: response.user.dateOfBirth,
        profile_image_url: response.user.avatar,
        is_active: true,
        is_verified: response.user.isVerified,
        verification_status: "pending",
        two_factor_enabled: false,
        timezone: "UTC",
        language: "en",
        created_at: response.user.createdAt,
        updated_at: response.user.updatedAt,
      };

      return user;
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
    mutationFn: async (request: OTPVerificationRequest) => {
      const response = await authService.verifyOTP(request);
      if (!response.success) {
        throw new Error(response.message || "OTP verification failed");
      }
      return response;
    },
    onSuccess: async (data: OTPVerificationResponse) => {
      if (data.access_token && data.refresh_token && data.user) {
        // Store tokens and user data
        await setToken(data.access_token);
        await setRefreshToken(data.refresh_token);
        await setUserData(data.user);

        // Convert authService user to types User format
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.fullName.split(" ")[0] || "",
          last_name: data.user.fullName.split(" ").slice(1).join(" ") || "",
          phone_number: data.user.phoneNumber,
          is_active: true,
          is_verified: false,
          verification_status: "pending",
          two_factor_enabled: false,
          timezone: "UTC",
          language: "en",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Update client state
        setAuthData(user, data.access_token, data.refresh_token);

        // Invalidate and refetch user profile
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      }
    },
  });
};

// Phone verification mutation
export const usePhoneVerificationMutation = () => {
  return useMutation({
    mutationFn: async (request: PhoneVerificationRequest) => {
      const response = await authService.sendPhoneVerification(request);
      if (!response.success) {
        throw new Error(response.message || "Phone verification failed");
      }
      return response;
    },
  });
};

// Resend OTP mutation
export const useResendOTPMutation = () => {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await authService.resendOTP(sessionId);
      if (!response.success) {
        throw new Error(response.message || "Resend OTP failed");
      }
      return response;
    },
  });
};

// Refresh token mutation
export const useRefreshTokenMutation = () => {
  const { setAuthData, clearAuth } = useAuthClientStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await authService.refreshToken();
      if (!response.success) {
        throw new Error(response.message || "Token refresh failed");
      }
      return response;
    },
    onSuccess: async (data: LoginResponse) => {
      // Store new tokens
      await setToken(data.access_token);
      await setRefreshToken(data.refresh_token);
      await setUserData(data.user);

      // Convert authService user to types User format
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.fullName.split(" ")[0] || "",
        last_name: data.user.fullName.split(" ").slice(1).join(" ") || "",
        phone_number: data.user.phoneNumber,
        is_active: true,
        is_verified: false,
        verification_status: "pending",
        two_factor_enabled: false,
        timezone: "UTC",
        language: "en",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Update client state
      setAuthData(user, data.access_token, data.refresh_token);
    },
    onError: async () => {
      // If refresh fails, logout user
      await clearAllData();
      clearAuth();
      queryClient.clear();
    },
  });
};
