import type React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import tokens from "@/components/lib/tokens";

const LoadingScreen: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color={tokens.colors.primary[500]} />
      <Text className="mt-4 text-base text-gray-600">Loading...</Text>
    </View>
  );
};

export default LoadingScreen;
