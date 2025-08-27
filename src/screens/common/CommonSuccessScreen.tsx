import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "../../components/common/Icon";
import Screen from "../../components/common/Screen";
import { Icons } from "../../assets";
import { theme } from "../../lib/theme";

// Types
interface CommonSuccessScreenParams {
  title: string;
  description: string;
  buttonText: string;
  onButtonPress?: () => void;
  navigateToScreen?: string;
  navigateParams?: any;
}

type CommonSuccessScreenRouteProp = RouteProp<
  { CommonSuccessScreen: CommonSuccessScreenParams },
  "CommonSuccessScreen"
>;

type CommonSuccessScreenNavigationProp = StackNavigationProp<any>;

const CommonSuccessScreen: React.FC = () => {
  const navigation = useNavigation<CommonSuccessScreenNavigationProp>();
  const route = useRoute<CommonSuccessScreenRouteProp>();

  const { title, description, buttonText, onButtonPress, navigateToScreen, navigateParams } =
    route.params;

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    } else if (navigateToScreen) {
      navigation.navigate(navigateToScreen, navigateParams);
    } else {
      navigation.goBack();
    }
  };

  return (
    <Screen className="bg-white">
      <SafeAreaView className="flex-1">
        {/* Status Bar */}
        <View className="h-14 flex-row justify-between items-center px-4">
          <View className="flex-1">
            <Text className="text-center text-base font-semibold text-black">9:41</Text>
          </View>
          <View className="flex-row items-center gap-2">
            {/* Cellular */}
            <View className="w-5 h-3 flex-row items-end gap-0.5">
              <View className="w-1 h-1 bg-black rounded-sm" />
              <View className="w-1 h-2 bg-black rounded-sm" />
              <View className="w-1 h-3 bg-black rounded-sm" />
              <View className="w-1 h-3 bg-black rounded-sm" />
            </View>
            {/* WiFi */}
            <Icon
              name="wifi"
              size={17}
              color="black"
            />
            {/* Battery */}
            <View className="w-7 h-3 border border-black border-opacity-35 rounded-sm relative">
              <View className="absolute right-0 top-1 w-0.5 h-1 bg-black bg-opacity-40 rounded-r-sm" />
              <View className="absolute left-0.5 top-0.5 w-5 h-2 bg-black rounded-sm" />
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View className="flex-1 px-6 py-6">
          {/* Success Stage */}
          <View className="flex-1 justify-center items-center">
            {/* Background Circle */}
            <View className="w-72 h-72 rounded-full justify-center items-center relative">
              {/* Gradient background effect */}
              <View className="absolute inset-0 rounded-full bg-green-100 opacity-20" />

              {/* Success Icon Container */}
              <View className="w-12 h-12 bg-green-500 rounded-2xl justify-center items-center">
                <Icon name="shieldTick" size={24} color="white" />
              </View>
            </View>

            {/* Title and Description */}
            <View className="items-center gap-4 mt-8">
              <Text className="text-2xl font-semibold text-gray-900 text-center">{title}</Text>
              <Text className="text-base text-gray-600 text-center leading-6">{description}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Button */}
        <View className="px-4 pb-8 border-t border-gray-200">
          <View className="py-2">
            <TouchableOpacity
              className="bg-purple-600 rounded-full py-3 px-6 justify-center items-center"
              onPress={handleButtonPress}
            >
              <Text className="text-white text-base font-semibold">{buttonText}</Text>
            </TouchableOpacity>
          </View>

          {/* Home Indicator */}
          <View className="items-center pt-2">
            <View className="w-35 h-1 bg-black rounded-full" />
          </View>
        </View>
      </SafeAreaView>
    </Screen>
  );
};

export default CommonSuccessScreen;
export type { CommonSuccessScreenParams };
