import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type React from "react";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { Icons } from "@/assets";
import Screen from "@/components/common/Screen";
import { Card } from "@/components/ui/card";
import { useInvestmentCategoriesQuery, useInvestmentsQuery } from "@/hooks/useInvestmentQueries";
import type { Investment, RootStackParamList } from "@/types";
import { formatCurrency } from "@/utils/helpers";
import { COLORS } from "@/utils/theme";

type InvestmentsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const InvestmentsScreen: React.FC = () => {
  const navigation = useNavigation<InvestmentsScreenNavigationProp>();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>("");

  const {
    data: investments = [],
    isLoading: investmentsLoading,
    refetch: refetchInvestments,
  } = useInvestmentsQuery();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useInvestmentCategoriesQuery();

  const onRefresh = async () => {
    await Promise.all([refetchInvestments(), refetchCategories()]);
  };

  const filteredInvestments = investments.filter(
    (
      investment: Investment & {
        totalRaised?: number;
        targetAmount?: number;
        minInvestment?: number;
        investorCount?: number;
      }
    ) => {
      const matchesSearch =
        investment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        investment.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || investment.category === selectedCategory;
      const matchesRisk = !selectedRiskLevel || investment.riskLevel === selectedRiskLevel;
      const matchesStatus = investment.status === "active";

      return matchesSearch && matchesCategory && matchesRisk && matchesStatus;
    }
  );

  const _formatCurrencyVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "low":
        return COLORS.success;
      case "medium":
        return COLORS.warning;
      case "high":
        return COLORS.error;
      default:
        return COLORS.textTertiary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "energy":
        return Icons.cup;
      case "technology":
        return Icons.diagram;
      case "real estate":
        return Icons.buildings;
      case "healthcare":
        return Icons.health;
      case "agriculture":
        return Icons.global;
      case "finance":
        return Icons.bank;
      default:
        return Icons.cup;
    }
  };

  const renderInvestmentCard = (
    item: Investment & {
      totalRaised?: number;
      targetAmount?: number;
      minInvestment?: number;
      investorCount?: number;
    }
  ) => {
    const progressPercentage = ((item.totalRaised ?? 0) / (item.targetAmount ?? 1)) * 100;
    const riskColor = getRiskColor(item.riskLevel);

    return (
      <Card key={item.id} className="mb-6">
        <TouchableOpacity
          onPress={() => navigation.navigate("InvestmentDetails", { investmentId: item.id })}
        >
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-row items-center flex-1 gap-4">
              <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
                <SvgXml
                  xml={getCategoryIcon(item.category)}
                  width={20}
                  height={20}
                  fill={COLORS.primary}
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">{item.title}</Text>
                <Text className="text-sm text-gray-600">{item.category}</Text>
              </View>
            </View>
            <View className="px-3 py-1 rounded-md" style={{ backgroundColor: `${riskColor}20` }}>
              <Text className="text-xs font-semibold" style={{ color: riskColor }}>
                {item.riskLevel.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text className="text-base text-gray-600 leading-5 mb-6" numberOfLines={2}>
            {item.description}
          </Text>

          <View className="flex-row justify-between mb-6">
            <View className="flex-row items-center gap-2">
              <SvgXml xml={Icons.trendUp} width={16} height={16} fill={COLORS.positive} />
              <Text className="text-sm text-gray-600 font-medium">{item.expectedReturn}% APY</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <SvgXml xml={Icons.timer} width={16} height={16} fill={COLORS.textSecondary} />
              <Text className="text-sm text-gray-600 font-medium">{item.duration} months</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <SvgXml xml={Icons.emptyWallet} width={16} height={16} fill={COLORS.textSecondary} />
              <Text className="text-sm text-gray-600 font-medium">
                {formatCurrency(item.minInvestment ?? 0)}
              </Text>
            </View>
          </View>

          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Funding Progress</Text>
              <Text className="text-sm text-blue-600 font-semibold">
                {Math.round(progressPercentage)}%
              </Text>
            </View>
            <View className="h-1.5 bg-gray-200 rounded-sm overflow-hidden">
              <View
                className="h-full bg-blue-600 rounded-sm"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">
                {formatCurrency(item.totalRaised ?? 0)} raised
              </Text>
              <Text className="text-sm text-gray-600">{item.investorCount ?? 0} investors</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  const renderCategoryFilter = (category: { id: string; name: string; color: string }) => (
    <TouchableOpacity
      key={category.id}
      className="items-center mr-6 gap-4"
      onPress={() => setSelectedCategory(selectedCategory === category.name ? "" : category.name)}
    >
      <View
        className="w-14 h-14 rounded-full justify-center items-center"
        style={{ backgroundColor: `${category.color}20` }}
      >
        <SvgXml
          xml={getCategoryIcon(category.name)}
          width={20}
          height={20}
          fill={selectedCategory === category.name ? COLORS.white : category.color}
        />
      </View>
      <Text
        className={`text-sm text-gray-900 ${selectedCategory === category.name ? "text-blue-600 font-semibold" : ""}`}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderRiskFilter = (riskLevel: string) => (
    <TouchableOpacity
      key={riskLevel}
      className={`px-6 py-4 rounded-lg border ${selectedRiskLevel === riskLevel ? "bg-blue-600 border-blue-600" : "bg-gray-50 border-gray-200"}`}
      onPress={() => setSelectedRiskLevel(selectedRiskLevel === riskLevel ? "" : riskLevel)}
    >
      <Text
        className={`text-sm ${selectedRiskLevel === riskLevel ? "text-white" : "text-gray-600"}`}
      >
        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Screen paddingHorizontal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={investmentsLoading || categoriesLoading}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8 pt-4">
          <Text className="text-2xl font-bold text-gray-900">Explore</Text>
          <TouchableOpacity className="w-11 h-11 rounded-full bg-gray-50 justify-center items-center">
            <SvgXml xml={Icons.notification} width={24} height={24} fill={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center mb-8 gap-4">
          <View className="flex-1 flex-row items-center bg-gray-50 rounded-lg px-5 py-4 gap-4">
            <SvgXml xml={Icons.search} width={20} height={20} fill={COLORS.textTertiary} />
            <TextInput
              className="flex-1 text-base text-gray-900"
              placeholder="Search investments..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>
          <TouchableOpacity className="w-12 h-12 rounded-lg bg-gray-50 justify-center items-center">
            <SvgXml xml={Icons.menuSquare} width={20} height={20} fill={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-semibold text-gray-900">Categories</Text>
            <TouchableOpacity>
              <Text className="text-sm font-medium text-blue-600">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
            {categories.map(renderCategoryFilter)}
          </ScrollView>
        </View>

        {/* Risk Level Filters */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-900 mb-6">Risk Level</Text>
          <View className="flex-row gap-4">{["low", "medium", "high"].map(renderRiskFilter)}</View>
        </View>

        {/* Investment Results */}
        <View className="mb-16">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-semibold text-gray-900">
              {filteredInvestments.length} Investment{filteredInvestments.length !== 1 ? "s" : ""}{" "}
              Found
            </Text>
            <TouchableOpacity className="flex-row items-center gap-2">
              <SvgXml xml={Icons.arrowDown} width={16} height={16} fill={COLORS.textSecondary} />
              <Text className="text-sm font-medium text-gray-600">Sort</Text>
            </TouchableOpacity>
          </View>

          {filteredInvestments.length > 0 ? (
            filteredInvestments.map(renderInvestmentCard)
          ) : (
            <View className="items-center py-16 gap-6">
              <SvgXml xml={Icons.cup} width={60} height={60} fill={COLORS.textTertiary} />
              <Text className="text-xl font-semibold text-gray-900">No Investments Found</Text>
              <Text className="text-base text-gray-600 text-center px-6">
                Try adjusting your search criteria or check back later for new opportunities.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default InvestmentsScreen;
