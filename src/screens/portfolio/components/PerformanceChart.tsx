import type React from "react";
import { Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { Icons } from "@/assets";
import tokens from "@/components/lib/tokens";
import { Card } from "@/components/ui";

interface PerformanceChartProps {
  title?: string;
  height?: number;
  data?: any[]; // Placeholder for chart data
  onPress?: () => void;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title = "Biểu đồ hiệu suất",
  height = 200,
  data = [],
  onPress,
}) => {
  return (
    <Card className="mb-6 p-6 bg-white rounded-2xl shadow-sm">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <View className="w-3 h-3 rounded-full bg-blue-500" />
            <Text className="text-xs text-gray-600">Tổng tài sản</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-3 h-3 rounded-full bg-green-500" />
            <Text className="text-xs text-gray-600">Lợi nhuận</Text>
          </View>
        </View>
      </View>

      {/* Chart Placeholder */}
      <View
        className="bg-gray-50 rounded-xl items-center justify-center border border-dashed border-gray-300"
        style={{ height }}
      >
        <View className="items-center">
          <SvgXml
            xml={Icons.chartSuccess}
            width={48}
            height={48}
            fill={tokens.colors.neutral[400]}
          />
          <Text className="text-sm text-gray-500 mt-2">Biểu đồ hiệu suất</Text>
          <Text className="text-xs text-gray-400 mt-1">Dữ liệu sẽ được hiển thị tại đây</Text>
        </View>
      </View>

      {/* Chart Controls */}
      <View className="flex-row items-center justify-center gap-4 mt-4">
        {["1T", "3T", "6T", "1N", "Tất cả"].map((period, index) => (
          <View
            key={period}
            className={`px-3 py-1 rounded-full ${index === 1 ? "bg-blue-100" : "bg-gray-100"}`}
          >
            <Text
              className={`text-xs font-medium ${index === 1 ? "text-blue-600" : "text-gray-600"}`}
            >
              {period}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

export default PerformanceChart;
