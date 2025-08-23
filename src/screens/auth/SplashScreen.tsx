import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import CapiGrowLogo from '@/components/common/CapiGrowLogo';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-8">
        {/* Background decoration */}
        <View className="absolute w-full h-full">
          {/* Floating money/document icons matching Figma design */}
          <Text className="absolute text-2xl opacity-60" style={{ top: '15%', left: '10%', fontSize: 20, transform: [{ rotate: '-15deg' }] }}>💰</Text>
          <Text className="absolute text-lg opacity-60" style={{ top: '20%', right: '15%', fontSize: 18, transform: [{ rotate: '25deg' }] }}>📄</Text>
          <Text className="absolute text-xl opacity-60" style={{ top: '30%', left: '5%', fontSize: 22, transform: [{ rotate: '10deg' }] }}>💳</Text>
          <Text className="absolute text-2xl opacity-60" style={{ top: '40%', right: '10%', fontSize: 20, transform: [{ rotate: '-20deg' }] }}>📊</Text>
          <Text className="absolute text-lg opacity-60" style={{ bottom: '35%', left: '15%', fontSize: 18, transform: [{ rotate: '30deg' }] }}>💵</Text>
          <Text className="absolute text-xl opacity-60" style={{ bottom: '30%', right: '20%', fontSize: 22, transform: [{ rotate: '-10deg' }] }}>📈</Text>
          <Text className="absolute text-2xl opacity-60" style={{ bottom: '45%', left: '8%', fontSize: 20, transform: [{ rotate: '15deg' }] }}>🏦</Text>
          <Text className="absolute text-2xl opacity-60" style={{ bottom: '40%', right: '12%', fontSize: 24, transform: [{ rotate: '-25deg' }] }}>💎</Text>
        </View>

        {/* Logo and Brand */}
        <View className="items-center mb-16">
          <CapiGrowLogo size="large" color="#8B5CF6" />
          <Text className="text-base text-gray-600 text-center mt-6">Tìm kiếm doanh nghiệp tiềm năng{'\n'}và gia tăng tài sản của bạn</Text>
        </View>

        {/* Loading indicator */}
        <View className="absolute bottom-16 w-3/5">
          <View className="h-1 bg-gray-200 rounded-sm overflow-hidden">
            <View className="h-full w-3/4 bg-purple-600 rounded-sm" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};



export default SplashScreen;
