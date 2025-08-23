import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { Input, Button } from '@/components/ui';
import { useRegisterMutation } from '../../hooks/useAuthQueries';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

// Zod schema for registration validation
const registerSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  phoneNumber: z.string()
    .optional()
    .or(z.literal('')),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const registerMutation = useRegisterMutation();
  
  const { control, handleSubmit, formState: { isValid } } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerMutation.mutateAsync({
        email: registerData.email,
        password: registerData.password,
        first_name: registerData.firstName,
        last_name: registerData.lastName,
        phone_number: registerData.phoneNumber || '',
      });
      // Navigation will be handled by the mutation's onSuccess callback
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Capigrow and start investing</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>First Name</Text>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                      <Input
                        placeholder="First name"
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize="words"
                        error={error?.message}
                      />
                    </>
                  )}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Last Name</Text>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                      <Input
                        placeholder="Last name"
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize="words"
                        error={error?.message}
                      />
                    </>
                  )}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      placeholder="Enter your email"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={error?.message}
                    />
                  </>
                )}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number (Optional)</Text>
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      placeholder="Enter your phone number"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="phone-pad"
                      error={error?.message}
                    />
                  </>
                )}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      placeholder="Create a password"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                      autoCapitalize="none"
                      error={error?.message}
                    />
                  </>
                )}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <>
                    <Input
                      placeholder="Confirm your password"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                      autoCapitalize="none"
                      error={error?.message}
                    />
                  </>
                )}
              />
            </View>

            <Button
              title={registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || registerMutation.isPending}
              loading={registerMutation.isPending}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  registerButtonDisabled: {
    backgroundColor: COLORS.gray400,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  signInText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
