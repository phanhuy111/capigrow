import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import Screen from '@/components/common/Screen';
import CapiGrowLogo from '@/components/common/CapiGrowLogo';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/utils/theme';
import { useAuthStore } from '@/store/authStore';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Capigrow</Text>
          <Text style={styles.tagline}>Grow Your Capital Wisely</Text>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <Text style={styles.illustrationText}>📈</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to Capigrow</Text>
          <Text style={styles.subtitle}>
            Start your investment journey with smart, secure, and profitable opportunities
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationText: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: SPACING.xl,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WelcomeScreen;
