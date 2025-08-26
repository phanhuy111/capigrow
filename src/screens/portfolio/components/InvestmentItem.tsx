import type React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { Icons } from "@/assets";
import tokens from "@/components/lib/tokens";
import { Card } from "@/components/ui";
import { formatPercentageValue } from "@/utils/helpers";

interface InvestmentItemProps {
  id: string;
  title: string;
  imageUrl?: string;
  investedAmount: number;
  currentValue: number;
  returnAmount: number;
  returnPercentage: number;
  status: "active" | "completed" | "pending";
  onPress?: (id: string) => void;
}

const InvestmentItem: React.FC<InvestmentItemProps> = ({
  id,
  title,
  imageUrl,
  investedAmount,
  currentValue,
  returnAmount,
  returnPercentage,
  status,
  onPress,
}) => {
  const formatCurrencyVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const isPositiveReturn = returnAmount >= 0;

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return tokens.colors.success[500];
      case "completed":
        return tokens.colors.neutral[500];
      case "pending":
        return tokens.colors.warning[500];
      default:
        return tokens.colors.neutral[500];
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "completed":
        return "Đã hoàn thành";
      case "pending":
        return "Chờ xử lý";
      default:
        return "Không xác định";
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress?.(id)} activeOpacity={0.7}>
      <Card className="mb-3 p-4 bg-white rounded-xl shadow-sm">
        <View className="flex-row items-center justify-between">
          {/* Left side - Image and Title */}
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center mr-3">
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <SvgXml
                  xml={Icons.buildings}
                  width={24}
                  height={24}
                  fill={tokens.colors.neutral[600]}
                />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={1}>
                {title}
              </Text>
              <View className="flex-row items-center gap-2">
                <View
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getStatusColor() }}
                />
                <Text className="text-xs text-gray-600">{getStatusLabel()}</Text>
              </View>
            </View>
          </View>

          {/* Right side - Financial Info */}
          <View className="items-end">
            <Text className="text-base font-semibold text-gray-900 mb-1">
              {formatCurrencyVND(currentValue)}
            </Text>
            <View className="flex-row items-center gap-1">
              <SvgXml
                xml={isPositiveReturn ? Icons.trendUp : Icons.arrowDown}
                width={12}
                height={12}
                fill={isPositiveReturn ? tokens.colors.success[500] : tokens.colors.error[500]}
              />
              <Text
                className="text-xs font-medium"
                style={{
                  color: isPositiveReturn ? tokens.colors.success[500] : tokens.colors.error[500],
                }}
              >
                {formatCurrencyVND(returnAmount)}
              </Text>
              <Text
                className="text-xs font-medium"
                style={{
                  color: isPositiveReturn ? tokens.colors.success[500] : tokens.colors.error[500],
                }}
              >
                ({formatPercentageValue(returnPercentage)})
              </Text>
            </View>
          </View>
        </View>

        {/* Investment Details */}
        <View className="mt-3 pt-3 border-t border-gray-100">
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-600">Số tiền đầu tư:</Text>
            <Text className="text-xs font-medium text-gray-900">
              {formatCurrencyVND(investedAmount)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default InvestmentItem;
