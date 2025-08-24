import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockNotificationApi } from "@/mock/api/notifications";

// Types
interface NotificationFilters {
  type?: string;
  isRead?: boolean;
  limit?: number;
}

interface NotificationSettings {
  push: {
    enabled: boolean;
    investment_updates: boolean;
    transaction_alerts: boolean;
    new_opportunities: boolean;
    security_alerts: boolean;
  };
  email: {
    enabled: boolean;
    weekly_summary: boolean;
    monthly_report: boolean;
    important_updates: boolean;
  };
  sms: {
    enabled: boolean;
    security_alerts: boolean;
    transaction_confirmations: boolean;
  };
}

// Query keys
export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (filters?: NotificationFilters) => [...notificationKeys.lists(), { filters }] as const,
  settings: () => [...notificationKeys.all, "settings"] as const,
};

// Get notifications query
export const useNotificationsQuery = (filters?: NotificationFilters) => {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: async () => {
      const response = await mockNotificationApi.getNotifications(filters);
      if (!response.success) {
        throw new Error(response.message || "Failed to get notifications");
      }
      return {
        notifications: response.data.notifications,
        total: response.data.total,
        unreadCount: response.data.unreadCount,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get notification settings query
export const useNotificationSettingsQuery = () => {
  return useQuery({
    queryKey: notificationKeys.settings(),
    queryFn: async () => {
      const response = await mockNotificationApi.getSettings();
      if (!response.success) {
        throw new Error(response.message || "Failed to get notification settings");
      }
      return response.data.settings;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mark notification as read mutation
export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await mockNotificationApi.markAsRead(notificationId);
      if (!response.success) {
        throw new Error(response.message || "Failed to mark notification as read");
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
};

// Mark all notifications as read mutation
export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await mockNotificationApi.markAllAsRead();
      if (!response.success) {
        throw new Error(response.message || "Failed to mark all notifications as read");
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
};

// Update notification settings mutation
export const useUpdateNotificationSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<NotificationSettings>) => {
      const response = await mockNotificationApi.updateSettings(settings);
      if (!response.success) {
        throw new Error(response.message || "Failed to update notification settings");
      }
      return response.data.settings;
    },
    onSuccess: () => {
      // Invalidate and refetch settings
      queryClient.invalidateQueries({ queryKey: notificationKeys.settings() });
    },
  });
};
