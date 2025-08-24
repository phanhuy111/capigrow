import type React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentProcessingScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">PaymentProcessingScreen</Text>
        <Text className="text-base text-gray-600">Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
};

export default PaymentProcessingScreen;
