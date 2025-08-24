import { zodResolver } from "@hookform/resolvers/zod";
import { type RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { useRegisterMutation } from "@/hooks/useAuthQueries";
import { useAuthClientStore } from "@/store/authClientStore";
import type { RootStackParamList, User } from "@/types";

type CreatePasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePassword"
>;
type CreatePasswordScreenRouteProp = RouteProp<RootStackParamList, "CreatePassword">;

const createPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Mật khẩu phải có chữ hoa, chữ thường và số"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type CreatePasswordFormData = z.infer<typeof createPasswordSchema>;

const CreatePasswordScreen: React.FC = () => {
  const navigation = useNavigation<CreatePasswordScreenNavigationProp>();
  const route = useRoute<CreatePasswordScreenRouteProp>();
  const { phoneNumber, userInfo } = route.params;
  const { setAuthData } = useAuthClientStore();
  const registerMutation = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreatePasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(createPasswordSchema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: CreatePasswordFormData) => {
    try {
      const response = await registerMutation.mutateAsync({
        phoneNumber: phoneNumber,
        fullName: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        password: data.password,
        confirmPassword: data.password,
        dateOfBirth: userInfo.dateOfBirth,
        gender: "other" as const,
      });

      // Store authentication data
      if (response.access_token) {
        // Convert API user to User type format
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          first_name: response.user.fullName?.split(" ")[0] || "",
          last_name: response.user.fullName?.split(" ").slice(1).join(" ") || "",
          phone_number: response.user.phoneNumber,
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
        
        setAuthData(user, response.access_token, response.refresh_token);
      }

      Alert.alert("Tạo tài khoản thành công", "Tài khoản của bạn đã được tạo thành công!", [
        {
          text: "Tiếp tục",
          onPress: () => navigation.navigate("MainTabs"),
        },
      ]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Không thể tạo tài khoản";
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
        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          bottomOffset={0}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <Button variant="ghost" onPress={() => navigation.goBack()}>
              <Text className="text-xl text-gray-900">←</Text>
            </Button>
            <Text className="text-lg font-semibold text-gray-900">Tạo mật khẩu</Text>
            <View className="w-10" />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 pt-6">
              <Text className="text-2xl font-semibold text-gray-900 mb-3">
                Tạo mật khẩu bảo mật
              </Text>
              <Text className="text-base text-gray-600 leading-5 mb-12">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
              </Text>

              <View className="flex-1">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Mật khẩu"
                      placeholder="Nhập mật khẩu"
                      value={value}
                      onChangeText={onChange}
                      error={errors.password?.message}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      leftIcon={<Text className="text-lg">🔒</Text>}
                      rightIcon={
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          <Text className="text-lg">{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                        </TouchableOpacity>
                      }
                      onRightIconPress={() => setShowPassword(!showPassword)}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Xác nhận mật khẩu"
                      placeholder="Nhập lại mật khẩu"
                      value={value}
                      onChangeText={onChange}
                      error={errors.confirmPassword?.message}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      leftIcon={<Text className="text-lg">🔒</Text>}
                      rightIcon={
                        <TouchableOpacity
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <Text className="text-lg">{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</Text>
                        </TouchableOpacity>
                      }
                      onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  )}
                />

                {/* Password Requirements */}
                <View className="bg-gray-50 p-4 rounded-lg mt-4">
                  <Text className="text-base font-medium text-gray-900 mb-3">
                    Yêu cầu mật khẩu:
                  </Text>
                  <Text className="text-sm text-gray-600 mb-1">• Ít nhất 8 ký tự</Text>
                  <Text className="text-sm text-gray-600 mb-1">• Có chữ hoa và chữ thường</Text>
                  <Text className="text-sm text-gray-600 mb-1">• Có ít nhất 1 số</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="px-6 py-4 border-t border-gray-200 bg-white">
            <Button
              onPress={handleSubmit(onSubmit)}
              loading={registerMutation.isPending}
              disabled={registerMutation.isPending || !isValid}
            >
              <Text className="text-white text-base font-semibold">
                {registerMutation.isPending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </Text>
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default CreatePasswordScreen;
