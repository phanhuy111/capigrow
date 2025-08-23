import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RootStackParamList } from "@/types";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@/utils/theme";
import {
  useOTPVerificationMutation,
  useResendOTPMutation,
} from "@/hooks/useAuthQueries";
import { useAuthStore } from "@/store/authStore";

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "OTPVerification"
>;
type OTPVerificationScreenRouteProp = RouteProp<
  RootStackParamList,
  "OTPVerification"
>;

// Zod schema for OTP validation
const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { setAuthData } = useAuthStore();
  const { phoneNumber, isLogin = false } = route.params;
  // For demo purposes, using a mock sessionId - in real app this would come from previous screen
  const sessionId = "mock-session-id";

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpVerificationMutation = useOTPVerificationMutation();
  const resendOTPMutation = useResendOTPMutation();

  const { control, handleSubmit, setValue, watch } = useForm<OTPFormData>({
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
    resolver: zodResolver(otpSchema),
  });

  const otp = watch("otp");

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
      setValue("otp", newOtp, { shouldValidate: true });

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
      setValue("otp", currentOtp.slice(0, -1), { shouldValidate: true });
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
          navigation.navigate("MainTabs");
        } else {
          // For new users, navigate to user registration
          navigation.navigate("UserRegistration", {
            phoneNumber,
            token: result.token || "temp-token",
          });
        }
        // Store auth data if available
        if (result.token && result.user && result.refreshToken) {
          setAuthData({
            user: result.user,
            access_token: result.token,
            refresh_token: result.refreshToken,
          });
        }
      } else {
        Alert.alert(
          "Error",
          result.message || "Invalid OTP. Please try again."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Verification failed. Please try again."
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
        setValue("otp", "", { shouldValidate: true });
        Alert.alert("Success", "OTP has been resent to your phone.");
      } else {
        Alert.alert("Error", result.message || "Failed to resend OTP.");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length >= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
        6
      )}`;
    } else if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    }
    return cleaned;
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 px-8 pt-8">
          {/* Header */}
          <View className="mb-16">
            <TouchableOpacity
              className="w-10 h-10 justify-center items-start mb-8"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-2xl text-gray-900">←</Text>
            </TouchableOpacity>

            <View className="items-center mb-6">
              <Text className="text-3xl text-purple-500">🔒</Text>
            </View>

            <Text className="text-2xl font-semibold text-gray-900 text-left mb-6">
              {isLogin ? "Đăng nhập với OTP" : "Nhập mã OTP"}
            </Text>
            <Text className="text-sm text-gray-600 text-left leading-5 mb-12">
              Vui lòng kiểm tra mã OTP được gửi đến số điện thoại{" "}
              <Text className="text-gray-900 font-semibold">
                {formatPhoneNumber(phoneNumber)}
              </Text>
            </Text>
          </View>

          {/* OTP Input */}
          <Controller
            control={control}
            name="otp"
            render={({ field: { value } }) => (
              <View className="flex-row justify-center mb-12 gap-4">
                {Array.from({ length: 6 }, (_, index) => (
                  <View key={index} className="w-15 h-15 border border-gray-200 rounded-lg bg-gray-50 justify-center items-center">
                    <Text className="text-2xl font-semibold text-gray-900">{value[index] || ""}</Text>
                  </View>
                ))}
              </View>
            )}
          />

          {/* Resend Code */}
          <View className="flex-row justify-between items-center mb-12">
            {canResend ? (
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={resendOTPMutation.isPending}
              >
                <Text className="text-sm text-purple-500 font-medium">
                  {resendOTPMutation.isPending ? "Sending..." : "Resend Code"}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-sm text-gray-400">Resend OTP in {countdown}s</Text>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            className={`bg-purple-500 rounded-lg py-4 items-center mb-6 ${otp.length === 6 ? 'opacity-100' : 'opacity-50'}`}
            onPress={handleSubmit(onSubmit)}
            disabled={otp.length !== 6 || otpVerificationMutation.isPending}
          >
            <Text className="text-white text-base font-semibold">
              {otpVerificationMutation.isPending ? "Verifying..." : "Verify"}
            </Text>
          </TouchableOpacity>

          {/* Status Text */}
          <Text className="text-sm text-gray-600 text-center mt-3">
            {otp.length === 6
              ? "OTP complete - Processing..."
              : `Enter ${6 - otp.length} more digits`}
          </Text>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};



export default OTPVerificationScreen;
