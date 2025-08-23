import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/types';
import Screen from '@/components/common/Screen';
import { COLORS, SPACING, TYPOGRAPHY, FONT_SIZES } from '@/utils/theme';
import { useInvestmentStore } from '@/store/investmentStore';
import { formatCurrency, formatPercentage } from '@/utils/helpers';

const InvestmentReviewScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>InvestmentReviewScreen</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
});

export default InvestmentReviewScreen;