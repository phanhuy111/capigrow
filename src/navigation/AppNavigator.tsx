import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { getToken, getUserData } from '../services/storage';
import { setAuthData } from '../store/slices/authSlice';

// Import screens
import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import PhoneEntryScreen from '../screens/auth/PhoneEntryScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
import CreatePasswordScreen from '../screens/auth/CreatePasswordScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';
import NotificationScreen from '../screens/notification/NotificationScreen';
import IdentityVerificationScreen from '../screens/verification/IdentityVerificationScreen';
import VerificationDocumentScreen from '../screens/verification/VerificationDocumentScreen';
import VerificationSelfieScreen from '../screens/verification/VerificationSelfieScreen';
import VerificationStatusScreen from '../screens/verification/VerificationStatusScreen';
import InvestmentDetailsScreen from '../screens/investment/InvestmentDetailsScreen';
import InvestmentAmountScreen from '../screens/investment/InvestmentAmountScreen';
import InvestmentReviewScreen from '../screens/investment/InvestmentReviewScreen';
import PaymentConfirmationScreen from '../screens/payment/PaymentConfirmationScreen';
import PaymentProcessingScreen from '../screens/payment/PaymentProcessingScreen';
import BankTransferQRScreen from '../screens/payment/BankTransferQRScreen';
import LoadingScreen from '../screens/common/LoadingScreen';

import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const [initializing, setInitializing] = React.useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getToken();
        const userData = await getUserData();

        if (token && userData) {
          dispatch(setAuthData({
            user: userData,
            access_token: token,
            refresh_token: '', // Will be loaded separately if needed
            expires_at: '',
          }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (initializing || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
            <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
            <Stack.Screen name="IdentityVerification" component={IdentityVerificationScreen} />
            <Stack.Screen
              name="VerificationDocument"
              component={VerificationDocumentScreen}
              options={{ headerShown: true, title: 'Document Verification' }}
            />
            <Stack.Screen
              name="VerificationSelfie"
              component={VerificationSelfieScreen}
              options={{ headerShown: true, title: 'Selfie Verification' }}
            />
            <Stack.Screen
              name="VerificationStatus"
              component={VerificationStatusScreen}
              options={{ headerShown: true, title: 'Verification Status' }}
            />
            <Stack.Screen
              name="InvestmentDetails"
              component={InvestmentDetailsScreen}
              options={{ headerShown: true, title: 'Investment Details' }}
            />
            <Stack.Screen
              name="InvestmentAmount"
              component={InvestmentAmountScreen}
              options={{ headerShown: true, title: 'Choose Amount' }}
            />
            <Stack.Screen
              name="InvestmentReview"
              component={InvestmentReviewScreen}
              options={{ headerShown: true, title: 'Review Investment' }}
            />
            <Stack.Screen
              name="PaymentConfirmation"
              component={PaymentConfirmationScreen}
              options={{ headerShown: true, title: 'Payment Confirmation' }}
            />
            <Stack.Screen
              name="PaymentProcessing"
              component={PaymentProcessingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BankTransferQR"
              component={BankTransferQRScreen}
              options={{ headerShown: true, title: 'Bank Transfer' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
