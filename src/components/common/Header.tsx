import type React from "react";
import { Platform, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tokens from "@/components/lib/tokens";
import { TYPOGRAPHY } from "@/utils/theme";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  variant?: "default" | "transparent" | "minimal";
  centerTitle?: boolean;
  // Figma-specific props
  type?: "default" | "back" | "close";
  hasStatusBar?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightComponent,
  leftComponent,
  backgroundColor = tokens.colors.background.primary,
  titleColor = tokens.colors.text.primary,
  variant = "default",
  centerTitle = true,
  type = "default",
  hasStatusBar = true,
}) => {
  const insets = useSafeAreaInsets();

  const getHeaderHeight = () => {
    const baseHeight = 56;
    return baseHeight + (hasStatusBar ? insets.top : 0);
  };

  const getBackIcon = () => {
    // Default back arrow icon - you can replace with your icon component
    return <Text style={{ fontSize: 20, color: titleColor }}>←</Text>;
  };

  const getCloseIcon = () => {
    // Default close icon - you can replace with your icon component
    return <Text style={{ fontSize: 20, color: titleColor }}>×</Text>;
  };

  const renderLeftComponent = () => {
    if (leftComponent) {
      return leftComponent;
    }

    if (showBackButton || type === "back" || type === "close") {
      return (
        <TouchableOpacity
          onPress={onBackPress}
          style={{
            padding: tokens.spacing[2],
            marginLeft: tokens.spacing[2],
            borderRadius: tokens.borderRadius.md,
          }}
          activeOpacity={0.7}
        >
          {type === "close" ? getCloseIcon() : getBackIcon()}
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderTitle = () => {
    if (!title) return null;

    return (
      <View
        style={{
          flex: centerTitle ? 1 : 0,
          alignItems: centerTitle ? "center" : "flex-start",
          justifyContent: "center",
          paddingHorizontal: tokens.spacing[2],
        }}
      >
        <Text
          style={{
            ...TYPOGRAPHY.h6,
            color: titleColor,
            fontWeight: "600",
            fontSize: tokens.typography.fontSize.lg,
            textAlign: centerTitle ? "center" : "left",
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              ...TYPOGRAPHY.caption,
              color: tokens.colors.text.secondary,
              fontSize: tokens.typography.fontSize.sm,
              textAlign: centerTitle ? "center" : "left",
              marginTop: 2,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subtitle}
          </Text>
        )}
      </View>
    );
  };

  const renderRightComponent = () => {
    if (rightComponent) {
      return (
        <View
          style={{
            paddingRight: tokens.spacing[3],
          }}
        >
          {rightComponent}
        </View>
      );
    }
    return null;
  };

  const getHeaderStyle = () => {
    const baseStyle = {
      height: getHeaderHeight(),
      backgroundColor,
      paddingTop: hasStatusBar ? insets.top : 0,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      paddingHorizontal: tokens.spacing[1],
    };

    switch (variant) {
      case "transparent":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      case "minimal":
        return {
          ...baseStyle,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        };
      default:
        return {
          ...baseStyle,
          borderBottomWidth: 1,
          borderBottomColor: tokens.colors.border.primary,
          elevation: Platform.OS === "android" ? 4 : 0,
          shadowColor: tokens.shadows.base.shadowColor,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        };
    }
  };

  return (
    <>
      {hasStatusBar && (
        <StatusBar
          backgroundColor={variant === "transparent" ? "transparent" : backgroundColor}
          barStyle={variant === "transparent" ? "light-content" : "dark-content"}
          translucent={variant === "transparent"}
        />
      )}
      <View style={getHeaderStyle()}>
        {renderLeftComponent()}
        {renderTitle()}
        {renderRightComponent()}
      </View>
    </>
  );
};

export default Header;
