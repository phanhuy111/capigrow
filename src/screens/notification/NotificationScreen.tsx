import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
import { COLORS } from "@/utils/theme";
import { Icons } from "@/assets";
import { Card } from "@/components/ui";
import { mockNotificationApi } from "@/mock/api/notifications";
import { formatDate } from "@/utils/helpers";

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await mockNotificationApi.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await mockNotificationApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await mockNotificationApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "investment_update":
        return Icons.trendUp;
      case "transaction_completed":
        return Icons.tick;
      case "verification_approved":
        return Icons.shieldTick;
      case "new_investment":
        return Icons.cup;
      case "dividend_received":
        return Icons.moneyReceive;
      default:
        return Icons.notification;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return COLORS.error;
      case "medium":
        return COLORS.warning;
      case "low":
        return COLORS.info;
      default:
        return COLORS.textTertiary;
    }
  };

  const renderNotificationItem = (item: any) => {
    const priorityColor = getPriorityColor(item.priority);

    return (
      <TouchableOpacity key={item.id} onPress={() => handleMarkAsRead(item.id)}>
        <Card
          className={`mb-4 ${
            !item.isRead ? "border-l-4 border-l-blue-600" : ""
          }`}
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-row flex-1 gap-4">
              <View
                className="w-10 h-10 rounded-full justify-center items-center"
                style={{ backgroundColor: priorityColor + "20" }}
              >
                <SvgXml
                  xml={getNotificationIcon(item.type)}
                  width={20}
                  height={20}
                  fill={priorityColor}
                />
              </View>
              <View className="flex-1 gap-2">
                <Text
                  className={`text-base text-gray-900 ${
                    !item.isRead ? "font-semibold" : "font-medium"
                  }`}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-base text-gray-600 leading-5"
                  numberOfLines={2}
                >
                  {item.message}
                </Text>
                <Text className="text-xs text-gray-400">
                  {formatDate(item.createdAt, "relative")}
                </Text>
              </View>
            </View>
            {!item.isRead && (
              <View className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 pt-4">
        <TouchableOpacity
          className="w-11 h-11 rounded-full bg-gray-50 justify-center items-center"
          onPress={() => navigation.goBack()}
        >
          <SvgXml
            xml={Icons.arrowLeft}
            width={24}
            height={24}
            fill={COLORS.textPrimary}
          />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-gray-900 flex-1 text-center">
          Notifications
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text className="text-base font-medium text-blue-600">
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notification Stats */}
      {unreadCount > 0 && (
        <Card className="mb-8">
          <View className="flex-row items-center gap-4">
            <SvgXml
              xml={Icons.notification}
              width={24}
              height={24}
              fill={COLORS.primary}
            />
            <Text className="text-base text-gray-900 flex-1">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </Text>
          </View>
        </Card>
      )}

      {/* Notifications List */}
      <View className="mb-16">
        {notifications.length > 0 ? (
          notifications.map(renderNotificationItem)
        ) : (
          <View className="items-center py-16 gap-6">
            <SvgXml
              xml={Icons.notificationSlash}
              width={60}
              height={60}
              fill={COLORS.textTertiary}
            />
            <Text className="text-xl font-semibold text-gray-900">
              No Notifications
            </Text>
            <Text className="text-base text-gray-600 text-center px-6">
              You're all caught up! Check back later for updates.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default NotificationScreen;
