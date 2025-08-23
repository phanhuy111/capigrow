import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../utils/constants';

interface CapiGrowLogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const CapiGrowLogo: React.FC<CapiGrowLogoProps> = ({ 
  size = 'medium', 
  color = COLORS.white 
}) => {
  const logoSize = {
    small: { icon: 24, text: 16 },
    medium: { icon: 40, text: 24 },
    large: { icon: 60, text: 32 },
  };

  const currentSize = logoSize[size];

  return (
    <View style={styles.container}>
      {/* Simple geometric logo icon */}
      <View style={[
        styles.logoIcon,
        {
          width: currentSize.icon,
          height: currentSize.icon,
          backgroundColor: color,
        }
      ]}>
        <View style={[styles.innerShape, { backgroundColor: color }]} />
      </View>
      
      <Text style={[
        styles.logoText,
        {
          fontSize: currentSize.text,
          color: color,
        }
      ]}>
        CAPIGROW
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    borderRadius: 8,
    marginBottom: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  innerShape: {
    width: '60%',
    height: '60%',
    borderRadius: 4,
    transform: [{ rotate: '-45deg' }],
  },
  logoText: {
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
});

export default CapiGrowLogo;
