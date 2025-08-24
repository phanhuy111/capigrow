import type React from "react";
import { Text, View } from "react-native";
import tokens from "@/components/lib/tokens";
import Icon from "./Icon";

interface FormErrorProps {
  message?: string;
  visible?: boolean;
  icon?: boolean;
  variant?: "default" | "inline" | "tooltip";
  size?: "sm" | "base" | "lg";
  className?: string;
}

const FormError: React.FC<FormErrorProps> = ({
  message,
  visible = true,
  icon = true,
  variant = "default",
  size = "base",
  className = "",
}) => {
  if (!message || !visible) {
    return null;
  }

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          fontSize: tokens.typography.fontSize.xs,
          iconSize: 14,
          padding: tokens.spacing[1],
        };
      case "lg":
        return {
          fontSize: tokens.typography.fontSize.base,
          iconSize: 18,
          padding: tokens.spacing[3],
        };
      default:
        return {
          fontSize: tokens.typography.fontSize.sm,
          iconSize: 16,
          padding: tokens.spacing[2],
        };
    }
  };

  const getVariantStyles = () => {
    const baseStyles = {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: tokens.spacing[2],
    };

    switch (variant) {
      case "inline":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          paddingHorizontal: 0,
          paddingVertical: tokens.spacing[1],
        };
      case "tooltip":
        return {
          ...baseStyles,
          backgroundColor: tokens.colors.error[500],
          paddingHorizontal: tokens.spacing[3],
          paddingVertical: tokens.spacing[2],
          borderRadius: tokens.borderRadius.md,
          shadowColor: tokens.shadows.sm.shadowColor,
          shadowOffset: tokens.shadows.sm.shadowOffset,
          shadowOpacity: tokens.shadows.sm.shadowOpacity,
          shadowRadius: tokens.shadows.sm.shadowRadius,
          elevation: tokens.shadows.sm.elevation,
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: tokens.colors.error[50],
          paddingHorizontal: tokens.spacing[3],
          paddingVertical: tokens.spacing[2],
          borderRadius: tokens.borderRadius.base,
          borderWidth: 1,
          borderColor: tokens.colors.error[200],
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "tooltip":
        return tokens.colors.neutral[0];
      default:
        return tokens.colors.error[700];
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "tooltip":
        return tokens.colors.neutral[0];
      default:
        return tokens.colors.error[500];
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <View style={[variantStyles, { padding: sizeStyles.padding }]} className={className}>
      {icon && <Icon name="error" size={sizeStyles.iconSize} color={getIconColor()} />}
      <Text
        style={{
          fontSize: sizeStyles.fontSize,
          fontWeight: tokens.typography.fontWeight.medium as "500",
          color: getTextColor(),
          flex: 1,
        }}
      >
        {message}
      </Text>
    </View>
  );
};

export default FormError;
