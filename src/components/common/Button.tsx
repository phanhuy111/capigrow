import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, TYPOGRAPHY, BUTTON_STYLES, SPACING, BORDER_RADIUS } from '@/utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'invisible';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = BUTTON_STYLES[variant];
    const sizeStyle = getSizeStyle();
    
    return {
      ...baseStyle,
      ...sizeStyle,
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.5 }),
      ...style,
    };
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.lg,
          paddingHorizontal: SPACING.xxl,
        };
      case 'large':
        return {
          paddingVertical: SPACING.xxxl,
          paddingHorizontal: SPACING.xxxxl,
        };
      default:
        return {
          paddingVertical: SPACING.xl,
          paddingHorizontal: SPACING.xxxl,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle = getBaseTextStyle();
    const colorStyle = getTextColorStyle();
    
    return {
      ...baseTextStyle,
      ...colorStyle,
      ...textStyle,
    };
  };

  const getBaseTextStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return TYPOGRAPHY.buttonSmall;
      case 'large':
        return TYPOGRAPHY.buttonLarge;
      default:
        return TYPOGRAPHY.buttonMedium;
    }
  };

  const getTextColorStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return { color: COLORS.textOnPrimary };
      case 'secondary':
        return { color: COLORS.primary };
      case 'tertiary':
      case 'invisible':
        return { color: COLORS.primary };
      default:
        return { color: COLORS.textOnPrimary };
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? COLORS.white : COLORS.primary}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
