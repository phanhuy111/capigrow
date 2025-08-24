import { mockDelay, mockApiResponse } from './index';
import { mockNotifications, mockNotificationSettings } from '@/mock/data/notifications';

// Get notifications with optional filters
export const getNotifications = async (filters?: {
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
  
  return mockApiResponse({
    success: true,
    message: 'Notifications retrieved successfully',
    notifications: filteredNotifications,
    total: filteredNotifications.length,
    unreadCount: filteredNotifications.filter(n => !n.isRead).length
  });
};

// Mark notification as read
export const markAsRead = async (notificationId: string) => {
  await mockDelay(300);
  
  const notification = mockNotifications.find(notif => notif.id === notificationId);
  
  if (notification) {
    notification.isRead = true;
    return mockApiResponse({
      success: true,
      message: 'Notification marked as read'
    });
  }
  
  return mockApiResponse({
    success: false,
    message: 'Notification not found'
  }, false);
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  await mockDelay(500);
  
  mockNotifications.forEach(notif => {
    notif.isRead = true;
  });
  
  return mockApiResponse({
    success: true,
    message: 'All notifications marked as read'
  });
};

// Get notification settings
export const getSettings = async () => {
  await mockDelay(300);
  return mockApiResponse({
    success: true,
    message: 'Notification settings retrieved successfully',
    settings: mockNotificationSettings
  });
};

// Update notification settings
export const updateSettings = async (settings: Partial<typeof mockNotificationSettings>) => {
  await mockDelay(500);
  
  const updatedSettings = { ...mockNotificationSettings, ...settings };
  
  return mockApiResponse({
    success: true,
    message: 'Notification settings updated successfully',
    settings: updatedSettings
  });
};

// Legacy export for backward compatibility
export const mockNotificationApi = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getSettings,
  updateSettings
};
