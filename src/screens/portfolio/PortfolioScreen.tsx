import type React from "react";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Icons } from "@/assets";
import Icon from "@/components/common/Icon";
import Screen from "@/components/common/Screen";
import tokens from "@/components/lib/tokens";
import { Button } from "@/components/ui";
import InvestmentItem from "@/screens/portfolio/components/InvestmentItem";
import OverviewStats from "@/screens/portfolio/components/OverviewStats";
import PerformanceChart from "@/screens/portfolio/components/PerformanceChart";
import PortfolioSummaryCard from "@/screens/portfolio/components/PortfolioSummaryCard";
import TabNavigation from "@/screens/portfolio/components/TabNavigation";
import { usePortfolioPerformanceQuery, usePortfolioQuery } from "@/hooks/usePortfolioQueries";
import { formatPercentageValue } from "@/utils/helpers";

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

  const handleInvestmentPress = (id: string) => {
    console.log("Navigate to investment:", id);
  };

  const handleWithdraw = () => {
    console.log("Withdraw pressed");
  };

  const handleInfoPress = () => {
    // Handle info press
    console.log("Info pressed");
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
        <View className="flex-row justify-between items-center mb-6 pt-4">
          <Text className="text-2xl font-bold text-gray-900">Portfolio</Text>
          <Button
            variant="ghost"
            size="icon"
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: tokens.colors.background.secondary,
            }}
          >
            <Icon
              name="infoCircle"
              size={24}
              color={tokens.colors.text.primary}
            />
          </Button>
        </View>

        {/* Portfolio Summary Card */}
        <PortfolioSummaryCard
          totalValue={portfolioData?.summary?.currentValue}
          availableBalance={portfolioData?.summary?.totalInvested}
          totalReturn={portfolioData?.summary?.totalReturn}
          totalReturnPercentage={portfolioData?.summary?.totalReturnPercentage}
          onWithdraw={handleWithdraw}
          onInfoPress={handleInfoPress}
        />

        {/* Performance Chart */}
        <PerformanceChart
          title="Portfolio Performance"
          height={200}
          data={_performanceData?.data || []}
        />

        {/* Tab Navigation */}
        <TabNavigation
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "investments", label: "My Investments" },
          ]}
          activeTab={selectedTab}
          onTabChange={(tabId) => setSelectedTab(tabId as "overview" | "investments")}
        />

        {/* Tab Content */}
        {selectedTab === "overview" ? (
          <OverviewStats
            stats={[
              {
                label: "Total Value",
                value: `$${portfolioData?.summary?.currentValue.toLocaleString()}`,
                icon: "trendUp",
                iconColor: tokens.colors.success?.[500] || "#10B981",
                backgroundColor: tokens.colors.success?.[100] || "#DCFCE7",
              },
              {
                label: "Total Return",
                value: `$${portfolioData?.summary?.totalReturn.toLocaleString()}`,
                change: {
                  value: formatPercentageValue(portfolioData?.summary?.totalReturnPercentage),
                  isPositive: portfolioData?.summary?.totalReturn >= 0,
                },
                icon: "graph",
                iconColor: tokens.colors.primary?.[500] || "#3B82F6",
                backgroundColor: tokens.colors.primary?.[100] || "#DBEAFE",
              },
              {
                label: "Active Investments",
                value: portfolioData?.summary?.activeInvestments.toString(),
                icon: "shieldTick",
                iconColor: tokens.colors.warning?.[500] || "#F59E0B",
                backgroundColor: tokens.colors.warning?.[100] || "#FEF3C7",
              },
              {
                label: "Completed",
                value: portfolioData?.summary?.completedInvestments.toString(),
                icon: "timer",
                iconColor: tokens.colors.neutral?.[500] || "#6B7280",
                backgroundColor: tokens.colors.neutral?.[100] || "#F3F4F6",
              },
            ]}
          />
        ) : (
          <View className="px-6">
            {portfolioData.investments && portfolioData.investments.length > 0 ? (
              portfolioData.investments.map((item) => (
                <InvestmentItem
                  key={item.id}
                  id={item.id}
                  title={item.investmentName}
                  investedAmount={item.investedAmount}
                  currentValue={item.currentValue}
                  returnAmount={item.returnAmount}
                  returnPercentage={item.returnPercentage}
                  status={
                    item.status === "cancelled"
                      ? "completed"
                      : (item.status as "active" | "completed" | "pending")
                  }
                  onPress={() => handleInvestmentPress(item.id)}
                />
              ))
            ) : (
              <View className="items-center py-20">
                <Icon name="cup" size={60} color={tokens.colors.text.tertiary} />
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
