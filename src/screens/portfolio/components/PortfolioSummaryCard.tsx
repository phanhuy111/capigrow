import type React from "react";
import { Text, View } from "react-native";
import { Icons } from "@/assets";
import Icon from "@/components/common/Icon";
import tokens from "@/components/lib/tokens";
import { Button, Card } from "@/components/ui";
import { formatPercentageValue } from "@/utils/helpers";

interface PortfolioSummaryCardProps {
  totalValue: number;
  availableBalance: number;
  totalReturn: number;
  totalReturnPercentage: number;
  onWithdraw?: () => void;
  onInfoPress?: () => void;
}

const PortfolioSummaryCard: React.FC<PortfolioSummaryCardProps> = ({
  totalValue,
  availableBalance,
  totalReturn,
  totalReturnPercentage,
  onWithdraw,
  onInfoPress,
}) => {
  const formatCurrencyVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const isPositiveReturn = totalReturn >= 0;

  return (
    <Card className="mb-6 p-6 bg-white rounded-2xl shadow-sm">
      {/* Header with Total Portfolio Value */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center">
            <Icon
              name="emptyWallet"
              size={24}
              color={tokens.colors.primary[500]}
            />
          </View>
          <View>
            <Text className="text-sm text-gray-600 mb-1">Tổng tài sản hiện có</Text>
            <Text className="text-2xl font-bold text-gray-900">
              {formatCurrencyVND(totalValue)}
            </Text>
          </View>
        </View>
        <Button variant="ghost" size="icon" style={{ width: 32, height: 32 }} onPress={onInfoPress}>
          <Icon
            name="infoCircle"
            size={20}
            color={tokens.colors.text.secondary}
          />
        </Button>
      </View>

      {/* Return Information */}
      <View className="flex-row items-center justify-center gap-2 mb-6">
        <Icon
          name="trendUp"
          size={16}
          color={isPositiveReturn ? tokens.colors.success[500] : tokens.colors.error[500]}
        />
        <Text
          className="text-base font-semibold"
          style={{
            color: isPositiveReturn ? tokens.colors.success[500] : tokens.colors.error[500],
          }}
        >
          {formatCurrencyVND(totalReturn)}
        </Text>
        <Text
          className="text-sm font-medium"
          style={{
            color: isPositiveReturn ? tokens.colors.success[500] : tokens.colors.error[500],
          }}
        >
          ({formatPercentageValue(totalReturnPercentage)})
        </Text>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-200 mb-6" />

      {/* Available Balance Section */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center">
            <Icon
              name="moneyReceive"
              size={20}
              color={tokens.colors.success[500]}
            />
          </View>
          <View>
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-sm text-gray-600">Số dư khả dụng</Text>
              <Button
                variant="ghost"
                size="icon"
                style={{ width: 20, height: 20 }}
                onPress={onInfoPress}
              >
                <Icon
                  name="infoCircle"
                  size={16}
                  color={tokens.colors.text.secondary}
                />
              </Button>
            </View>
            <Text className="text-lg font-semibold text-gray-900">
              {formatCurrencyVND(availableBalance)}
            </Text>
          </View>
        </View>
        <Button
          variant="default"
          size="sm"
          style={{
            paddingHorizontal: 24,
            paddingVertical: 8,
            borderRadius: 24,
          }}
          onPress={onWithdraw}
        >
          <Text className="text-white text-sm font-medium">Rút tiền</Text>
        </Button>
      </View>
    </Card>
  );
};

export default PortfolioSummaryCard;
