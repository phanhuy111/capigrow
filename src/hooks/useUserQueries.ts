import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userService, {
  type ChangePasswordRequest,
  type UpdateProfileRequest,
} from "@/services/userService";
import { useAuthClientStore } from "@/store/authClientStore";
import type { User as TypesUser } from "@/types";

// Query keys
export const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
};

// Get user profile query
export const useUserProfileQuery = () => {
  const { token } = useAuthClientStore();

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const response = await userService.getProfile();
      if (!response.success) {
        throw new Error(response.message || "Failed to get profile");
      }

      // Convert userService User to types User format for consistency
      const user: TypesUser = {
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
    retry: 2,
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
      const user: TypesUser = {
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
    onSuccess: (updatedUser: TypesUser) => {
      // Update client state
      updateUser(updatedUser);

      // Update cached profile data
      queryClient.setQueryData(userKeys.profile(), updatedUser);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Change password mutation
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async (passwordData: ChangePasswordRequest) => {
      const response = await userService.changePassword(passwordData);
      if (response.error) {
        throw new Error(response.message || response.error || "Failed to change password");
      }
      return response;
    },
  });
};
