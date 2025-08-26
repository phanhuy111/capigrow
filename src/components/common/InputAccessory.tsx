import type React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tokens from "@/components/lib/tokens";
import Icon from "./Icon";

interface InputAccessoryAction {
  id: string;
  label: string;
  icon?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "destructive";
  disabled?: boolean;
}

interface InputAccessoryProps {
  actions?: InputAccessoryAction[];
  showDone?: boolean;
  onDone?: () => void;
  doneLabel?: string;
  variant?: "default" | "minimal";
  backgroundColor?: string;
}

const InputAccessory: React.FC<InputAccessoryProps> = ({
  actions = [],
  showDone = true,
  onDone,
  doneLabel = "Done",
  variant = "default",
  backgroundColor,
}) => {
  const insets = useSafeAreaInsets();

  const getActionButtonStyle = (actionVariant: string = "secondary", disabled: boolean = false) => {
    const baseStyle = {
      paddingHorizontal: tokens.spacing[3],
      paddingVertical: tokens.spacing[2],
      borderRadius: tokens.borderRadius.md,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: tokens.spacing[1],
      opacity: disabled ? 0.5 : 1,
    };

    switch (actionVariant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: tokens.colors.primary[500],
        };
      case "destructive":
        return {
          ...baseStyle,
          backgroundColor: tokens.colors.error[50],
          borderWidth: 1,
          borderColor: tokens.colors.error[200],
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: tokens.colors.neutral[100],
          borderWidth: 1,
          borderColor: tokens.colors.neutral[200],
        };
    }
  };

  const getActionTextStyle = (actionVariant: string = "secondary") => {
    const baseStyle = {
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: tokens.typography.fontWeight.medium as "500",
      lineHeight: tokens.typography.lineHeight.normal,
    };

    switch (actionVariant) {
      case "primary":
        return {
          ...baseStyle,
          color: tokens.colors.neutral[0],
        };
      case "destructive":
        return {
          ...baseStyle,
          color: tokens.colors.error[600],
        };
      default:
        return {
          ...baseStyle,
          color: tokens.colors.text.primary,
        };
    }
  };

  const containerStyle = {
    backgroundColor: backgroundColor || tokens.colors.background.primary,
    borderTopWidth: variant === "default" ? 1 : 0,
    borderTopColor: tokens.colors.border.primary,
    paddingHorizontal: tokens.spacing[4],
    paddingTop: tokens.spacing[3],
    paddingBottom: tokens.spacing[3] + insets.bottom,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    shadowColor: tokens.colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  };

  const doneButtonStyle = {
    paddingHorizontal: tokens.spacing[4],
    paddingVertical: tokens.spacing[2],
    backgroundColor: tokens.colors.primary[500],
    borderRadius: tokens.borderRadius.md,
  };

  const doneTextStyle = {
    color: tokens.colors.neutral[0],
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.semibold as "600",
    lineHeight: tokens.typography.lineHeight.normal,
  };

  return (
    <View style={containerStyle}>
      {/* Left side actions */}
      <View style={{ flexDirection: "row", gap: tokens.spacing[2] }}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={getActionButtonStyle(action.variant, action.disabled)}
            onPress={action.onPress}
            disabled={action.disabled}
            activeOpacity={0.7}
          >
            {action.icon && (
              <Icon name={action.icon} size={16} color={getActionTextStyle(action.variant).color} />
            )}
            <Text style={getActionTextStyle(action.variant)}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Right side done button */}
      {showDone && (
        <TouchableOpacity style={doneButtonStyle} onPress={onDone} activeOpacity={0.8}>
          <Text style={doneTextStyle}>{doneLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputAccessory;
