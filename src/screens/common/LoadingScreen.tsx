import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { COLORS } from '@/utils/theme';

const LoadingScreen: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text className="mt-4 text-base text-gray-600">Loading...</Text>
    </View>
  );
};



export default LoadingScreen;
