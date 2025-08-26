import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Icon } from "@/components/common";
import { ReactNode } from "react";

type HeaderSection = {
  component?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

type Props = {
  // New dynamic props
  left?: HeaderSection | HeaderSection[];
  center?: HeaderSection;
  right?: HeaderSection | HeaderSection[];

  // Layout props
  containerClassName?: string;
  leftContainerClassName?: string;
  centerContainerClassName?: string;
  rightContainerClassName?: string;
};

export default function Header({
  left,
  center,
  right,

  containerClassName = "flex-row justify-between items-center px-4",
  leftContainerClassName = "flex-1 flex-row items-center gap-3",
  centerContainerClassName = "flex-2 justify-center items-center",
  rightContainerClassName = "flex-1 flex-row items-center justify-end gap-3",
}: Props) {
  const renderSectionItems = (section: HeaderSection | HeaderSection[] | undefined) => {
    if (!section) return null;

    const items = Array.isArray(section) ? section : [section];

    return items.map((item, index) => {
      if (!item.component) return null;

      if (item.onPress) {
        return (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            disabled={item.disabled}
            className={item.disabled ? "opacity-50" : ""}
          >
            {item.component}
          </TouchableOpacity>
        );
      }

      return <View key={index}>{item.component}</View>;
    });
  };

  const getLegacyLeft = () => {
    if (left !== undefined) return null;
    const legacyItems: ReactNode[] = [];

    return legacyItems;
  };

  const getLegacyRight = () => {
    if (right !== undefined) return null;

    const legacyItems: ReactNode[] = [];

    return legacyItems;
  };

  return (
    <View className={containerClassName}>
      {/* Left Section */}
      <View className={leftContainerClassName}>
        {left ? renderSectionItems(left) : getLegacyLeft()}
      </View>

      {/* Center Section */}
      {center && <View className={centerContainerClassName}>{renderSectionItems(center)}</View>}

      {/* Right Section */}
      <View className={rightContainerClassName}>
        {right ? renderSectionItems(right) : getLegacyRight()}
      </View>
    </View>
  );
}

export const HeaderElements = {
  title: (text: string, className?: string) => (
    <Text className={className || "text-2xl font-bold text-gray-900"}>{text}</Text>
  ),

  subtitle: (text: string, className?: string) => (
    <Text className={className || "text-sm text-gray-600"}>{text}</Text>
  ),

  iconButton: (iconName: string, className?: string) => (
    <View className={className || "w-11 h-11 rounded-full bg-gray-100 justify-center items-center"}>
      <Icon name={iconName} />
    </View>
  ),

  logo: (size: "small" | "medium" | "large" = "medium", className?: string) => {
    const sizeStyles = {
      small: "w-8 h-8",
      medium: "w-12 h-12",
      large: "w-20 h-20",
    };

    return (
      <View className={className}>
        <Image
          source={require("@/assets/common/logo.png")}
          className={sizeStyles[size]}
          resizeMode="contain"
        />
      </View>
    );
  },

  notificationButton: (iconName: string = "bell", count?: number, className?: string) => (
    <View
      className={
        className || "w-11 h-11 rounded-full bg-gray-100 justify-center items-center relative"
      }
    >
      <Icon name={iconName} />
      {count && count > 0 && (
        <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 justify-center items-center">
          <Text className="text-white text-xs font-semibold">{count > 99 ? "99+" : count}</Text>
        </View>
      )}
    </View>
  ),

  textButton: (text: string, className?: string) => (
    <Text className={className || "text-blue-600 font-semibold"}>{text}</Text>
  ),

  backButton: (className?: string) => (
    <View className={className || "w-11 h-11 rounded-full bg-gray-100 justify-center items-center"}>
      <Icon name="arrow-left" />
    </View>
  ),
};
