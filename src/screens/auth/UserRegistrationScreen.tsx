import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RootStackParamList } from '@/types';
import Screen from '@/components/common/Screen';
import { Input, Button } from '@/components/ui';
import CapiGrowLogo from '@/components/common/CapiGrowLogo';
import { COLORS, SPACING, TYPOGRAPHY } from '@/utils/theme';
import { useRegisterMutation } from '@/hooks/useAuthQueries';
import { useAuthStore } from '@/store/authStore';

type UserRegistrationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'UserRegistration'
>;

type UserRegistrationScreenRouteProp = RouteProp<
  RootStackParamList,
  'UserRegistration'
>;

// Zod schema for user registration validation
const userRegistrationSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  dateOfBirth: z.string()
    .regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/, 'Please enter a valid date (MM/DD/YYYY)'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof userRegistrationSchema>;

const UserRegistrationScreen: React.FC = () => {
  const navigation = useNavigation<UserRegistrationScreenNavigationProp>();
  const route = useRoute<UserRegistrationScreenRouteProp>();
  const { setAuthData } = useAuthStore();
  const { phoneNumber, token } = route.params;
  
  const registerMutation = useRegisterMutation();
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegistrationFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(userRegistrationSchema),
    mode: 'onChange',
  });
  
  const password = watch('password');
  
  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerMutation.mutateAsync({
        email: registerData.email,
        password: registerData.password,
        first_name: registerData.firstName,
        last_name: registerData.lastName,
        phone_number: phoneNumber || '',
      });
      // Navigation will be handled by the mutation's onSuccess callback
    } catch (error) {
      // Error handling is done in the mutation
    }
  };
  
  return (
    <Screen style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.keyboardAvoid}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bottomOffset={0}
      >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            
            <CapiGrowLogo size="medium" color={COLORS.primary} />
          </View>
          
          <View style={styles.content}>
            <Text style={styles.title}>Create Your Account</Text>
            
            <Text style={styles.subtitle}>
              Please fill in your information to complete registration
            </Text>
            
            <View style={styles.form}>
              <View style={styles.nameRow}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="First Name"
                      placeholder="Enter first name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.firstName?.message}
                      style={styles.nameInput}
                    />
                  )}
                />
                
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Last Name"
                      placeholder="Enter last name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.lastName?.message}
                      style={styles.nameInput}
                    />
                  )}
                />
              </View>
              
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email Address"
                    placeholder="Enter email address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email?.message}
                    style={styles.input}
                  />
                )}
              />
              
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Date of Birth"
                    placeholder="MM/DD/YYYY"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.dateOfBirth?.message}
                    style={styles.input}
                  />
                )}
              />
              
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Create password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={errors.password?.message}
                    style={styles.input}
                  />
                )}
              />
              
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Confirm Password"
                    placeholder="Confirm password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={errors.confirmPassword?.message}
                    style={styles.input}
                  />
                )}
              />
            </View>
          </View>
        
        <View style={styles.footer}>
          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            loading={registerMutation.isPending}
            fullWidth
            style={styles.createButton}
          />
          
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  backButtonText: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  nameInput: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  input: {
    marginBottom: SPACING.lg,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  createButton: {
    marginBottom: SPACING.lg,
  },
  termsText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default UserRegistrationScreen;