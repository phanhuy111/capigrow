import React, { forwardRef } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/utils/theme';

export interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  onPress?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';
  size?: 'default' | 'sm' | 'lg' | 'large' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button = forwardRef<TouchableOpacity, ButtonProps>((
  {
    title,
    onPress,
    variant = 'default',
    size = 'default',
    disabled = false,
    loading = false,
    children,
    style,
    textStyle,
    fullWidth = false,
    ...props
  },
  ref
) => {
  const getButtonStyle = () => {
    const baseStyle = {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: BORDER_RADIUS.lg,
      paddingVertical: SPACING.xl,
      paddingHorizontal: SPACING.xxxl,
    };

    const variantStyles = {
      default: { backgroundColor: COLORS.primary },
      primary: { backgroundColor: COLORS.primary },
      destructive: { backgroundColor: COLORS.error },
      outline: { borderWidth: 1, borderColor: COLORS.primary, backgroundColor: 'transparent' },
      secondary: { backgroundColor: COLORS.secondary },
      ghost: { backgroundColor: 'transparent' },
      link: { backgroundColor: 'transparent', paddingVertical: 0, paddingHorizontal: 0 },
    };

    const sizeStyles = {
      default: { paddingVertical: SPACING.xl, paddingHorizontal: SPACING.xxxl },
      sm: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxl },
      lg: { paddingVertical: SPACING.xxl, paddingHorizontal: SPACING.xxxxl },
      large: { paddingVertical: SPACING.xxl, paddingHorizontal: SPACING.xxxxl },
      icon: { width: 40, height: 40, paddingVertical: 0, paddingHorizontal: 0 },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...(fullWidth && { width: '100%' as const }),
    } as ViewStyle;
  };

  const getTextStyle = () => {
    const baseStyle = {
      ...TYPOGRAPHY.buttonMedium,
      textAlign: 'center' as const,
    };

    const variantStyles = {
      default: { color: COLORS.white },
      primary: { color: COLORS.white },
      destructive: { color: COLORS.white },
      outline: { color: COLORS.primary },
      secondary: { color: COLORS.textPrimary },
      ghost: { color: COLORS.primary },
      link: { color: COLORS.primary, textDecorationLine: 'underline' as const },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
          size="small"
        />
      ) : (
        <>
          {children || (
            <Text style={[getTextStyle(), textStyle]}>
              {title}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});