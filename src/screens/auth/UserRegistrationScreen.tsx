import React from 'react';
import {
  View,
  Text,
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
    <Screen style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bottomOffset={0}
      >
          <View className="flex-row items-center px-4 pt-6 pb-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4"
            >
              <Text className="text-xl text-gray-900">←</Text>
            </TouchableOpacity>
            
            <CapiGrowLogo size="medium" color="#8B5CF6" />
          </View>
          
          <View className="flex-1 px-4 pt-4">
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">Create Your Account</Text>
            
            <Text className="text-base text-gray-600 text-center mb-6 leading-6">
              Please fill in your information to complete registration
            </Text>
            
            <View className="flex-1">
              <View className="flex-row justify-between mb-4">
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
                      className="flex-1 mx-1"
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
                      className="flex-1 mx-1"
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
                    className="mb-4"
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
                    className="mb-4"
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
                    className="mb-4"
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
                    className="mb-4"
                  />
                )}
              />
            </View>
          </View>
        
        <View className="px-4 pb-6 pt-4">
          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            loading={registerMutation.isPending}
            fullWidth
            className="mb-4"
          />
          
          <Text className="text-sm text-gray-600 text-center leading-5">
            By creating an account, you agree to our{' '}
            <Text className="text-purple-600 font-semibold">Terms of Service</Text> and{' '}
            <Text className="text-purple-600 font-semibold">Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
};



export default UserRegistrationScreen;