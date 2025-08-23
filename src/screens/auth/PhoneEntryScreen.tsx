import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RootStackParamList } from "@/types";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@/utils/theme";

import CapiGrowLogo from "@/components/common/CapiGrowLogo";
import { Input, Button } from "@/components/ui";
import { usePhoneVerificationMutation } from "@/hooks/useAuthQueries";
import { cleanPhoneNumber } from "@/utils/validation";

const { height } = Dimensions.get("window");

type PhoneEntryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PhoneEntry"
>;

// Zod schema for phone validation
const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(/^[0-9\s]+$/, "Số điện thoại chỉ được chứa số")
    .refine((val) => {
      const cleaned = val.replace(/\s/g, "");
      return cleaned.length >= 9 && cleaned.length <= 10;
    }, "Số điện thoại phải có 9-10 chữ số"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

const PhoneEntryScreen: React.FC = () => {
  const navigation = useNavigation<PhoneEntryScreenNavigationProp>();
  const [useKeypad, setUseKeypad] = useState(true);
  const phoneVerificationMutation = usePhoneVerificationMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
    mode: "onChange",
  });

  const phoneNumber = watch("phoneNumber");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: PhoneFormData) => {
    const cleanPhone = cleanPhoneNumber(data.phoneNumber);

    try {
      const result = await phoneVerificationMutation.mutateAsync({
        phoneNumber: cleanPhone,
        countryCode: "+84", // Vietnam country code
      });

      if (result.success) {
        navigation.navigate("OTPVerification", {
          phoneNumber: cleanPhone,
        });
      } else {
        Alert.alert("Lỗi", result.message || "Không thể gửi mã OTP");
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
      );
    }
  };

  const handleSendOTP = async () => {
    const cleanNumber = phoneNumber.replace(/\s/g, "");
    if (!cleanNumber.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại của bạn");
      return;
    }

    if (cleanNumber.length < 9) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại hợp lệ");
      return;
    }

    setLoading(true);
    try {
      const response = await phoneVerificationMutation.mutateAsync({
        phoneNumber: cleanNumber,
        countryCode: "+84",
      });
      if (response.success) {
        navigation.navigate("OTPVerification", { phoneNumber: cleanNumber });
      } else {
        Alert.alert("Lỗi", response.message || "Không thể gửi mã OTP");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    const limited = cleaned.slice(0, 9);

    if (limited.length >= 6) {
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(
        6
      )}`;
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    }
    return limited;
  };

  const toggleInputMethod = () => {
    setUseKeypad(!useKeypad);
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 relative bg-purple-500">
          {/* Radiating lines background effect */}
          <View className="absolute inset-0 justify-center items-center">
            {Array.from({ length: 16 }).map((_, index) => (
              <View
                key={index}
                className="absolute w-0.5 bg-white/10"
                style={[
                  {
                    height: height * 0.6,
                    transformOrigin: "center bottom",
                    transform: [{ rotate: `${index * 22.5}deg` }],
                  },
                ]}
              />
            ))}
          </View>

          <View className="flex-1 justify-center items-center z-10">
            {/* Logo */}
            <View className="items-center justify-center">
              <CapiGrowLogo size="large" color={COLORS.white} />
            </View>
          </View>
        </View>

        {/* Bottom Form Section */}
        <View className="bg-white rounded-t-3xl pt-8" style={{ minHeight: height * 0.45 }}>
          <View className="px-8">
            <Text className="text-lg font-semibold text-gray-900 text-left mb-8 leading-6">
              Nhập số điện thoại của bạn để bắt đầu
            </Text>

            {/* Country and Phone Input */}
            <View className="mb-4">
              <TouchableOpacity className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 mb-4">
                <Text className="text-xl mr-3">🇻🇳</Text>
                <Text className="flex-1 text-base text-gray-900">Vietnam (+84)</Text>
                <Text className="text-xs text-gray-500">▼</Text>
              </TouchableOpacity>
            </View>

            {useKeypad ? (
              <TouchableOpacity className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 mb-8">
                <Text className="text-xl mr-3">📱</Text>
                <Text
                  className={`flex-1 text-base ${
                    phoneNumber ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {phoneNumber || "Nhập số điện thoại"}
                </Text>
              </TouchableOpacity>
            ) : (
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    value={value}
                    onChangeText={(text) => {
                      const cleaned = cleanPhoneNumber(text);
                      if (cleaned.length <= 9) {
                        onChange(formatPhoneNumber(cleaned));
                      }
                    }}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                    error={errors.phoneNumber?.message}
                    className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 mb-8"
                  />
                )}
              />
            )}

            <TouchableOpacity
              onPress={toggleInputMethod}
              className="items-center py-3 mb-4"
            >
              <Text className="text-sm text-purple-500 font-medium">
                {useKeypad ? "Sử dụng bàn phím" : "Sử dụng số pad"}
              </Text>
            </TouchableOpacity>

            <Text className="text-xs text-gray-400 text-left leading-4 mb-8">
              Bằng việc nhấn tiếp theo, đồng nghĩa với việc bạn đồng ý các{" "}
              <Text className="text-purple-500 font-medium">điều khoản sử dụng và dịch vụ</Text>
            </Text>

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={
              !isValid ||
              phoneNumber.replace(/\s/g, "").length < 9 ||
              phoneVerificationMutation.isPending
            }
            loading={phoneVerificationMutation.isPending}
          >
            <Text className="text-white text-base font-semibold">
              {phoneVerificationMutation.isPending
                ? "Đang xử lý..."
                : "Tiếp theo →"}
            </Text>
          </Button>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};



export default PhoneEntryScreen;
