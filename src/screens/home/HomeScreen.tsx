import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SvgXml } from "react-native-svg";
import { useAuthStore } from "@/store/authStore";
import { RootStackParamList } from "@/types";
import { COLORS } from "@/utils/theme";
import { Icons } from "@/assets";

import { Card, Button, Input } from "@/components/ui";
import Screen from "@/components/common/Screen";
import { mockPortfolioApi } from "@/mock/api/portfolio";
import { mockInvestmentApi } from "@/mock/api/investments";
import { mockNotificationApi } from "@/mock/api/notifications";
import { formatCurrency, formatPercentage } from "@/utils/helpers";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuthStore();

  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [portfolioResponse, investmentsResponse, notificationsResponse] =
        await Promise.all([
          mockPortfolioApi.getPortfolio(),
          mockInvestmentApi.getInvestments(),
          mockNotificationApi.getNotifications({ limit: 5 }),
        ]);

      if (portfolioResponse.success) {
        setPortfolioData(portfolioResponse.data);
      }
      if (investmentsResponse.success) {
        setInvestments(investmentsResponse.data.slice(0, 3));
      }
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data);
      }
    } catch (error) {
      console.error("Error loading home data:", error);
    }
  };

  return (
    <Screen paddingHorizontal>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8 pt-4">
          <View className="flex-1">
            <Text className="text-base text-gray-600 mb-1">Good morning,</Text>
            <Text className="text-xl font-semibold text-gray-900">
              {user?.first_name || "User"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
            className="w-11 h-11 rounded-full bg-gray-100 justify-center items-center relative"
          >
            <SvgXml
              xml={Icons.notification}
              width={24}
              height={24}
              fill={COLORS.textPrimary}
            />
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <View className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-500 justify-center items-center">
                <Text className="text-white text-xs font-semibold">
                  {notifications.filter((n) => !n.isRead).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center mb-8 gap-4">
          <View className="flex-1">
            <Input
              placeholder="Search investments..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={
                <SvgXml
                  xml={Icons.search}
                  width={20}
                  height={20}
                  fill={COLORS.textTertiary}
                />
              }
              className="bg-gray-100 border-0"
            />
          </View>
          <TouchableOpacity className="w-12 h-12 rounded-lg bg-gray-100 justify-center items-center">
            <SvgXml
              xml={Icons.menuSquare}
              width={20}
              height={20}
              fill={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Portfolio Overview */}
        {portfolioData && (
          <Card className="mb-8">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg font-semibold text-gray-900">
                Portfolio Overview
              </Text>
              <TouchableOpacity className="p-0">
                <SvgXml
                  xml={Icons.more}
                  width={20}
                  height={20}
                  fill={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View className="gap-6">
              <View className="items-center gap-4">
                <Text className="text-3xl font-bold text-gray-900">
                  {formatCurrency(portfolioData.totalValue)}
                </Text>
                <View className="flex-row items-center gap-2">
                  <SvgXml
                    xml={Icons.trendUp}
                    width={16}
                    height={16}
                    fill={
                      portfolioData.returnPercentage >= 0
                        ? COLORS.positive
                        : COLORS.negative
                    }
                  />
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color:
                        portfolioData.returnPercentage >= 0
                          ? COLORS.positive
                          : COLORS.negative,
                    }}
                  >
                    {formatPercentage(portfolioData.returnPercentage)}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-around">
                <View className="items-center gap-2">
                  <Text className="text-base font-semibold text-gray-900">
                    {formatCurrency(portfolioData.totalInvested)}
                  </Text>
                  <Text className="text-sm text-gray-600">Total Invested</Text>
                </View>
                <View className="items-center gap-2">
                  <Text className="text-base font-semibold text-gray-900">
                    {formatCurrency(portfolioData.totalReturn)}
                  </Text>
                  <Text className="text-sm text-gray-600">Total Return</Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* Investment Categories */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-semibold text-gray-900">
              Categories
            </Text>
            <TouchableOpacity className="p-0">
              <Text className="text-sm font-medium text-purple-600">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -24, paddingHorizontal: 24 }}
          >
            {["Energy", "Technology", "Real Estate", "Healthcare"].map(
              (category, index) => (
                <TouchableOpacity
                  key={index}
                  className="p-0 items-center mr-4 gap-3"
                >
                  <View className="w-14 h-14 rounded-full bg-purple-50 justify-center items-center">
                    <SvgXml
                      xml={
                        index === 0
                          ? Icons.cup
                          : index === 1
                          ? Icons.diagram
                          : index === 2
                          ? Icons.buildings
                          : Icons.health
                      }
                      width={24}
                      height={24}
                      fill={COLORS.primary}
                    />
                  </View>
                  <Text className="text-sm font-medium text-gray-900">
                    {category}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>

        {/* Featured Investments */}
        <View className="mb-12">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-semibold text-gray-900">
              Featured Investments
            </Text>
            <TouchableOpacity className="p-0">
              <Text className="text-sm font-medium text-purple-600">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          {investments.map((investment, index) => (
            <Card key={investment.id} className="mb-6">
              <View className="flex-row justify-between items-start mb-6">
                <View className="flex-1 mr-4">
                  <Text className="text-base font-semibold text-gray-900 mb-2">
                    {investment.title}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {investment.category}
                  </Text>
                </View>
                <View className="bg-green-50 px-4 py-2 rounded-lg">
                  <Text className="text-xs font-semibold text-green-600">
                    {investment.expectedReturn}% APY
                  </Text>
                </View>
              </View>

              <View className="mb-6 gap-4">
                <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-purple-600 rounded-full"
                    style={{
                      width: `${
                        (investment.totalRaised / investment.targetAmount) * 100
                      }%`,
                    }}
                  />
                </View>
                <Text className="text-sm text-gray-600">
                  {formatCurrency(investment.totalRaised)} of{" "}
                  {formatCurrency(investment.targetAmount)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-600">
                  Min: {formatCurrency(investment.minInvestment)}
                </Text>
                <Text className="text-sm text-gray-600">
                  {investment.investorCount} investors
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default HomeScreen;
