import type React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import tokens from "@/components/lib/tokens";
import { BUTTON_STYLES, TYPOGRAPHY } from "@/utils/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "tertiary" | "invisible";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  // Figma-specific props
  state?: "enable" | "disable" | "hover";
  type?: "primary" | "secondary" | "tertiary";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  onPress,
  style,
  state = "enable",
  type,
  icon,
  iconPosition = "left",
  ...props
}) => {
  // Use type prop if provided, otherwise fall back to variant
  const buttonVariant = type || variant;

  // Determine button state
  const buttonState =
    disabled || state === "disable" ? "disabled" : state === "hover" ? "hover" : "enabled";
  const buttonStyle = {
    ...BUTTON_STYLES[buttonVariant][buttonState],
    ...BUTTON_STYLES.sizes[size],
  };

  const textStyle = {
    ...TYPOGRAPHY[
      `button${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof TYPOGRAPHY
    ],
    color: getTextColor(),
  };

  function getTextColor() {
    if (buttonState === "disabled") {
      return tokens.colors.text.disabled;
    }

    switch (buttonVariant) {
      case "primary":
        return tokens.colors.text.inverse;
      case "secondary":
        return tokens.colors.primary[600];
      case "tertiary":
        return tokens.colors.primary[600];
      case "invisible":
        return tokens.colors.text.primary;
      default:
        return tokens.colors.text.primary;
    }
  }

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      onPress={onPress}
      disabled={disabled || loading || state === "disable"}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Text style={[textStyle, { marginRight: tokens.spacing[2] }]}>{icon}</Text>
          )}
          <Text style={textStyle}>{title}</Text>
          {icon && iconPosition === "right" && (
            <Text style={[textStyle, { marginLeft: tokens.spacing[2] }]}>{icon}</Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
