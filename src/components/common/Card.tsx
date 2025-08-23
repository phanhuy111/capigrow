import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { CARD_STYLES, SPACING } from '../../utils/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'flat';
  style?: ViewStyle;
  padding?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  padding,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle = CARD_STYLES[variant];
    
    return {
      ...baseStyle,
      ...(padding !== undefined && { padding }),
      ...style,
    };
  };

  return (
    <View style={getCardStyle()}>
      {children}
    </View>
  );
};

export default Card;
