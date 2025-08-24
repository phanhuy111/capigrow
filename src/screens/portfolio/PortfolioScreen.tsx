import type React from "react";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { Icons } from "@/assets";
import Screen from "@/components/common/Screen";
import { Button, Card } from "@/components/ui";
import { usePortfolioPerformanceQuery, usePortfolioQuery } from "@/hooks/usePortfolioQueries";
import { formatDate } from "@/utils/helpers";
import { COLORS } from "@/utils/theme";

const PortfolioScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "monthly" | "yearly">("monthly");
  const [selectedTab, setSelectedTab] = useState<"overview" | "investments">("overview");

  const {
    data: portfolioData,
    isLoading: portfolioLoading,
    refetch: refetchPortfolio,
  } = usePortfolioQuery();
  const {
    data: _performanceData,
    isLoading: performanceLoading,
    refetch: refetchPerformance,
  } = usePortfolioPerformanceQuery(selectedPeriod);

  const onRefresh = async () => {
    await Promise.all([refetchPortfolio(), refetchPerformance()]);
  };

  const formatCurrencyVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatPercentageValue = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return COLORS.success;
      case "completed":
        return COLORS.info;
      case "pending":
        return COLORS.warning;
      case "cancelled":
        return COLORS.error;
      default:
        return COLORS.textTertiary;
    }
  };

  const renderInvestmentItem = (item: any) => {
    const returnAmount = item.currentValue - item.amount;
    const returnPercentage = item.amount > 0 ? (returnAmount / item.amount) * 100 : 0;
    const isPositive = returnAmount >= 0;

    return (
      <Card key={item.id} className="bg-white p-6 rounded-xl mb-4 shadow-sm">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1 flex-row items-center gap-4">
            <Text className="text-base font-bold text-gray-900 flex-1 mr-2">{item.title}</Text>
            <View
              className="px-2 py-1 rounded-sm"
              style={{ backgroundColor: `${getStatusColor(item.status)}20` }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: getStatusColor(item.status) }}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Button variant="ghost" size="icon" className="p-2">
            <SvgXml xml={Icons.more} width={20} height={20} fill={COLORS.textSecondary} />
          </Button>
        </View>

        <View className="flex-row justify-between mb-4">
          <View className="items-center gap-2">
            <Text className="text-sm text-gray-600">Invested</Text>
            <Text className="text-base text-gray-900 font-semibold">
              {formatCurrencyVND(item.amount)}
            </Text>
          </View>
          <View className="items-center gap-2">
            <Text className="text-sm text-gray-600">Current Value</Text>
            <Text className="text-base text-gray-900 font-semibold">
              {formatCurrencyVND(item.currentValue)}
            </Text>
          </View>
          <View className="items-center gap-2">
            <Text className="text-sm text-gray-600">Return</Text>
            <Text
              className="text-base font-semibold"
              style={{ color: isPositive ? COLORS.positive : COLORS.negative }}
            >
              {formatCurrencyVND(returnAmount)}
            </Text>
            <Text
              className="text-xs font-medium"
              style={{ color: isPositive ? COLORS.positive : COLORS.negative }}
            >
              ({formatPercentageValue(returnPercentage)})
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-gray-600">Invested: {formatDate(item.investedAt)}</Text>
          {item.expectedMaturity && (
            <Text className="text-xs text-gray-600">
              Maturity: {formatDate(item.expectedMaturity)}
            </Text>
          )}
        </View>
      </Card>
    );
  };

  if (portfolioLoading || performanceLoading || !portfolioData) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-gray-600">Loading portfolio...</Text>
        </View>
      </Screen>
    );
  }

  const isPositiveReturn = portfolioData.summary.totalReturn >= 0;

  return (
    <Screen paddingHorizontal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={portfolioLoading || performanceLoading}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-12 pt-4">
          <Text className="text-2xl font-bold text-gray-900">Portfolio</Text>
          <Button variant="ghost" size="icon" className="w-11 h-11 rounded-full bg-gray-50">
            <SvgXml xml={Icons.notification} width={24} height={24} fill={COLORS.textPrimary} />
          </Button>
        </View>

        {/* Portfolio Summary */}
        <Card className="mb-12">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-sm font-medium text-gray-600">Total Portfolio Value</Text>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <SvgXml xml={Icons.more} width={20} height={20} fill={COLORS.textSecondary} />
            </Button>
          </View>

          <View className="items-center mb-12 gap-4">
            <Text className="text-4xl font-bold text-gray-900">
              {formatCurrencyVND(portfolioData.summary.currentValue)}
            </Text>
            <View className="flex-row items-center gap-2">
              <SvgXml
                xml={Icons.trendUp}
                width={16}
                height={16}
                fill={isPositiveReturn ? COLORS.positive : COLORS.negative}
              />
              <Text
                className="text-base font-semibold"
                style={{ color: isPositiveReturn ? COLORS.positive : COLORS.negative }}
              >
                {formatCurrencyVND(portfolioData.summary.totalReturn)}
              </Text>
              <Text
                className="text-sm font-medium"
                style={{ color: isPositiveReturn ? COLORS.positive : COLORS.negative }}
              >
                ({formatPercentageValue(portfolioData.summary.totalReturnPercentage)})
              </Text>
            </View>
          </View>

          <View className="flex-row justify-around">
            <View className="items-center gap-2">
              <Text className="text-base text-gray-900 font-semibold">
                {formatCurrencyVND(portfolioData.summary.totalInvested)}
              </Text>
              <Text className="text-sm text-gray-600">Total Invested</Text>
            </View>
            <View className="items-center gap-2">
              <Text className="text-base text-gray-900 font-semibold">
                {portfolioData.summary.activeInvestments}
              </Text>
              <Text className="text-sm text-gray-600">Active Investments</Text>
            </View>
            <View className="items-center gap-2">
              <Text className="text-base text-gray-900 font-semibold">
                {portfolioData.summary.completedInvestments}
              </Text>
              <Text className="text-sm text-gray-600">Completed</Text>
            </View>
          </View>
        </Card>

        {/* Performance Period Selector */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-lg font-semibold text-gray-900">Performance</Text>
          <View className="flex-row bg-gray-50 rounded-lg p-1">
            {(["daily", "monthly", "yearly"] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "ghost"}
                size="sm"
                className={`px-4 py-2 rounded-md ${selectedPeriod === period ? "bg-blue-600" : "bg-transparent"}`}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  className={`text-xs ${selectedPeriod === period ? "text-white" : "text-gray-600"}`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </Button>
            ))}
          </View>
        </View>

        {/* Performance Chart Placeholder */}
        <Card className="mb-12">
          <View className="items-center py-16 gap-4">
            <SvgXml xml={Icons.chartSuccess} width={48} height={48} fill={COLORS.primary} />
            <Text className="text-base font-semibold text-gray-900">Performance Chart</Text>
            <Text className="text-sm text-gray-600">
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} performance data
            </Text>
          </View>
        </Card>

        {/* Tab Navigation */}
        <View className="flex-row bg-white mx-6 rounded-xl p-1 mb-4">
          <Button
            variant={selectedTab === "overview" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 py-2 rounded-sm ${selectedTab === "overview" ? "bg-blue-600" : "bg-transparent"}`}
            onPress={() => setSelectedTab("overview")}
          >
            <Text
              className={`text-sm font-medium ${selectedTab === "overview" ? "text-white" : "text-gray-600"}`}
            >
              Overview
            </Text>
          </Button>
          <Button
            variant={selectedTab === "investments" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 py-2 rounded-sm ${selectedTab === "investments" ? "bg-blue-600" : "bg-transparent"}`}
            onPress={() => setSelectedTab("investments")}
          >
            <Text
              className={`text-sm font-medium ${selectedTab === "investments" ? "text-white" : "text-gray-600"}`}
            >
              My Investments
            </Text>
          </Button>
        </View>

        {/* Tab Content */}
        {selectedTab === "overview" ? (
          <View className="px-6">
            <View className="flex-row flex-wrap gap-4 mb-6">
              <Card className="flex-1 min-w-[45%] items-center p-6">
                <SvgXml xml={Icons.trendUp} width={24} height={24} fill={COLORS.positive} />
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                  +{formatPercentageValue(8.5)}
                </Text>
                <Text className="text-sm text-gray-600 text-center">Best Performing</Text>
              </Card>
              <Card className="flex-1 min-w-[45%] items-center p-6">
                <SvgXml xml={Icons.graph} width={24} height={24} fill={COLORS.primary} />
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                  {formatPercentageValue(portfolioData.summary.totalReturnPercentage)}
                </Text>
                <Text className="text-sm text-gray-600 text-center">Average Return</Text>
              </Card>
              <Card className="flex-1 min-w-[45%] items-center p-6">
                <SvgXml xml={Icons.shieldTick} width={24} height={24} fill={COLORS.warning} />
                <Text className="text-lg font-semibold text-gray-900 mb-1">Medium</Text>
                <Text className="text-sm text-gray-600 text-center">Risk Level</Text>
              </Card>
              <Card className="flex-1 min-w-[45%] items-center p-6">
                <SvgXml xml={Icons.timer} width={24} height={24} fill={COLORS.info} />
                <Text className="text-lg font-semibold text-gray-900 mb-1">24 months</Text>
                <Text className="text-sm text-gray-600 text-center">Avg. Duration</Text>
              </Card>
            </View>
          </View>
        ) : (
          <View className="px-6">
            {portfolioData.investments && portfolioData.investments.length > 0 ? (
              portfolioData.investments.map((investment: any) => renderInvestmentItem(investment))
            ) : (
              <View className="items-center py-20">
                <SvgXml xml={Icons.cup} width={60} height={60} fill={COLORS.textTertiary} />
                <Text className="text-lg font-bold text-gray-900 mt-4 mb-1">
                  No Investments Yet
                </Text>
                <Text className="text-base text-gray-600 text-center px-6">
                  Start building your portfolio by exploring investment opportunities
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

export default PortfolioScreen;
