import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { useInvestmentQuery } from "@/hooks/useInvestmentQueries";
import { COLORS } from "@/utils/theme";
import { RISK_LEVELS } from "@/utils/constants";
import { formatCurrency, formatPercentage, formatDate } from "@/utils/helpers";

type InvestmentDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "InvestmentDetails"
>;
type InvestmentDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "InvestmentDetails"
>;

const InvestmentDetailsScreen: React.FC = () => {
  const navigation = useNavigation<InvestmentDetailsScreenNavigationProp>();
  const route = useRoute<InvestmentDetailsScreenRouteProp>();
  const { investmentId } = route.params;

  const { data: selectedInvestment, isLoading } = useInvestmentQuery(investmentId);
  
  // Type assertion to handle mock data structure mismatch
  const investment = selectedInvestment as any;

  const handleInvest = () => {
    navigation.navigate('InvestmentAmount', { investmentId });
  };

  if (isLoading || !investment) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="mt-4 text-base text-gray-600">
            Loading investment details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const normalizedRiskLevel =
    investment.riskLevel.toLowerCase() as keyof typeof RISK_LEVELS;
  const riskInfo = RISK_LEVELS[normalizedRiskLevel] || RISK_LEVELS.medium;
  const progressPercentage =
    (investment.totalRaised / investment.targetAmount) *
    100;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {investment.images && investment.images.length > 0 && (
          <Image
            source={{ uri: investment.images[0] }}
            className="w-full h-48"
            style={{ resizeMode: "cover" }}
          />
        )}

        <View className="flex-row justify-between items-start p-4 pb-3">
          <Text className="text-2xl font-bold text-gray-900 flex-1 mr-2">
            {investment.title}
          </Text>
          <View
            className="px-2 py-1 rounded"
            style={{ backgroundColor: riskInfo.color + "20" }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: riskInfo.color }}
            >
              {riskInfo.label}
            </Text>
          </View>
        </View>

        <Text className="text-base text-gray-600 leading-6 px-4 mb-4">
          {investment.description}
        </Text>

        <View className="flex-row justify-between px-4 mb-4">
          <View className="bg-gray-100 p-3 rounded-lg items-center flex-1 mx-1">
            <Text className="text-lg font-bold text-blue-600 mb-1">
              {formatPercentage(investment.expectedReturn)}
            </Text>
            <Text className="text-xs text-gray-600 text-center">
              Expected Return
            </Text>
          </View>
          <View className="bg-gray-100 p-3 rounded-lg items-center flex-1 mx-1">
            <Text className="text-lg font-bold text-blue-600 mb-1">
              {investment.duration} months
            </Text>
            <Text className="text-xs text-gray-600 text-center">Duration</Text>
          </View>
          <View className="bg-gray-100 p-3 rounded-lg items-center flex-1 mx-1">
            <Text className="text-lg font-bold text-blue-600 mb-1">
              {formatCurrency(investment.minInvestment)}
            </Text>
            <Text className="text-xs text-gray-600 text-center">
              Min Investment
            </Text>
          </View>
        </View>

        <View className="px-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-semibold text-gray-900">
              Funding Progress
            </Text>
            <Text className="text-base font-bold text-blue-600">
              {formatPercentage(progressPercentage, 0)}
            </Text>
          </View>
          <View className="h-2 bg-gray-200 rounded mb-2">
            <View
              className="h-full bg-blue-600 rounded"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-600">
              {formatCurrency(investment.totalRaised)} raised
            </Text>
            <Text className="text-sm text-gray-600">
              of {formatCurrency(investment.targetAmount)}
            </Text>
          </View>
        </View>

        <View className="px-4 mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Investment Details
          </Text>

          <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
            <Text className="text-sm text-gray-600 flex-1">Category:</Text>
            <Text className="text-sm text-gray-900 font-medium flex-1 text-right">
              {investment.category}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
            <Text className="text-sm text-gray-600 flex-1">Risk Level:</Text>
            <Text className="text-sm text-gray-900 font-medium flex-1 text-right">
              {riskInfo.label}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
            <Text className="text-sm text-gray-600 flex-1">
              Investment Range:
            </Text>
            <Text className="text-sm text-gray-900 font-medium flex-1 text-right">
              {formatCurrency(investment.minInvestment)} -{" "}
              {formatCurrency(investment.maxInvestment || investment.minInvestment * 10)}
            </Text>
          </View>

          {investment.startDate && (
            <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
              <Text className="text-sm text-gray-600 flex-1">Start Date:</Text>
              <Text className="text-sm text-gray-900 font-medium flex-1 text-right">
                {formatDate(investment.startDate)}
              </Text>
            </View>
          )}

          {investment.endDate && (
            <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
              <Text className="text-sm text-gray-600 flex-1">End Date:</Text>
              <Text className="text-sm text-gray-900 font-medium flex-1 text-right">
                {formatDate(investment.endDate)}
              </Text>
            </View>
          )}
        </View>

        {investment.documents && investment.documents.length > 0 && (
          <View className="px-4 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Documents
            </Text>
            <Text className="text-sm text-gray-600 leading-5">
              {investment.documents.join(', ')}
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-lg items-center"
          onPress={handleInvest}
        >
          <Text className="text-white text-base font-semibold">Invest Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default InvestmentDetailsScreen;
