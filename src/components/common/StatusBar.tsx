import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import type React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface StatusBarProps {
  backgroundColor?: string;
  barStyle?: "default" | "light-content" | "dark-content";
  showTime?: boolean;
  showBattery?: boolean;
  showSignal?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({
  backgroundColor = "#ffffff",
  barStyle = "dark-content",
  showTime = true,
  showBattery = true,
  showSignal = true,
}) => {
  const insets = useSafeAreaInsets();

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <>
      <ExpoStatusBar style={barStyle === "dark-content" ? "dark" : "light"} />
      <View className="px-6 pb-2" style={{ backgroundColor, paddingTop: insets.top }}>
        <View className="flex-row justify-between items-center h-5">
          {/* Left side - Time */}
          {showTime && (
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900">{getCurrentTime()}</Text>
            </View>
          )}

          {/* Right side - Signal, WiFi, Battery */}
          {(showSignal || showBattery) && (
            <View className="flex-row items-center gap-3">
              {showSignal && (
                <View className="flex-row items-end gap-0.5">
                  {/* Signal bars */}
                  <View className="bg-gray-900 w-0.5 h-1 rounded-sm" />
                  <View className="bg-gray-900 w-0.5 h-1.5 rounded-sm" />
                  <View className="bg-gray-900 w-0.5 h-2 rounded-sm" />
                  <View className="bg-gray-900 w-0.5 h-2.5 rounded-sm" />
                </View>
              )}

              {showSignal && (
                <View className="w-4 h-3 justify-center items-center">
                  {/* WiFi icon representation */}
                  <View className="w-3 h-2 border-2 border-gray-900 rounded-lg border-b-0" />
                </View>
              )}

              {showBattery && (
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs font-medium text-gray-900">100%</Text>
                  <View className="w-6 h-3 border border-gray-900 rounded-sm p-0.5 relative">
                    <View className="flex-1 bg-green-500 rounded-sm" />
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default StatusBar;
