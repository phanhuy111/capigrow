import { mockDelay, mockApiResponse } from './index';
import { mockNotifications, mockNotificationSettings } from '@/mock/data/notifications';

export const mockNotificationApi = {
  getNotifications: async (filters?: {
    type?: string;
    isRead?: boolean;
    limit?: number;
  }) => {
    await mockDelay(800);
    
    let filteredNotifications = [...mockNotifications];
    
    if (filters?.type) {
      filteredNotifications = filteredNotifications.filter(
        notif => notif.type === filters.type
      );
    }
    
    if (filters?.isRead !== undefined) {
      filteredNotifications = filteredNotifications.filter(
        notif => notif.isRead === filters.isRead
      );
    }
    
    if (filters?.limit) {
      filteredNotifications = filteredNotifications.slice(0, filters.limit);
    }
    
    return mockApiResponse(filteredNotifications, true, 'Notifications retrieved successfully');
  },

  markAsRead: async (notificationId: string) => {
    await mockDelay(300);
    
    const notification = mockNotifications.find(notif => notif.id === notificationId);
    
    if (notification) {
      notification.isRead = true;
      return mockApiResponse({ success: true }, true, 'Notification marked as read');
    }
    
    return mockApiResponse(null, false, 'Notification not found');
  },

  markAllAsRead: async () => {
    await mockDelay(500);
    
    mockNotifications.forEach(notif => {
      notif.isRead = true;
    });
    
    return mockApiResponse({ success: true }, true, 'All notifications marked as read');
  },

  getSettings: async () => {
    await mockDelay(300);
    return mockApiResponse(mockNotificationSettings, true, 'Notification settings retrieved successfully');
  },

  updateSettings: async (settings: Partial<typeof mockNotificationSettings>) => {
    await mockDelay(500);
    
    const updatedSettings = { ...mockNotificationSettings, ...settings };
    
    return mockApiResponse(updatedSettings, true, 'Notification settings updated successfully');
  },
};
