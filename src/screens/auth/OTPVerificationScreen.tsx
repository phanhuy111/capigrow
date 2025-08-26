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
import { Icon } from "@/components/common";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { useOTPVerificationMutation, useResendOTPMutation } from "@/hooks/useAuthQueries";
import { useAuthClientStore } from "@/store/authClientStore";
import type { RootStackParamList } from "@/types";
import OtpInput from "@/components/ui/otp-input";

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "OTPVerification"
>;
type OTPVerificationScreenRouteProp = RouteProp<RootStackParamList, "OTPVerification">;

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute<OTPVerificationScreenRouteProp>();
  const { setAuthData } = useAuthClientStore();
  const { phoneNumber } = route.params;
  const sessionId = "mock-session-id";

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpVerificationMutation = useOTPVerificationMutation();
  const resendOTPMutation = useResendOTPMutation();

  const { control, handleSubmit, setValue, watch } = useForm<OTPFormData>({
    defaultValues: { otp: "" },
    mode: "onChange",
    resolver: zodResolver(otpSchema),
  });

  const otp = watch("otp");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const onSubmit = async (data: OTPFormData) => {
    try {
      const result = await otpVerificationMutation.mutateAsync({
        sessionId,
        otp: data.otp,
      });

      if (result.success) {
        if (result.access_token && result.user && result.refresh_token) {
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
          navigation.navigate("CreatePassword", {
            phoneNumber,
            userInfo: {
              firstName: result?.user?.fullName?.split(" ")[0] || "Huy",
              lastName: result?.user?.fullName?.split(" ").slice(1).join(" ") || "Nguyen",
              email: result?.user?.email || "phanhuy@gmail.com",
              dateOfBirth: "16/09/99",
            },
          });
        } else {
          navigation.navigate("Welcome", { phoneNumber });
        }
      } else {
        Alert.alert("Lỗi", result.message || "Mã OTP không đúng. Vui lòng thử lại.");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Xác thực thất bại. Vui lòng thử lại.";
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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend OTP. Please try again.";
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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-8">
          <View className="justify-center items-start mb-8">
            <View className="rounded-full bg-primary-50 justify-center items-center mb-6">
              <Icon name="lock" size={24} color="#3B82F6" />
            </View>

            <Text className="text-2xl font-semibold text-gray-900 text-left mb-4">Nhập mã OTP</Text>

            <Text className="text-md text-gray-500 text-left leading-5">
              Vui lòng kiểm tra mã OTP được gửi đến số điện thoại{" "}
              <Text className="text-gray-900 font-medium">{formatPhoneNumber(phoneNumber)}</Text>
            </Text>
          </View>

          {/* OTP Input */}
          <Controller
            control={control}
            name="otp"
            render={({ field: { value, onChange } }) => <OtpInput onTextChange={onChange} />}
          />
        </View>

        {/* Bottom Button */}
        <View className="px-6 pb-6 pt-4 bg-white border-gray-200 gap-2">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-sm text-gray-500">Gửi lại OTP sau {countdown}s</Text>

            {canResend && (
              <TouchableOpacity onPress={handleResendOTP} disabled={resendOTPMutation.isPending}>
                <Text className="text-base text-primary-500 font-medium">
                  {resendOTPMutation.isPending ? "Đang gửi..." : "Gửi lại"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Button
            title="Xong"
            onPress={handleSubmit(onSubmit)}
            disabled={otp.length !== 6 || otpVerificationMutation.isPending}
            loading={otpVerificationMutation.isPending}
            size="large"
            variant="primary"
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default OTPVerificationScreen;
