import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-between">
        <View className="items-center mt-6">
          <Text className="text-3xl font-bold text-purple-600">Capigrow</Text>
          <Text className="text-sm text-gray-600 mt-1">Grow Your Capital Wisely</Text>
        </View>

        <View className="flex-1 justify-center items-center">
          <View className="w-48 h-48 bg-gray-100 rounded-2xl justify-center items-center">
            <Text className="text-7xl">📈</Text>
          </View>
        </View>

        <View className="items-center mb-6">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome to Capigrow</Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            Start your investment journey with smart, secure, and profitable opportunities
          </Text>
        </View>

        <View className="mb-6">
          <TouchableOpacity
            className="bg-purple-600 py-4 rounded-lg items-center mb-4"
            onPress={() => navigation.navigate('Register')}
          >
            <Text className="text-white text-base font-semibold">Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4 items-center"
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-purple-600 text-base font-medium">I already have an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};



export default WelcomeScreen;
