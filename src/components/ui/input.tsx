import React, { forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/utils/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'default' | 'lg';
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input = forwardRef<TextInput, InputProps>((
  {
    label,
    error,
    disabled = false,
    variant = 'default',
    size = 'default',
    style,
    containerStyle,
    labelStyle,
    errorStyle,
    leftIcon,
    rightIcon,
    onRightIconPress,
    ...props
  },
  ref
) => {
  const getInputStyle = () => {
    const baseStyle = {
      borderRadius: BORDER_RADIUS.lg,
      paddingVertical: SPACING.xl,
      paddingHorizontal: SPACING.xl,
      fontSize: TYPOGRAPHY.bodyMedium.fontSize,
      fontFamily: TYPOGRAPHY.bodyMedium.fontFamily,
      color: COLORS.textPrimary,
    };

    const variantStyles = {
      default: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
      },
      filled: {
        backgroundColor: COLORS.gray100,
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.border,
      },
    };

    const sizeStyles = {
      sm: {
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        fontSize: TYPOGRAPHY.bodySmall.fontSize,
      },
      default: {
        paddingVertical: SPACING.xl,
        paddingHorizontal: SPACING.xl,
        fontSize: TYPOGRAPHY.bodyMedium.fontSize,
      },
      lg: {
        paddingVertical: SPACING.xxl,
        paddingHorizontal: SPACING.xxl,
        fontSize: TYPOGRAPHY.bodyLarge.fontSize,
      },
    };

    let finalStyle = {
      ...baseStyle,
      ...variantStyles[variant],
      ...sizeStyles[size],
    };

    if (error) {
      finalStyle = {
        ...finalStyle,
        borderColor: COLORS.error,
        borderWidth: 1,
      };
    }

    if (disabled) {
      finalStyle = {
        ...finalStyle,
        backgroundColor: COLORS.gray100,
        borderColor: COLORS.borderLight,
        color: COLORS.textDisabled,
      };
    }

    return finalStyle;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <View style={[getInputStyle(), styles.inputContainer]}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          editable={!disabled}
          placeholderTextColor={COLORS.textTertiary}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    fontSize: TYPOGRAPHY.bodyMedium.fontSize,
    fontFamily: TYPOGRAPHY.bodyMedium.fontFamily,
    color: COLORS.textPrimary,
  },
  leftIcon: {
    marginRight: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    marginLeft: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});