import type React from "react";
import {
  ActivityIndicator,
  Text,
  type TextStyle,
  TouchableOpacity,
  type ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "invisible";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
}) => {
  const getButtonClassName = () => {
    let baseClasses = "justify-center items-center rounded-lg";

    // Size classes
    switch (size) {
      case "small":
        baseClasses += " px-4 py-2 min-h-[36px]";
        break;
      case "large":
        baseClasses += " px-6 py-4 min-h-[52px]";
        break;
      default: // medium
        baseClasses += " px-5 py-3 min-h-[44px]";
        break;
    }

    // Variant classes
    if (disabled) {
      baseClasses += " bg-gray-300";
    } else {
      switch (variant) {
        case "primary":
          baseClasses += " bg-purple-600";
          break;
        case "secondary":
          baseClasses += " bg-gray-100 border border-gray-300";
          break;
        case "tertiary":
          baseClasses += " bg-transparent border border-purple-600";
          break;
        case "invisible":
          baseClasses += " bg-transparent";
          break;
        default:
          baseClasses += " bg-purple-600";
          break;
      }
    }

    return baseClasses;
  };

  const getTextClassName = () => {
    let textClasses = "font-medium text-center";

    // Size classes
    switch (size) {
      case "small":
        textClasses += " text-sm";
        break;
      case "large":
        textClasses += " text-lg";
        break;
      default: // medium
        textClasses += " text-base";
        break;
    }

    // Color classes
    if (disabled) {
      textClasses += " text-gray-500";
    } else {
      switch (variant) {
        case "primary":
          textClasses += " text-white";
          break;
        case "secondary":
          textClasses += " text-gray-900";
          break;
        case "tertiary":
        case "invisible":
          textClasses += " text-purple-600";
          break;
        default:
          textClasses += " text-white";
          break;
      }
    }

    return textClasses;
  };

  return (
    <TouchableOpacity
      className={`${getButtonClassName()} ${fullWidth ? "w-full" : ""}`}
      style={style}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            disabled
              ? "#6B7280"
              : variant === "primary"
                ? "#FFFFFF"
                : variant === "secondary"
                  ? "#111827"
                  : "#8B5CF6"
          }
        />
      ) : (
        <Text className={getTextClassName()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
