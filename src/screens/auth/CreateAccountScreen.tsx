import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import Screen from '@/components/common/Screen';
import CapiGrowLogo from '@/components/common/CapiGrowLogo';
import { COLORS, SPACING, TYPOGRAPHY, FONT_SIZES } from '@/utils/theme';
import { Input, Button } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

type CreateAccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateAccount'>;
type CreateAccountScreenRouteProp = RouteProp<RootStackParamList, 'CreateAccount'>;

// Zod schema for create account validation
const createAccountSchema = z.object({
  firstName: z.string()
    .min(2, 'Họ phải có ít nhất 2 ký tự')
    .max(50, 'Họ không được quá 50 ký tự'),
  lastName: z.string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự'),
  email: z.string()
    .email('Vui lòng nhập email hợp lệ'),
  dateOfBirth: z.string()
    .min(1, 'Vui lòng nhập ngày sinh')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Định dạng ngày sinh: DD/MM/YYYY'),
});

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

const CreateAccountScreen: React.FC = () => {
  const navigation = useNavigation<CreateAccountScreenNavigationProp>();
  const route = useRoute<CreateAccountScreenRouteProp>();
  const { phoneNumber } = route.params;

  const { control, handleSubmit, formState: { isValid } } = useForm<CreateAccountFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: ''
    },
    resolver: zodResolver(createAccountSchema),
    mode: 'onChange'
  });

  const onSubmit = (data: any) => {
    // Navigate to password creation screen
    navigation.navigate('CreatePassword', {
      phoneNumber,
      userInfo: data
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.keyboardAvoidingView}
        contentContainerStyle={{ flexGrow: 1 }}
        bottomOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tạo tài khoản</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Nhập thông tin cá nhân</Text>
            <Text style={styles.subtitle}>
              Vui lòng điền đầy đủ thông tin để hoàn tất việc tạo tài khoản
            </Text>

            <View style={styles.form}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    label="Họ"
                    placeholder="Nhập họ của bạn"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    autoCapitalize="words"
                    leftIcon={<Text style={styles.inputIcon}>👤</Text>}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    label="Tên"
                    placeholder="Nhập tên của bạn"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    autoCapitalize="words"
                    leftIcon={<Text style={styles.inputIcon}>👤</Text>}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    label="Email"
                    placeholder="Nhập email của bạn"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
                  />
                )}
              />

              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input
                    label="Ngày sinh"
                    placeholder="DD/MM/YYYY"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    keyboardType="numeric"
                    leftIcon={<Text style={styles.inputIcon}>🎂</Text>}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Tiếp tục"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            size="large"
            fullWidth
            disabled={!isValid}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
  },
  content: {
    flex: 1,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.xxxl,
  },
  form: {
    flex: 1,
  },
  inputIcon: {
    fontSize: FONT_SIZES.lg,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
});

export default CreateAccountScreen;
