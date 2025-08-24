import { zodResolver } from "@hookform/resolvers/zod";
import { type RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import type { RootStackParamList } from "@/types";

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Welcome">;
type WelcomeScreenRouteProp = RouteProp<RootStackParamList, "Welcome">;

// Zod schema for registration validation
const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(50, "Họ và tên không được quá 50 ký tự"),
  dateOfBirth: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Ngày sinh phải có định dạng DD/MM/YYYY")
    .refine((date) => {
      const [day, month, year] = date.split("/").map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 100;
    }, "Bạn phải từ 18 tuổi trở lên"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const route = useRoute<WelcomeScreenRouteProp>();
  const phoneNumber = route.params?.phoneNumber || "";

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: RegistrationFormData) => {
    // Navigate to password creation screen
    navigation.navigate("CreatePassword", {
      phoneNumber,
      userInfo: {
        firstName: data.fullName.split(" ")[0],
        lastName: data.fullName.split(" ").slice(1).join(" "),
        email: "", // Will be optional
        dateOfBirth: data.dateOfBirth,
      },
    });
  };

  const formatDateInput = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2 && cleaned.length < 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length >= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
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
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <TouchableOpacity
            className="w-10 h-10 justify-center items-center"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-xl text-gray-900">←</Text>
          </TouchableOpacity>
          <View className="w-10" />
        </View>

        <View className="flex-1 px-6 pt-8">
          {/* Welcome Title */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
              Chào mừng bạn đến với CapiGrowth 🎉
            </Text>
          </View>

          {/* Form */}
          <View className="flex-1">
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Họ và tên"
                  placeholder="Nhập họ và tên đầy đủ"
                  value={value}
                  onChangeText={onChange}
                  error={errors.fullName?.message}
                  className="mb-4"
                />
              )}
            />

            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Ngày sinh"
                  placeholder="DD/MM/YYYY"
                  value={value}
                  onChangeText={(text) => onChange(formatDateInput(text))}
                  keyboardType="numeric"
                  error={errors.dateOfBirth?.message}
                  className="mb-8"
                  maxLength={10}
                />
              )}
            />
          </View>

          {/* Continue Button */}
          <View className="pb-6">
            <Button onPress={handleSubmit(onSubmit)} disabled={!isValid}>
              <Text className="text-white text-base font-semibold">Tiếp theo</Text>
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
