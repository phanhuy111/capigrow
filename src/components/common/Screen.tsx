import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/utils/theme';
import StatusBar from './StatusBar';

interface ScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  showStatusBar?: boolean;
  padding?: boolean;
  paddingHorizontal?: boolean;
  paddingVertical?: boolean;
  style?: ViewStyle;
  safeArea?: boolean;
}

const Screen: React.FC<ScreenProps> = ({
  children,
  backgroundColor = COLORS.background,
  statusBarStyle = 'dark-content',
  showStatusBar = true,
  padding = false,
  paddingHorizontal = false,
  paddingVertical = false,
  style,
  safeArea = true,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      backgroundColor,
    };

    if (padding) {
      baseStyle.padding = SPACING.xxxxl;
    } else {
      if (paddingHorizontal) {
        baseStyle.paddingHorizontal = SPACING.xxxxl;
      }
      if (paddingVertical) {
        baseStyle.paddingVertical = SPACING.xxxxl;
      }
    }

    return { ...baseStyle, ...style };
  };

  const content = (
    <View style={getContainerStyle()}>
      {showStatusBar && (
        <StatusBar
          backgroundColor={backgroundColor}
          barStyle={statusBarStyle}
        />
      )}
      {children}
    </View>
  );

  if (safeArea) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {content}
      </SafeAreaView>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default Screen;
