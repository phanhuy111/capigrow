import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Globe, Smartphone } from "lucide-react-native";
import type React from "react";
import { type Control, useForm } from "react-hook-form";
import { Alert, Dimensions, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import CapiGrowLogo from "@/components/common/CapiGrowLogo";
import InputForm from "@/components/common/InputForm";
import { SelectionForm } from "@/components/common/SelectionForm";
import tokens from "@/components/lib/tokens";
import { Button } from "@/components/ui";
import { usePhoneVerificationMutation } from "@/hooks/useAuthQueries";
import type { RootStackParamList } from "@/types";
import { cleanPhoneNumber } from "@/utils/validation";

const { height } = Dimensions.get("window");

type PhoneEntryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "PhoneEntry">;

// Zod schema for phone validation
const phoneSchema = z.object({
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
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
  const phoneVerificationMutation = usePhoneVerificationMutation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
    mode: "onChange",
  });

  const phoneNumber = watch("phoneNumber");

  const onSubmit = async (data: PhoneFormData) => {
    const cleanPhone = cleanPhoneNumber(data.phoneNumber);

    try {
      const result = await phoneVerificationMutation.mutateAsync({
        phoneNumber: cleanPhone,
        countryCode: "+84",
      });

      if (result.success) {
        navigation.navigate("OTPVerification", {
          phoneNumber: cleanPhone,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại.";
      Alert.alert("Lỗi", errorMessage);
    }
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
                key={`radial-line-${index * 22.5}`}
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
              <CapiGrowLogo size="large" color={tokens.colors.neutral[0]} />
            </View>
          </View>
        </View>

        {/* Bottom Form Section */}
        <View className="bg-white rounded-t-2xl pt-6" style={{ minHeight: height * 0.5 }}>
          <View className="px-6 flex gap-2">
            <Text className="text-3xl font-bold text-gray-900 mb-3 text-left">
              Nhập số điện thoại của bạn{"\n"}để bắt đầu
            </Text>

            {/* Country and Phone Input */}
            <SelectionForm
              label="Quốc gia"
              placeholder="Chọn quốc gia"
              name="country"
              control={control as Control<PhoneFormData>}
              options={[
                { label: "🇻🇳 Vietnam (+84)", value: "VN" },
                { label: "🇺🇸 United States (+1)", value: "US" },
                { label: "🇬🇧 United Kingdom (+44)", value: "GB" },
                { label: "🇯🇵 Japan (+81)", value: "JP" },
                { label: "🇰🇷 South Korea (+82)", value: "KR" },
                { label: "🇸🇬 Singapore (+65)", value: "SG" },
                { label: "🇹🇭 Thailand (+66)", value: "TH" },
                { label: "🇲🇾 Malaysia (+60)", value: "MY" },
                { label: "🇮🇩 Indonesia (+62)", value: "ID" },
                { label: "🇵🇭 Philippines (+63)", value: "PH" },
              ]}
              leftIcon={<Globe size={20} color="#6B7280" />}
            />

            <InputForm
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              name="phoneNumber"
              control={control as Control<PhoneFormData>}
              keyboardType="phone-pad"
              leftIcon={<Smartphone size={20} color="#6B7280" />}
            />

            <Text className="text-xs text-gray-500 text-left leading-4 mb-6">
              Bằng việc nhấn tiếp theo, đồng nghĩa với việc bạn đồng ý các{" "}
              <Text className="text-purple-600 font-medium">điều khoản sử dụng và dịch vụ</Text>
            </Text>

            <Button
              title={phoneVerificationMutation.isPending ? "Đang xử lý..." : "Tiếp theo →"}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="lg"
              fullWidth
              disabled={
                !isValid ||
                phoneNumber.replace(/\s/g, "").length < 9 ||
                phoneVerificationMutation.isPending
              }
              loading={phoneVerificationMutation.isPending}
              style={{
                backgroundColor: "#8B5CF6",
                borderRadius: 16,
                paddingVertical: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              textStyle={{
                fontSize: 16,
                fontWeight: "600",
                color: "#FFFFFF",
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default PhoneEntryScreen;
