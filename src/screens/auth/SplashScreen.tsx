import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import Screen from '@/components/common/Screen';
import CapiGrowLogo from '@/components/common/CapiGrowLogo';
import { COLORS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import { useAuthStore } from '@/store/authStore';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Background decoration */}
        <View style={styles.decorationContainer}>
          {/* Floating money/document icons matching Figma design */}
          <Text style={[styles.floatingIcon, styles.icon1]}>💰</Text>
          <Text style={[styles.floatingIcon, styles.icon2]}>📄</Text>
          <Text style={[styles.floatingIcon, styles.icon3]}>💳</Text>
          <Text style={[styles.floatingIcon, styles.icon4]}>📊</Text>
          <Text style={[styles.floatingIcon, styles.icon5]}>💵</Text>
          <Text style={[styles.floatingIcon, styles.icon6]}>📈</Text>
          <Text style={[styles.floatingIcon, styles.icon7]}>🏦</Text>
          <Text style={[styles.floatingIcon, styles.icon8]}>💎</Text>
        </View>

        {/* Logo and Brand */}
        <View style={styles.logoContainer}>
          <CapiGrowLogo size="large" color={COLORS.primary} />
          <Text style={styles.tagline}>Tìm kiếm doanh nghiệp tiềm năng{'\n'}và gia tăng tài sản của bạn</Text>
        </View>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <View style={styles.loadingProgress} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxxxxxl,
  },
  tagline: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
  decorationContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingIcon: {
    position: 'absolute',
    fontSize: 24,
    opacity: 0.6,
  },
  icon1: {
    top: '15%',
    left: '10%',
    fontSize: 20,
    transform: [{ rotate: '-15deg' }],
  },
  icon2: {
    top: '20%',
    right: '15%',
    fontSize: 18,
    transform: [{ rotate: '25deg' }],
  },
  icon3: {
    top: '30%',
    left: '5%',
    fontSize: 22,
    transform: [{ rotate: '10deg' }],
  },
  icon4: {
    top: '40%',
    right: '10%',
    fontSize: 20,
    transform: [{ rotate: '-20deg' }],
  },
  icon5: {
    bottom: '35%',
    left: '15%',
    fontSize: 18,
    transform: [{ rotate: '30deg' }],
  },
  icon6: {
    bottom: '30%',
    right: '20%',
    fontSize: 22,
    transform: [{ rotate: '-10deg' }],
  },
  icon7: {
    bottom: '45%',
    left: '8%',
    fontSize: 20,
    transform: [{ rotate: '15deg' }],
  },
  icon8: {
    bottom: '40%',
    right: '12%',
    fontSize: 24,
    transform: [{ rotate: '-25deg' }],
  },
  loadingContainer: {
    position: 'absolute',
    bottom: SPACING.xxxxxxl,
    width: '60%',
  },
  loadingBar: {
    height: 4,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    width: '70%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
});

export default SplashScreen;
