import type React from "react";
import { Text, View } from "react-native";

interface CapiGrowLogoProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

const CapiGrowLogo: React.FC<CapiGrowLogoProps> = ({ size = "medium", color = "#ffffff" }) => {
  const logoSize = {
    small: { icon: 24, text: 16 },
    medium: { icon: 40, text: 24 },
    large: { icon: 60, text: 32 },
  };

  const currentSize = logoSize[size];

  return (
    <View className="items-center justify-center">
      {/* Simple geometric logo icon */}
      <View
        className="rounded-lg mb-3 justify-center items-center transform rotate-45"
        style={{
          width: currentSize.icon,
          height: currentSize.icon,
          backgroundColor: color,
        }}
      >
        <View
          className="w-3/5 h-3/5 rounded transform -rotate-45"
          style={{ backgroundColor: color }}
        />
      </View>

      <Text
        className="font-bold text-center tracking-widest"
        style={{
          fontSize: currentSize.text,
          color: color,
        }}
      >
        CAPIGROW
      </Text>
    </View>
  );
};

export default CapiGrowLogo;
