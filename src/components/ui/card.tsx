import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '@/utils/theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'default' | 'lg';
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'default',
  padding = 'default',
  style,
}: CardProps) {
  const getCardStyle = () => {
    const baseStyle = {
      borderRadius: BORDER_RADIUS.xl,
      backgroundColor: COLORS.surface,
    };

    const variantStyles = {
      default: {
        backgroundColor: COLORS.surface,
        shadowColor: COLORS.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      elevated: {
        backgroundColor: COLORS.surface,
        shadowColor: COLORS.black,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      },
      outlined: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
      },
      filled: {
        backgroundColor: COLORS.gray50,
      },
    };

    const paddingStyles = {
      none: { padding: 0 },
      sm: { padding: SPACING.lg },
      default: { padding: SPACING.xl },
      lg: { padding: SPACING.xxl },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...paddingStyles[padding],
    };
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
}

// Additional Card components for better composition
export function CardHeader({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
}

export function CardContent({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
}

export function CardFooter({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: SPACING.lg,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingTop: SPACING.lg,
  },
});