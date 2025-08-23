import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import Screen from '@/components/common/Screen';
import CapiGrowLogo from '@/components/common/CapiGrowLogo';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/utils/theme';
import { useLoginMutation } from '@/hooks/useAuthQueries';
import { useAuthStore } from '@/store/authStore';
import { formatPhoneNumber, cleanPhoneNumber } from '@/utils/validation';
// import LinearGradient from 'react-native-linear-gradient';
import NumericKeypad from '@/components/common/NumericKeypad';

const { height } = Dimensions.get('window');

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

// Zod schema for phone entry validation
const phoneEntrySchema = z.object({
  phoneNumber: z.string()
    .min(9, 'Số điện thoại phải có ít nhất 9 chữ số')
    .regex(/^[0-9\s]+$/, 'Số điện thoại chỉ được chứa số')
});

type PhoneEntryFormData = z.infer<typeof phoneEntrySchema>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const loginMutation = useLoginMutation();

  const { handleSubmit, setValue, watch } = useForm<PhoneEntryFormData>({
    defaultValues: { phoneNumber: '' },
    resolver: zodResolver(phoneEntrySchema)
  });

  const [showKeypad, setShowKeypad] = useState(false);
  const phoneNumber = watch('phoneNumber');

  const onSubmit = async (data: PhoneEntryFormData) => {
    const cleanNumber = cleanPhoneNumber(data.phoneNumber);
    
    try {
      // For phone-based login, we need to send OTP first
      // This is a simplified version - you might need to adjust based on your API
      const response = await loginMutation.mutateAsync({
        email: `${cleanNumber}@phone.login`, // Temporary email format for phone login
        password: 'phone_login_temp' // This will be replaced with OTP verification
      });
      
      // Navigate to OTP verification with phone number
      navigation.navigate('OTPVerification', { 
        phoneNumber: cleanNumber,
        isLogin: true 
      });
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể gửi mã OTP');
    }
  };



  const handleKeyPress = (key: string) => {
    const currentClean = phoneNumber.replace(/\s/g, '');
    if (currentClean.length < 9) {
      const newNumber = currentClean + key;
      setValue('phoneNumber', formatPhoneNumber(newNumber));
    }
  };

  const handleDelete = () => {
    const currentClean = phoneNumber.replace(/\s/g, '');
    if (currentClean.length > 0) {
      const newNumber = currentClean.slice(0, -1);
      setValue('phoneNumber', formatPhoneNumber(newNumber));
    }
  };

  if (showKeypad) {
    return (
      <SafeAreaView style={styles.keypadContainer}>
        <View style={styles.keypadHeader}>
          <TouchableOpacity
            style={styles.backButtonKeypad}
            onPress={() => setShowKeypad(false)}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.keypadTitle}>Nhập số điện thoại của bạn để bắt đầu</Text>

          <View style={styles.countryRow}>
            <Text style={styles.flag}>🇻🇳</Text>
            <Text style={styles.countryText}>Vietnam (+84)</Text>
          </View>

          <View style={styles.phoneDisplayContainer}>
            <Text style={styles.phoneIcon}>📱</Text>
            <Text style={styles.phoneDisplay}>{phoneNumber || ''}</Text>
          </View>

          <Text style={styles.termsTextKeypad}>
            Bằng việc nhấn tiếp theo, đồng nghĩa với việc bạn đồng ý các{' '}
            <Text style={styles.linkText}>điều khoản sử dụng và dịch vụ</Text>
          </Text>

          <TouchableOpacity
            style={[
              styles.continueButtonKeypad,
              { opacity: phoneNumber.replace(/\s/g, '').length >= 9 ? 1 : 0.5 }
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={phoneNumber.replace(/\s/g, '').length < 9 || loginMutation.isPending}
          >
            <Text style={styles.continueButtonKeypadText}>
              {loginMutation.isPending ? 'Đang xử lý...' : 'Tiếp theo'}
            </Text>
          </TouchableOpacity>
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
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradient}>
        {/* Radiating lines background effect */}
        <View style={styles.radiatingLines}>
          {Array.from({ length: 16 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.radiatingLine,
                {
                  transform: [
                    { rotate: `${(index * 22.5)}deg` },
                  ],
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <CapiGrowLogo size="large" color={COLORS.white} />
          </View>
        </View>
      </View>

      {/* Bottom Form Section */}
      <View style={styles.formSection}>
        <View style={styles.formContent}>
          <Text style={styles.title}>Đăng nhập bằng số điện thoại</Text>

          {/* Country and Phone Input */}
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.countrySelector}>
              <Text style={styles.flag}>🇻🇳</Text>
              <Text style={styles.countryText}>Vietnam (+84)</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.phoneInputContainer}
            onPress={() => setShowKeypad(true)}
          >
            <Text style={styles.phoneInputIcon}>📱</Text>
            <Text style={[
              styles.phoneInputText,
              { color: phoneNumber ? COLORS.textPrimary : COLORS.textTertiary }
            ]}>
              {phoneNumber || 'Nhập số điện thoại'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            Bằng việc nhấn tiếp theo, đồng nghĩa với việc bạn đồng ý các{' '}
            <Text style={styles.linkText}>điều khoản sử dụng và dịch vụ</Text>
          </Text>

          <TouchableOpacity
            style={[
              styles.continueButtonMain,
              { opacity: phoneNumber.replace(/\s/g, '').length >= 9 ? 1 : 0.5 }
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={phoneNumber.replace(/\s/g, '').length < 9 || loginMutation.isPending}
          >
            <Text style={styles.continueButtonMainText}>
              {loginMutation.isPending ? 'Đang xử lý...' : 'Đăng nhập →'}
            </Text>
          </TouchableOpacity>

          {/* Alternative Registration */}
          <View style={styles.alternativeContainer}>
            <Text style={styles.alternativeText}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PhoneEntry')}>
              <Text style={styles.alternativeLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main screen styles
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  gradient: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#8B5CF6',
  },
  radiatingLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radiatingLine: {
    position: 'absolute',
    width: 2,
    height: height * 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transformOrigin: 'center bottom',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Form section styles
  formSection: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: SPACING.xxxl,
    minHeight: height * 0.45,
  },
  formContent: {
    paddingHorizontal: SPACING.xxxxl,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'left',
    marginBottom: SPACING.xxxl,
    lineHeight: 24,
  },

  // Input styles
  inputRow: {
    marginBottom: SPACING.lg,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  flag: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  countryText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  dropdownIcon: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.xxxl,
  },
  phoneInputIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  phoneInputText: {
    flex: 1,
    fontSize: 16,
  },

  // Terms and button styles
  termsText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: 'left',
    lineHeight: 16,
    marginBottom: SPACING.xxxl,
  },
  linkText: {
    color: '#8B5CF6',
    fontWeight: '500',
  },
  continueButtonMain: {
    backgroundColor: '#8B5CF6',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xxxxl,
  },
  continueButtonMainText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },

  // Alternative options
  alternativeContainer: {
    alignItems: 'center',
  },
  alternativeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  alternativeLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Keypad screen styles
  keypadContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keypadHeader: {
    paddingHorizontal: SPACING.xxxxl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  backButtonKeypad: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  keypadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxxl,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  phoneDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.xxxl,
  },
  phoneIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  phoneDisplay: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  termsTextKeypad: {
    fontSize: 12,
    color: COLORS.textTertiary,
    lineHeight: 16,
    marginBottom: SPACING.xxxl,
  },
  continueButtonKeypad: {
    backgroundColor: '#8B5CF6',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  continueButtonKeypadText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  keypadSection: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    paddingTop: SPACING.xl,
  },
});

export default LoginScreen;
