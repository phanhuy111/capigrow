import type React from "react";
import { Text, View } from "react-native";
import tokens from "@/components/lib/tokens";
import Icon from "./Icon";

interface ValidationMessageProps {
  message?: string;
  type?: "error" | "warning" | "success" | "info";
  visible?: boolean;
  showIcon?: boolean;
  size?: "sm" | "base" | "lg";
  className?: string;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  type = "error",
  visible = true,
  showIcon = true,
  size = "base",
  className = "",
}) => {
  if (!message || !visible) {
    return null;
  }

  const getTypeConfig = () => {
    switch (type) {
      case "success":
        return {
          color: tokens.colors.success[600],
          backgroundColor: tokens.colors.success[50],
          borderColor: tokens.colors.success[200],
          iconName: "success" as const,
        };
      case "warning":
        return {
          color: tokens.colors.warning[700],
          backgroundColor: tokens.colors.warning[50],
          borderColor: tokens.colors.warning[200],
          iconName: "warning" as const,
        };
      case "info":
        return {
          color: tokens.colors.primary[700],
          backgroundColor: tokens.colors.primary[50],
          borderColor: tokens.colors.primary[200],
          iconName: "info" as const,
        };
      default: // error
        return {
          color: tokens.colors.error[700],
          backgroundColor: tokens.colors.error[50],
          borderColor: tokens.colors.error[200],
          iconName: "error" as const,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          fontSize: tokens.typography.fontSize.xs,
          iconSize: 14,
          padding: tokens.spacing[2],
          gap: tokens.spacing[1],
        };
      case "lg":
        return {
          fontSize: tokens.typography.fontSize.base,
          iconSize: 18,
          padding: tokens.spacing[4],
          gap: tokens.spacing[3],
        };
      default:
        return {
          fontSize: tokens.typography.fontSize.sm,
          iconSize: 16,
          padding: tokens.spacing[3],
          gap: tokens.spacing[2],
        };
    }
  };

  const typeConfig = getTypeConfig();
  const sizeStyles = getSizeStyles();

  return (
    <View
      className={className}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: sizeStyles.gap,
        backgroundColor: typeConfig.backgroundColor,
        borderWidth: 1,
        borderColor: typeConfig.borderColor,
        borderRadius: tokens.borderRadius.base,
        padding: sizeStyles.padding,
      }}
    >
      {showIcon && (
        <Icon name={typeConfig.iconName} size={sizeStyles.iconSize} color={typeConfig.color} />
      )}
      <Text
        style={{
          fontSize: sizeStyles.fontSize,
          fontWeight: tokens.typography.fontWeight.medium as "500",
          color: typeConfig.color,
          flex: 1,
          lineHeight: sizeStyles.fontSize * 1.4,
        }}
      >
        {message}
      </Text>
    </View>
  );
};

export default ValidationMessage;
