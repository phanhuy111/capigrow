import { useNavigation } from "@react-navigation/native";
import type React from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Icons } from "@/assets";
import { Card } from "@/components/ui";
import {
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useNotificationsQuery,
} from "@/hooks/useNotificationQueries";
import { formatDate } from "@/utils/helpers";
import { COLORS } from "@/utils/constants";
import Header from "../common/Header";
import HeaderNotification from "./components/Header";
import { Icon } from "@/components/common";
import NotificationItem from "./components/NotificationItem";
import Screen from "@/components/common/Screen";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  priority: string;
  createdAt: string;
}

const NotificationScreen: React.FC = () => {
  const { data: notificationsData, isLoading, refetch } = useNotificationsQuery();

  const markAsReadMutation = useMarkAsReadMutation();
  const markAllAsReadMutation = useMarkAllAsReadMutation();

  const notifications = notificationsData?.notifications || [];

  const onRefresh = () => {
    refetch();
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const renderNotificationItem = (item: Notification) => {
    return <NotificationItem key={item.id} notification={item} onPress={handleMarkAsRead} />;
  };

  return (
    <Screen>
      <HeaderNotification />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
      >
        {/* Header */}

        {/* Notifications List */}
        <View className="mb-16">
          {notifications.length > 0 ? (
            notifications.map(renderNotificationItem)
          ) : (
            <View className="items-center py-16 gap-4">
              <View className="h-12 w-12 rounded-full bg-gray-200 p-9 flex justify-center items-center">
                <Icon name="bell-off" color={COLORS.black} />
              </View>
              <Text className="text-xl font-semibold text-gray-900">Chưa có thông báo nào</Text>
              <Text className="text-base text-gray-600 text-center px-6">
                Danh sách các thông báo của bạn sẽ được cập nhật tại đây.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default NotificationScreen;
