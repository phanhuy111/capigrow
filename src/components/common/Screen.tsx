import type React from "react";
import type { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: React.ReactNode;
  paddingHorizontal?: boolean;
  style?: ViewStyle;
  className?: string;
}

const Screen: React.FC<ScreenProps> = ({
  children,
  paddingHorizontal = false,
  style,
  className,
}) => {
  const baseClasses = "flex-1 bg-white gap-2";
  const paddingClasses = paddingHorizontal ? "" : "";
  const combinedClasses = `${baseClasses}${paddingClasses} ${className || ""}`;

  return (
    <SafeAreaView className={combinedClasses} style={style}>
      {children}
    </SafeAreaView>
  );
};

export default Screen;
