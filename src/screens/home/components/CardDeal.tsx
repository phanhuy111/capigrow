import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { Icons } from "@/assets";
export interface CardDealProps {
  title: string;
  category: string;
  imageUrl?: string;
  raisedAmount: number;
  targetAmount: number;
  expectedReturn: number;
  progress: number;
  daysLeft: number;
  minInvestment: number;
  onPress: () => void;
}

const CardDeal: React.FC<CardDealProps> = ({
  title,
  category,
  imageUrl,
  raisedAmount,
  targetAmount,
  expectedReturn,
  daysLeft,
  minInvestment,
  progress,
  onPress,
}) => {
  const formatAmount = (amount: number): string => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} tỷ`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} tr`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k`;
    }
    return amount.toString();
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Info Section */}
      <View className="flex-row items-center gap-4">
        <View className="w-16 h-16 rounded-full overflow-hidden">
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-gray-200" />
          )}
        </View>

        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold leading-6 text-gray-900" numberOfLines={2}>
            {title}
          </Text>
          <View className="flex-row items-center flex-wrap gap-2">
            <View className="bg-blue-50 px-2 py-0.5 rounded">
              <Text className="text-xs font-semibold leading-4 text-gray-900">{category}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-200 my-6 border-dashed" />

      {/* Process Section */}
      <View className="gap-4">
        <View className="gap-3">
          <View className="flex-row justify-between gap-2">
            {/* Raised Amount */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <SvgXml xml={Icons.cup} width={16} height={16} color="#616162" />
                <Text className="text-xs font-semibold leading-4 text-gray-500">Đã gọi vốn</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-sm font-semibold leading-5 text-gray-900">
                  {formatAmount(raisedAmount)}
                </Text>
                <Text className="text-sm font-normal leading-5 text-gray-500">
                  /{formatAmount(targetAmount)}
                </Text>
              </View>
            </View>

            {/* Expected Return */}
            <View className="items-end gap-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-xs font-semibold leading-4 text-gray-500">
                  Thu nhập kỳ vọng
                </Text>
                <SvgXml xml={Icons.trendUp} width={16} height={16} color="#616162" />
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-sm font-semibold leading-5 text-green-600">
                  {expectedReturn}%
                </Text>
                <Text className="text-sm font-semibold leading-5 text-green-600">/ tháng</Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="pr-31">
            <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
            </View>
          </View>
        </View>

        {/* Bottom Info */}
        <View className="flex-row justify-between items-center gap-2">
          <Text className="text-sm font-normal leading-5 text-gray-500">Còn {daysLeft} ngày</Text>
          <Text className="text-sm font-normal leading-5 text-gray-500">
            Đầu tư từ {formatAmount(minInvestment)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardDeal;
