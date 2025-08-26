import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import CreatePasswordScreen from "@/screens/auth/CreatePasswordScreen";
import OTPVerificationScreen from "@/screens/auth/OTPVerificationScreen";
import PhoneEntryScreen from "@/screens/auth/PhoneEntryScreen";
// Import screens
import SplashScreen from "@/screens/auth/SplashScreen";
import WelcomeScreen from "@/screens/auth/WelcomeScreen";
import LoadingScreen from "@/screens/common/LoadingScreen";
import CommonSuccessScreen from "@/screens/common/CommonSuccessScreen";
import InvestmentAmountScreen from "@/screens/investment/InvestmentAmountScreen";
import InvestmentDetailsScreen from "@/screens/investment/InvestmentDetailsScreen";
import InvestmentReviewScreen from "@/screens/investment/InvestmentReviewScreen";
import NotificationScreen from "@/screens/notification/NotificationScreen";
import NotificationDetailScreen from "@/screens/notification/NotificationDetailScreen";
import BankTransferQRScreen from "@/screens/payment/BankTransferQRScreen";
import PaymentConfirmationScreen from "@/screens/payment/PaymentConfirmationScreen";
import PaymentProcessingScreen from "@/screens/payment/PaymentProcessingScreen";
import IdentityVerificationScreen from "@/screens/verification/IdentityVerificationScreen";
import VerificationDocumentScreen from "@/screens/verification/VerificationDocumentScreen";
import VerificationSelfieScreen from "@/screens/verification/VerificationSelfieScreen";
import VerificationStatusScreen from "@/screens/verification/VerificationStatusScreen";
import { getToken, getUserData } from "@/services/storage";
import { useAuthClientStore } from "@/store";

import type { RootStackParamList, User } from "@/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, setAuthData } = useAuthClientStore();
  const [initializing, setInitializing] = React.useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getToken();
        const userData = await getUserData();

        if (token && userData) {
          setAuthData(userData as User, token, "");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, [setAuthData]);

  if (initializing) {
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
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
            <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
            <Stack.Screen name="IdentityVerification" component={IdentityVerificationScreen} />
            <Stack.Screen
              name="VerificationDocument"
              component={VerificationDocumentScreen}
              options={{ headerShown: true, title: "Document Verification" }}
            />
            <Stack.Screen
              name="VerificationSelfie"
              component={VerificationSelfieScreen}
              options={{ headerShown: true, title: "Selfie Verification" }}
            />
            <Stack.Screen
              name="VerificationStatus"
              component={VerificationStatusScreen}
              options={{ headerShown: true, title: "Verification Status" }}
            />
            <Stack.Screen
              name="InvestmentDetails"
              component={InvestmentDetailsScreen}
              options={{ headerShown: true, title: "Investment Details" }}
            />
            <Stack.Screen
              name="InvestmentAmount"
              component={InvestmentAmountScreen}
              options={{ headerShown: true, title: "Choose Amount" }}
            />
            <Stack.Screen
              name="InvestmentReview"
              component={InvestmentReviewScreen}
              options={{ headerShown: true, title: "Review Investment" }}
            />
            <Stack.Screen
              name="PaymentConfirmation"
              component={PaymentConfirmationScreen}
              options={{ headerShown: true, title: "Payment Confirmation" }}
            />
            <Stack.Screen
              name="PaymentProcessing"
              component={PaymentProcessingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BankTransferQR"
              component={BankTransferQRScreen}
              options={{ headerShown: true, title: "Bank Transfer" }}
            />
            <Stack.Screen
              name="CommonSuccessScreen"
              component={CommonSuccessScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
