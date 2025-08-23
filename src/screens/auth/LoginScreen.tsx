import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import CapiGrowLogo from "@/components/common/CapiGrowLogo";
import { useLoginMutation } from "@/hooks/useAuthQueries";
import { formatPhoneNumber, cleanPhoneNumber } from "@/utils/validation";
import NumericKeypad from "@/components/common/NumericKeypad";
import { Button } from "@/components/ui";

const { height } = Dimensions.get("window");

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

// Zod schema for phone entry validation
const phoneEntrySchema = z.object({
  phoneNumber: z
    .string()
    .min(9, "Số điện thoại phải có ít nhất 9 chữ số")
    .regex(/^[0-9\s]+$/, "Số điện thoại chỉ được chứa số"),
});

type PhoneEntryFormData = z.infer<typeof phoneEntrySchema>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const loginMutation = useLoginMutation();

  const { handleSubmit, setValue, watch } = useForm<PhoneEntryFormData>({
    defaultValues: { phoneNumber: "" },
    resolver: zodResolver(phoneEntrySchema),
  });

  const [showKeypad, setShowKeypad] = useState(false);
  const phoneNumber = watch("phoneNumber");

  const onSubmit = async (data: PhoneEntryFormData) => {
    const cleanNumber = cleanPhoneNumber(data.phoneNumber);

    try {
      // For phone-based login, we need to send OTP first
      // This is a simplified version - you might need to adjust based on your API
      const response = await loginMutation.mutateAsync({
        email: `${cleanNumber}@phone.login`, // Temporary email format for phone login
        password: "phone_login_temp", // This will be replaced with OTP verification
      });

      // Navigate to OTP verification with phone number
      navigation.navigate("OTPVerification", {
        phoneNumber: cleanNumber,
        isLogin: true,
      });
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể gửi mã OTP");
    }
  };

  const handleKeyPress = (key: string) => {
    const currentClean = phoneNumber.replace(/\s/g, "");
    if (currentClean.length < 9) {
      const newNumber = currentClean + key;
      setValue("phoneNumber", formatPhoneNumber(newNumber));
    }
  };

  const handleDelete = () => {
    const currentClean = phoneNumber.replace(/\s/g, "");
    if (currentClean.length > 0) {
      const newNumber = currentClean.slice(0, -1);
      setValue("phoneNumber", formatPhoneNumber(newNumber));
    }
  };

  if (showKeypad) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-8 pt-6 pb-6 bg-white">
          <TouchableOpacity
            className="w-10 h-10 justify-center items-start mb-6"
            onPress={() => setShowKeypad(false)}
          >
            <Text className="text-2xl text-gray-900">←</Text>
          </TouchableOpacity>

          <Text className="text-lg font-semibold text-gray-900 mb-8">
            Nhập số điện thoại của bạn để bắt đầu
          </Text>

          <View className="flex-row items-center mb-4">
            <Text className="text-xl mr-4">🇻🇳</Text>
            <Text className="flex-1 text-base text-gray-900">
              Vietnam (+84)
            </Text>
          </View>

          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-6 py-6 mb-8">
            <Text className="text-xl mr-4">📱</Text>
            <Text className="flex-1 text-base text-gray-900">
              {phoneNumber || ""}
            </Text>
          </View>

          <Text className="text-xs text-gray-500 leading-4 mb-8">
            Bằng việc nhấn tiếp theo, đồng nghĩa với việc bạn đồng ý các{" "}
            <Text className="text-purple-600 font-medium">
              điều khoản sử dụng và dịch vụ
            </Text>
          </Text>

          <Button
            className="bg-purple-600 rounded-lg py-6 items-center mb-6"
            onPress={handleSubmit(onSubmit)}
            disabled={
              phoneNumber.replace(/\s/g, "").length < 9 ||
              loginMutation.isPending
            }
            loading={loginMutation.isPending}
          >
            <Text className="text-white text-base font-semibold">
              {loginMutation.isPending ? "Đang xử lý..." : "Tiếp theo"}
            </Text>
          </Button>
        </View>

        {/* Numeric Keypad */}
        <View className="flex-1 bg-gray-100 pt-6">
          <NumericKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 relative bg-purple-600">
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
            <CapiGrowLogo size="large" color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Bottom Form Section */}
      <View
        className="bg-white rounded-t-3xl pt-8"
        style={{ minHeight: height * 0.45 }}
      >
        <View className="px-8">
          <Text className="text-lg font-semibold text-gray-900 text-left mb-8 leading-6">
            Đăng nhập bằng số điện thoại
          </Text>

          {/* Country and Phone Input */}
          <View className="mb-4">
            <TouchableOpacity className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-6 py-6 mb-4">
              <Text className="text-xl mr-4">🇻🇳</Text>
              <Text className="flex-1 text-base text-gray-900">
                Vietnam (+84)
              </Text>
              <Text className="text-xs text-gray-600">▼</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-6 py-6 mb-8"
            onPress={() => setShowKeypad(true)}
          >
            <Text className="text-xl mr-4">📱</Text>
            <Text
              className={`flex-1 text-base ${
                phoneNumber ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {phoneNumber || "Nhập số điện thoại"}
            </Text>
          </TouchableOpacity>

          <Text className="text-xs text-gray-500 text-left leading-4 mb-8">
            Bằng việc nhấn tiếp theo, đồng nghĩa với việc bạn đồng ý các{" "}
            <Text className="text-purple-600 font-medium">
              điều khoản sử dụng và dịch vụ
            </Text>
          </Text>

          <Button
            className="bg-purple-600 rounded-lg py-6 items-center mb-8"
            onPress={handleSubmit(onSubmit)}
            disabled={
              phoneNumber.replace(/\s/g, "").length < 9 ||
              loginMutation.isPending
            }
            loading={loginMutation.isPending}
          >
            <Text className="text-white text-base font-semibold">
              {loginMutation.isPending ? "Đang xử lý..." : "Đăng nhập →"}
            </Text>
          </Button>

          {/* Alternative Registration */}
          <View className="items-center">
            <Text className="text-sm text-gray-500 mb-2">
              Chưa có tài khoản?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("PhoneEntry")}>
              <Text className="text-sm text-purple-600 font-semibold">
                Đăng ký ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
