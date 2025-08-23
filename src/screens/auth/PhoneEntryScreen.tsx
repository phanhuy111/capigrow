import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RootStackParamList } from '@/types';
import Screen from '@/components/common/Screen';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/utils/theme';
import { useAuthStore } from '@/store/authStore';

// import LinearGradient from 'react-native-linear-gradient';
import CapiGrowLogo from '@/components/common/CapiGrowLogo';
import NumericKeypad from '@/components/common/NumericKeypad';
import { Input } from '@/components/ui';
import { usePhoneVerificationMutation } from '@/hooks/useAuthQueries';
import { cleanPhoneNumber } from '@/utils/validation';

const { height } = Dimensions.get('window');

type PhoneEntryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhoneEntry'>;

// Zod schema for phone validation
const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^[0-9\s]+$/, 'Số điện thoại chỉ được chứa số')
    .refine((val) => {
      const cleaned = val.replace(/\s/g, '');
      return cleaned.length >= 9 && cleaned.length <= 10;
    }, 'Số điện thoại phải có 9-10 chữ số'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

const PhoneEntryScreen: React.FC = () => {
  const navigation = useNavigation<PhoneEntryScreenNavigationProp>();
  const [showKeypad, setShowKeypad] = useState(false);
  const [useKeypad, setUseKeypad] = useState(true);
  const phoneVerificationMutation = usePhoneVerificationMutation();
  
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: '',
    },
    mode: 'onChange',
  });
  
  const phoneNumber = watch('phoneNumber');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: PhoneFormData) => {
    const cleanPhone = cleanPhoneNumber(data.phoneNumber);
    
    try {
      const result = await phoneVerificationMutation.mutateAsync({
        phoneNumber: cleanPhone,
        countryCode: '+84', // Vietnam country code
      });
      
      if (result.success) {
        navigation.navigate('OTPVerification', {
          phoneNumber: cleanPhone,
        });
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể gửi mã OTP');
      }
    } catch (error: any) {
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.'
      );
    }
  };

  const handleSendOTP = async () => {
    const cleanNumber = phoneNumber.replace(/\s/g, '');
    if (!cleanNumber.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại của bạn');
      return;
    }

    if (cleanNumber.length < 9) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const response = await phoneVerificationMutation.mutateAsync({
          phoneNumber: cleanNumber,
          countryCode: '+84'
        });
      if (response.success) {
        navigation.navigate('OTPVerification', { phoneNumber: cleanNumber });
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể gửi mã OTP');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 9);

    if (limited.length >= 6) {
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    }
    return limited;
  };

  const handleKeyPress = (key: string) => {
    const currentClean = phoneNumber.replace(/\s/g, '');
    if (currentClean.length < 9) {
      const newNumber = currentClean + key;
      setValue('phoneNumber', formatPhoneNumber(newNumber), { shouldValidate: true });
    }
  };

  const handleDelete = () => {
    const currentClean = phoneNumber.replace(/\s/g, '');
    if (currentClean.length > 0) {
      const newNumber = currentClean.slice(0, -1);
      setValue('phoneNumber', formatPhoneNumber(newNumber), { shouldValidate: true });
    }
  };
  
  const toggleInputMethod = () => {
    setUseKeypad(!useKeypad);
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
            onPress={handleSendOTP}
            disabled={phoneNumber.replace(/\s/g, '').length < 9 || loading}
          >
            <Text style={styles.continueButtonKeypadText}>
              {loading ? 'Đang xử lý...' : 'Tiếp theo'}
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
          <Text style={styles.title}>Nhập số điện thoại của bạn để bắt đầu</Text>

          {/* Country and Phone Input */}
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.countrySelector}>
              <Text style={styles.flag}>🇻🇳</Text>
              <Text style={styles.countryText}>Vietnam (+84)</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {useKeypad ? (
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
          ) : (
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  value={value}
                  onChangeText={(text) => {
                    const cleaned = cleanPhoneNumber(text);
                    if (cleaned.length <= 9) {
                      onChange(formatPhoneNumber(cleaned));
                    }
                  }}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  error={errors.phoneNumber?.message}
                  style={styles.phoneInputContainer}
                />
              )}
            />
          )}
          
          <TouchableOpacity onPress={toggleInputMethod} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {useKeypad ? 'Sử dụng bàn phím' : 'Sử dụng số pad'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            Bằng việc nhấn tiếp theo, đồng nghĩa với việc bạn đồng ý các{' '}
            <Text style={styles.linkText}>điều khoản sử dụng và dịch vụ</Text>
          </Text>

          <TouchableOpacity
            style={[
              styles.continueButtonMain,
              { opacity: (!isValid || phoneNumber.replace(/\s/g, '').length < 9) ? 0.5 : 1 }
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || phoneNumber.replace(/\s/g, '').length < 9 || phoneVerificationMutation.isPending}
          >
            <Text style={styles.continueButtonMainText}>
              {phoneVerificationMutation.isPending ? 'Đang xử lý...' : 'Tiếp theo →'}
            </Text>
          </TouchableOpacity>
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
  toggleButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
  },
  toggleText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
});

export default PhoneEntryScreen;
