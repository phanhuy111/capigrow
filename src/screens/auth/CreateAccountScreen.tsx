import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types";
import CapiGrowLogo from "@/components/common/CapiGrowLogo";
import { Input, Button } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";

type CreateAccountScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateAccount"
>;
type CreateAccountScreenRouteProp = RouteProp<
  RootStackParamList,
  "CreateAccount"
>;

// Zod schema for create account validation
const createAccountSchema = z.object({
  firstName: z
    .string()
    .min(2, "Họ phải có ít nhất 2 ký tự")
    .max(50, "Họ không được quá 50 ký tự"),
  lastName: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự"),
  email: z.string().email("Vui lòng nhập email hợp lệ"),
  dateOfBirth: z
    .string()
    .min(1, "Vui lòng nhập ngày sinh")
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Định dạng ngày sinh: DD/MM/YYYY"),
});

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

const CreateAccountScreen: React.FC = () => {
  const navigation = useNavigation<CreateAccountScreenNavigationProp>();
  const route = useRoute<CreateAccountScreenRouteProp>();
  const { phoneNumber } = route.params;

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<CreateAccountFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
    },
    resolver: zodResolver(createAccountSchema),
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    // Navigate to password creation screen
    navigation.navigate("CreatePassword", {
      phoneNumber,
      userInfo: data,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        bottomOffset={0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <TouchableOpacity
            className="w-10 h-10 justify-center items-center"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-xl text-gray-900">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            Tạo tài khoản
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 pt-6">
            <Text className="text-2xl font-semibold text-gray-900 mb-4">
              Nhập thông tin cá nhân
            </Text>
            <Text className="text-base text-gray-600 leading-5 mb-8">
              Vui lòng điền đầy đủ thông tin để hoàn tất việc tạo tài khoản
            </Text>

            <View className="flex-1">
              <Controller
                control={control}
                name="firstName"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    label="Họ"
                    placeholder="Nhập họ của bạn"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    autoCapitalize="words"
                    leftIcon={<Text className="text-lg">👤</Text>}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    label="Tên"
                    placeholder="Nhập tên của bạn"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    autoCapitalize="words"
                    leftIcon={<Text className="text-lg">👤</Text>}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    label="Email"
                    placeholder="Nhập email của bạn"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={<Text className="text-lg">✉️</Text>}
                  />
                )}
              />

              <Controller
                control={control}
                name="dateOfBirth"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Input
                    label="Ngày sinh"
                    placeholder="DD/MM/YYYY"
                    value={value}
                    onChangeText={onChange}
                    error={error?.message}
                    keyboardType="numeric"
                    leftIcon={<Text className="text-lg">🎂</Text>}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="px-6 py-4 border-t border-gray-200 bg-white">
          <Button
            title="Tiếp tục"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            size="large"
            fullWidth
            disabled={!isValid}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreateAccountScreen;
