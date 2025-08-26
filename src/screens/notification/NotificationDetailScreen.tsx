import { useNavigation, useRoute } from "@react-navigation/native";
import type React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@/components/common";
import { Button } from "@/components/ui";
import { COLORS } from "@/utils/constants";
import Header, { HeaderElements } from "../common/Header";
import Screen from "@/components/common/Screen";

interface NotificationDetailParams {
  notificationId: string;
  title: string;
  message: string;
  createdAt: string;
  type: string;
}

const NotificationDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as NotificationDetailParams;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const dateFormatted = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return `${time} - ${dateFormatted}`;
  };

  return (
    <Screen>
      <Header
        left={{
          component: HeaderElements.backButton(),
          onPress: () => navigation.goBack(),
        }}
        center={{
          component: HeaderElements.title("Chi tiết thông báo"),
        }}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 24,
          paddingHorizontal: 16,
        }}
      >
        {/* Title Section */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-3 leading-8">
            {params?.title ||
              "🍣🍣 Giảm 30% (tối đa 500k) Nama sushi - chỉ cần xác thực tài khoản thành công"}
          </Text>
          <Text className="text-sm text-gray-500">
            {params?.createdAt
              ? formatDateTime(params.createdAt)
              : "14:08 - 21/04/2025"}
          </Text>
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-200 mb-6" />

        {/* Content Section */}
        <View>
          <Text className="text-base text-gray-900 leading-6">
            {params?.message ||
              "🎉 Ưu đãi đặc biệt từ CapiGrowth: Chỉ cần mở tài khoản và xác thực thành công, bạn sẽ nhận ngay ưu đãi giảm 30% (tối đa 500k) tại hơn 30 hệ thống Nama Sushi trên cả nước (Không áp dụng với mua hàng online trên các ứng dụng giao hàng). Thưởng thức bữa ăn ngon miệng cùng bạn bè và gia đình với chi phí tiết kiệm hơn!"}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default NotificationDetailScreen;
