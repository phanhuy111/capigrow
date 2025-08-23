import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RootStackParamList } from '@/types';
import Screen from '@/components/common/Screen';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/utils/theme';
import { useOTPVerificationMutation, useResendOTPMutation } from '@/hooks/useAuthQueries';
import { useAuthStore } from '@/store/authStore';
import NumericKeypad from '@/components/common/NumericKeypad';

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTPVerification'>;
type OTPVerificationScreenRouteProp = RouteProp<RootStackParamList, 'OTPVerification'>;

// Zod schema for OTP validation
const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});

type OTPFormData = z.infer<typeof otpSchema>;

const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { setAuthData } = useAuthStore();
  const { phoneNumber, isLogin = false } = route.params;
  // For demo purposes, using a mock sessionId - in real app this would come from previous screen
  const sessionId = 'mock-session-id';

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const otpVerificationMutation = useOTPVerificationMutation();
  const resendOTPMutation = useResendOTPMutation();
  
  const {
    control,
    handleSubmit,
    setValue,
    watch,
  } = useForm<OTPFormData>({
    defaultValues: {
      otp: '',
    },
    mode: 'onChange',
    resolver: zodResolver(otpSchema),
  });
  
  const otp = watch('otp');

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleKeyPress = (key: string) => {
    const currentOtp = otp;
    if (currentOtp.length < 6) {
      const newOtp = currentOtp + key;
      setValue('otp', newOtp, { shouldValidate: true });
      
      // Auto-submit when OTP is complete
      if (newOtp.length === 6) {
        setTimeout(() => {
          handleSubmit(onSubmit)();
        }, 500);
      }
    }
  };

  const handleDelete = () => {
    const currentOtp = otp;
    if (currentOtp.length > 0) {
      setValue('otp', currentOtp.slice(0, -1), { shouldValidate: true });
    }
  };

  const onSubmit = async (data: OTPFormData) => {
    try {
      const result = await otpVerificationMutation.mutateAsync({
        sessionId,
        otp: data.otp,
      });
      
      if (result.success) {
        if (isLogin) {
          // For existing users, navigate to main app
          navigation.navigate('MainTabs');
        } else {
          // For new users, navigate to user registration
          navigation.navigate('UserRegistration', {
            phoneNumber,
            token: result.token || 'temp-token',
          });
        }
        // Store auth data if available
        if (result.token && result.user && result.refreshToken) {
          setAuthData({
            user: result.user,
            access_token: result.token,
            refresh_token: result.refreshToken
          });
        }
      } else {
        Alert.alert('Error', result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Verification failed. Please try again.'
      );
    }
  };



  const handleResendOTP = async () => {
    if (!canResend) return;
    
    try {
      const result = await resendOTPMutation.mutateAsync(sessionId);
      
      if (result.success) {
        setCountdown(60);
        setCanResend(false);
        setValue('otp', '', { shouldValidate: true });
        Alert.alert('Success', 'OTP has been resent to your phone.');
      } else {
        Alert.alert('Error', result.message || 'Failed to resend OTP.');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to resend OTP. Please try again.'
      );
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>

          <Text style={styles.title}>
            {isLogin ? 'Đăng nhập với OTP' : 'Nhập mã OTP'}
          </Text>
          <Text style={styles.subtitle}>
            Vui lòng kiểm tra mã OTP được gửi đến số điện thoại{' '}
            <Text style={styles.phoneText}>{formatPhoneNumber(phoneNumber)}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <Controller
           control={control}
           name="otp"
           render={({ field: { value } }) => (
            <View style={styles.otpContainer}>
              {Array.from({ length: 6 }, (_, index) => (
                <View key={index} style={styles.otpInputContainer}>
                  <Text style={styles.otpDigit}>{value[index] || ''}</Text>
                </View>
              ))}
            </View>
          )}
        />

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOTP} disabled={resendOTPMutation.isPending}>
              <Text style={styles.resendText}>
                {resendOTPMutation.isPending ? 'Sending...' : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.countdownText}>
              Resend OTP in {countdown}s
            </Text>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            { opacity: otp.length === 6 ? 1 : 0.5 }
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={otp.length !== 6 || otpVerificationMutation.isPending}
        >
          <Text style={styles.verifyButtonText}>
            {otpVerificationMutation.isPending ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        {/* Status Text */}
        <Text style={styles.statusText}>
          {otp.length === 6 ? 'OTP complete - Processing...' : `Enter ${6 - otp.length} more digits`}
        </Text>


      </View>

      {/* Numeric Keypad */}
      <View style={styles.keypadSection}>
        <NumericKeypad
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
        />
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
    paddingHorizontal: SPACING.xxxxl,
    paddingTop: SPACING.xxxl,
  },
  header: {
    marginBottom: SPACING.xxxxxxl,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: SPACING.xxxl,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  lockIcon: {
    fontSize: 32,
    color: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'left',
    marginBottom: SPACING.xl,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: SPACING.xxxxl,
  },
  phoneText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xxxxl,
    gap: SPACING.xl,
  },
  otpInputContainer: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpDigit: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxxxl,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  countdownText: {
    fontSize: 14,
    color: COLORS.textTertiary,
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  verifyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },

  keypadSection: {
    backgroundColor: COLORS.gray100,
    paddingTop: SPACING.xl,
  },
});

export default OTPVerificationScreen;
