import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "@/types";
import { COLORS } from "@/utils/theme";
import { useInvestmentClientStore } from "@/store/investmentClientStore";
import { formatCurrency, formatPercentage } from "@/utils/helpers";

const InvestmentReviewScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          InvestmentReviewScreen
        </Text>
        <Text className="text-base text-gray-600">Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
};

export default InvestmentReviewScreen;
