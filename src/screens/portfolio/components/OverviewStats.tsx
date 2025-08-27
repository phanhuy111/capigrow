import type React from "react";
import { Text, View } from "react-native";
import { Icons } from "@/assets";
import Icon from "@/components/common/Icon";
import tokens from "@/components/lib/tokens";
import { Card } from "@/components/ui";

interface StatItem {
  label: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: string;
  iconColor: string;
  backgroundColor: string;
}

interface OverviewStatsProps {
  stats: StatItem[];
}

const OverviewStats: React.FC<OverviewStatsProps> = ({ stats }) => {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-4">Tổng quan</Text>
      <View className="flex-row flex-wrap gap-3">
        {stats.map((stat, index) => (
          <Card key={index} className="flex-1 min-w-[160px] p-4 bg-white rounded-xl shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: stat.backgroundColor }}
              >
                <Icon name={stat.icon} size={20} color={stat.iconColor} />
              </View>
              {stat.change && (
                <View className="flex-row items-center gap-1">
                  <Icon
                    name={stat.change.isPositive ? "trendUp" : "arrowDown"}
                    size={12}
                    color={
                      stat.change.isPositive ? tokens.colors.success[500] : tokens.colors.error[500]
                    }
                  />
                  <Text
                    className="text-xs font-medium"
                    style={{
                      color: stat.change.isPositive
                        ? tokens.colors.success[500]
                        : tokens.colors.error[500],
                    }}
                  >
                    {stat.change.value}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-xs text-gray-600 mb-1">{stat.label}</Text>
            <Text className="text-base font-semibold text-gray-900">{stat.value}</Text>
          </Card>
        ))}
      </View>
    </View>
  );
};

export default OverviewStats;
