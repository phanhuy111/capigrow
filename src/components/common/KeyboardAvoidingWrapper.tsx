import type React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tokens from "@/components/lib/tokens";

interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
  variant?: "scroll" | "view" | "flex";
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  keyboardVerticalOffset?: number;
  enableOnAndroid?: boolean;
  showsVerticalScrollIndicator?: boolean;
}

const KeyboardAvoidingWrapper: React.FC<KeyboardAvoidingWrapperProps> = ({
  children,
  variant = "scroll",
  style,
  contentContainerStyle,
  keyboardVerticalOffset,
  enableOnAndroid = false,
  showsVerticalScrollIndicator = false,
}) => {
  const insets = useSafeAreaInsets();

  const defaultOffset = Platform.OS === "ios" ? insets.top : 0;
  const offset = keyboardVerticalOffset ?? defaultOffset;

  const behavior = Platform.OS === "ios" ? "padding" : enableOnAndroid ? "height" : undefined;

  const baseStyle: ViewStyle = {
    flex: 1,
    backgroundColor: tokens.colors.background.primary,
  };

  const defaultContentStyle: ViewStyle = {
    flexGrow: 1,
    paddingHorizontal: tokens.spacing[4],
  };

  if (variant === "scroll") {
    return (
      <KeyboardAvoidingView
        style={[baseStyle, style]}
        behavior={behavior}
        keyboardVerticalOffset={offset}
      >
        <ScrollView
          contentContainerStyle={[defaultContentStyle, contentContainerStyle]}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (variant === "flex") {
    return (
      <KeyboardAvoidingView
        style={[baseStyle, style]}
        behavior={behavior}
        keyboardVerticalOffset={offset}
      >
        <View style={[{ flex: 1 }, contentContainerStyle]}>{children}</View>
      </KeyboardAvoidingView>
    );
  }

  // variant === 'view'
  return (
    <KeyboardAvoidingView
      style={[baseStyle, style]}
      behavior={behavior}
      keyboardVerticalOffset={offset}
      contentContainerStyle={contentContainerStyle}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;
