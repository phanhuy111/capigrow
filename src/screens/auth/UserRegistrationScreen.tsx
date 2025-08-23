import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { AuthStackParamList } from '../../navigation/types';
import Screen from '../../components/common/Screen';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import CapiGrowLogo from '../../components/common/CapiGrowLogo';
import { COLORS, SPACING, TYPOGRAPHY } from '../../utils/theme';
import { useUserRegistration } from '../../services/authService';
import { formSchemas } from '../../utils/validation';
import { setAuthData } from '../../store/slices/authSlice';

type UserRegistrationScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'UserRegistration'
>;

type UserRegistrationScreenRouteProp = RouteProp<
  AuthStackParamList,
  'UserRegistration'
>;

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}

const UserRegistrationScreen: React.FC = () => {
  const navigation = useNavigation<UserRegistrationScreenNavigationProp>();
  const route = useRoute<UserRegistrationScreenRouteProp>();
  const dispatch = useDispatch();
  const { phoneNumber, token } = route.params;
  
  const userRegistrationMutation = useUserRegistration();
  
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
    mode: 'onChange',
  });
  
  const password = watch('password');
  
  const onSubmit = async (data: RegistrationFormData) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    try {
      const result = await userRegistrationMutation.mutateAsync({
        phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        password: data.password,
        token,
      });
      
      if (result.success) {
        // Update auth state with user data
        dispatch(setAuthData({
          user: result.user,
          access_token: result.token,
          refresh_token: result.refreshToken,
          expires_at: result.expiresAt,
        }));
        
        // Navigate to main app
        navigation.navigate('MainApp');
      } else {
        Alert.alert('Error', result.message || 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  };
  
  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
                  rules={formSchemas.userRegistration.firstName}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="First Name"
                      placeholder="Enter first name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.firstName}
                      style={styles.nameInput}
                    />
                  )}
                />
                
                <Controller
                  control={control}
                  name="lastName"
                  rules={formSchemas.userRegistration.lastName}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Last Name"
                      placeholder="Enter last name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.lastName}
                      style={styles.nameInput}
                    />
                  )}
                />
              </View>
              
              <Controller
                control={control}
                name="email"
                rules={formSchemas.userRegistration.email}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email Address"
                    placeholder="Enter email address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email}
                    style={styles.input}
                  />
                )}
              />
              
              <Controller
                control={control}
                name="dateOfBirth"
                rules={formSchemas.userRegistration.dateOfBirth}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Date of Birth"
                    placeholder="MM/DD/YYYY"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.dateOfBirth}
                    style={styles.input}
                  />
                )}
              />
              
              <Controller
                control={control}
                name="password"
                rules={formSchemas.userRegistration.password}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Create password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={errors.password}
                    style={styles.input}
                  />
                )}
              />
              
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Confirm Password"
                    placeholder="Confirm password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={errors.confirmPassword}
                    style={styles.input}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            loading={userRegistrationMutation.isPending}
            fullWidth
            style={styles.createButton}
          />
          
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
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