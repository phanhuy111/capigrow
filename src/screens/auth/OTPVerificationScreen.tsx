import { zodResolver } from "@hookform/resolvers/zod";
import { type RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { useOTPVerificationMutation, useResendOTPMutation } from "@/hooks/useAuthQueries";
import { useAuthClientStore } from "@/store/authClientStore";
import type { RootStackParamList, User } from "@/types";

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "OTPVerification"
>;
type OTPVerificationScreenRouteProp = RouteProp<RootStackParamList, "OTPVerification">;

// Zod schema for OTP validation
const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { setAuthData } = useAuthClientStore();
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

  const _handleKeyPress = (key: string) => {
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

  const _handleDelete = () => {
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
        // Store auth data if available
        if (result.access_token && result.user && result.refresh_token) {
          // Convert API user to User type format
          const user = {
            id: result.user.id,
            email: result.user.email,
            first_name: result.user.fullName.split(" ")[0] || "",
            last_name: result.user.fullName.split(" ").slice(1).join(" ") || "",
            phone_number: result.user.phoneNumber,
            date_of_birth: undefined,
            profile_image_url: undefined,
            is_active: true,
            is_verified: false,
            verification_status: "pending" as const,
            investor_type: undefined,
            risk_tolerance: undefined,
            investment_goals: undefined,
            annual_income: undefined,
            net_worth: undefined,
            liquid_assets: undefined,
            two_factor_enabled: false,
            last_login_at: undefined,
            timezone: "UTC",
            language: "en",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          setAuthData(user, result.access_token, result.refresh_token);
        }

        if (!result.isNewUser) {
          // For existing users, navigate directly to main app
          navigation.navigate("MainTabs");
        } else {
          // For new users, navigate to welcome/registration screen
          navigation.navigate("Welcome", {
            phoneNumber,
          });
        }
      } else {
        Alert.alert("Lỗi", result.message || "Mã OTP không đúng. Vui lòng thử lại.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Xác thực thất bại. Vui lòng thử lại.";
      Alert.alert("Lỗi", errorMessage);
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to resend OTP. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length >= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
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
              <Text className="text-gray-900 font-semibold">{formatPhoneNumber(phoneNumber)}</Text>
            </Text>
          </View>

          {/* OTP Input */}
          <Controller
            control={control}
            name="otp"
            render={({ field: { value } }) => (
              <View className="flex-row justify-center mb-12 gap-4">
                {Array.from({ length: 6 }, (_, index) => (
                  <View
                    key={`otp-digit-${index}`}
                    className="w-15 h-15 border border-gray-200 rounded-lg bg-gray-50 justify-center items-center"
                  >
                    <Text className="text-2xl font-semibold text-gray-900">
                      {value[index] || ""}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          />

          {/* Resend Code */}
          <View className="flex-row justify-between items-center mb-12">
            {canResend ? (
              <TouchableOpacity onPress={handleResendOTP} disabled={resendOTPMutation.isPending}>
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
            className={`bg-purple-500 rounded-lg py-4 items-center mb-6 ${otp.length === 6 ? "opacity-100" : "opacity-50"}`}
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
