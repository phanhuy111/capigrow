import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import {
  type NativeSyntheticEvent,
  Text,
  TextInput,
  type TextInputFocusEventData,
  TouchableOpacity,
  View,
} from "react-native";
import tokens from "@/components/lib/tokens";
import { cn } from "@/lib/utils";
import { INPUT_STYLES } from "@/utils/theme";

const inputVariants = cva("flex w-full rounded-lg border", {
  variants: {
    variant: {
      normal: "border-gray-300 bg-white",
      selected: "border-blue-500 border-2 bg-white",
      error: "border-red-500 bg-white",
      disabled: "border-gray-200 bg-gray-100",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      base: "h-10 px-3 text-base",
      lg: "h-12 px-4 text-base",
    },
    inputted: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    variant: "normal",
    size: "base",
    inputted: false,
  },
});

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  // Figma-specific props
  type?: "normal" | "selected";
  inputted?: boolean;
  state?: "enable" | "disable";
  title?: string;
  message?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    {
      className,
      variant,
      size = "base",
      label,
      error,
      containerClassName,
      labelClassName,
      errorClassName,
      leftIcon,
      rightIcon,
      onRightIconPress,
      editable = true,
      type = "normal",
      inputted = false,
      state = "enable",
      title,
      message,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(inputted);

    // Determine variant based on Figma design states
    const getVariant = () => {
      if (error) return "error";
      if (state === "disable") return "disabled";
      if (type === "selected" || isFocused) return "selected";
      return "normal";
    };

    const currentVariant = getVariant();

    // Get styles from design tokens
    const getInputStyles = () => {
      const baseStyles = INPUT_STYLES.states.default;

      // Map component sizes to theme sizes
      const sizeMap = {
        sm: "small",
        base: "medium",
        lg: "large",
      } as const;

      const themeSizeKey = sizeMap[size || "base"];
      const sizeStyles = INPUT_STYLES.sizes[themeSizeKey];

      const stateKey =
        currentVariant === "selected"
          ? "focused"
          : currentVariant === "error"
            ? "error"
            : currentVariant === "disabled"
              ? "disabled"
              : "default";
      const stateStyles = INPUT_STYLES.states[stateKey];

      return {
        ...baseStyles,
        ...sizeStyles,
        ...stateStyles,
      };
    };

    const inputStyles = getInputStyles();

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChangeText = (text: string) => {
      setHasValue(text.length > 0);
      props.onChangeText?.(text);
    };

    return (
      <View className={cn("w-full", containerClassName)}>
        {(label || title) && (
          <Text className={cn("text-sm font-medium text-gray-700 mb-2", labelClassName)}>
            {title || label}
          </Text>
        )}
        <View className="relative">
          {leftIcon && (
            <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">{leftIcon}</View>
          )}
          <TextInput
            className={cn(
              inputVariants({
                variant: currentVariant,
                size,
                inputted: hasValue,
                className,
              }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              state === "disable" && "opacity-50"
            )}
            style={[
              inputStyles,
              ...(leftIcon ? [{ paddingLeft: 40 }] : []),
              ...(rightIcon ? [{ paddingRight: 40 }] : []),
            ]}
            ref={ref}
            editable={state !== "disable"}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            placeholderTextColor={tokens.colors.text.secondary}
            {...props}
          />
          {rightIcon && (
            <TouchableOpacity
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
              onPress={onRightIconPress}
              disabled={!onRightIconPress || state === "disable"}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
        {(error || message) && (
          <Text
            className={cn("text-xs mt-1", error ? "text-red-500" : "text-gray-500", errorClassName)}
          >
            {error || message}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
