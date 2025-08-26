import type React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Icon } from "@/components/common";
import { COLORS } from "@/utils/constants";
import type { RootStackParamList } from "@/types";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  priority: string;
  createdAt: string;
}

interface NotificationItemProps {
  notification: Notification;
  onPress?: (notificationId: string) => void;
}

type NotificationItemNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const navigation = useNavigation<NotificationItemNavigationProp>();
  const getIconName = (type: string) => {
    switch (type) {
      case "transaction":
        return "credit-card";
      case "investment":
        return "trending-up";
      case "system":
        return "info";
      case "promotion":
        return "gift";
      default:
        return "bell";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handlePress = () => {
    // Navigate to NotificationDetail
    navigation.navigate("NotificationDetail", {
      notificationId: notification.id,
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt,
      type: notification.type,
    });
    
    // Mark as read if callback provided
    if (onPress) {
      onPress(notification.id);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className="mb-3 mx-4" activeOpacity={0.7}>
      <View
        className={`p-4 rounded-xl border ${
          notification.isRead ? "bg-white border-gray-100" : "bg-blue-50 border-blue-100"
        }`}
      >
        <View className="flex-row items-start">
          {/* Icon container */}
          <View className="mr-3 mt-1">
            <View
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{
                backgroundColor: notification.isRead ? COLORS.gray100 : COLORS.primary + "20",
              }}
            >
              <Icon
                name={getIconName(notification.type)}
                size={16}
                color={notification.isRead ? COLORS.gray500 : COLORS.primary}
              />
            </View>
          </View>

          {/* Content */}
          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-1">
              <Text
                className={`text-base font-medium flex-1 mr-2 ${
                  notification.isRead ? "text-gray-700" : "text-gray-900"
                }`}
                numberOfLines={2}
              >
                {notification.message}
              </Text>

              {/* More button */}
              <TouchableOpacity className="p-1">
                <Icon name="more-horizontal" size={16} color={COLORS.gray400} />
              </TouchableOpacity>
            </View>

            {/* Time */}
            <Text className="text-sm text-gray-500">{formatTime(notification.createdAt)}</Text>
          </View>

          {/* Unread indicator */}
          {!notification.isRead && (
            <View className="ml-2 mt-2">
              <View className="w-2 h-2 rounded-full bg-blue-500" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;
