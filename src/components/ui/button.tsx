import type React from "react";
import { forwardRef } from "react";
import {
  ActivityIndicator,
  Text,
  type TextStyle,
  TouchableOpacity,
  type ViewStyle,
} from "react-native";

export interface ButtonProps {
  variant?: "default" | "primary" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "large" | "icon";
  title?: string;
  loading?: boolean;
  children?: React.ReactNode;
  textStyle?: TextStyle;
  style?: ViewStyle;
  fullWidth?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

const Button = forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      title,
      loading = false,
      children,
      textStyle,
      style,
      fullWidth = false,
      disabled = false,
      onPress,
      ...props
    },
    ref
  ) => {
    const getButtonClassName = () => {
      const baseClasses = "items-center justify-center rounded-lg";

      const variantClasses = {
        default: "bg-blue-600",
        primary: "bg-blue-600",
        destructive: "bg-red-600",
        outline: "border border-blue-600 bg-transparent",
        secondary: "bg-gray-200",
        ghost: "bg-transparent",
        link: "bg-transparent p-0",
      };

      const sizeClasses = {
        default: "py-4 px-8",
        sm: "py-3 px-6",
        lg: "py-5 px-10",
        large: "py-5 px-10",
        icon: "w-10 h-10 p-0",
      };

      const widthClass = fullWidth ? "w-full" : "";

      return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`.trim();
    };

    const getTextClassName = () => {
      const baseClasses = "text-base font-semibold";

      const variantTextClasses = {
        default: "text-white",
        primary: "text-white",
        destructive: "text-white",
        outline: "text-blue-600",
        secondary: "text-gray-900",
        ghost: "text-blue-600",
        link: "text-blue-600 underline",
      };

      return `${baseClasses} ${variantTextClasses[variant]}`;
    };

    return (
      <TouchableOpacity
        ref={ref}
        className={`${getButtonClassName()} ${disabled ? "opacity-50" : ""}`}
        style={style}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === "outline" || variant === "ghost" ? "#2563eb" : "#ffffff"}
            size="small"
          />
        ) : (
          children || (
            <Text className={getTextClassName()} style={textStyle}>
              {title}
            </Text>
          )
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";

export { Button };
