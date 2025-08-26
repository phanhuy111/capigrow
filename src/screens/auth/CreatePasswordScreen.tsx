import { zodResolver } from "@hookform/resolvers/zod";
import {
  type RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { Button } from "@/components/ui";
import Icon from "@/components/common/Icon";
import tokens from "@/components/lib/tokens";
import { useRegisterMutation } from "@/hooks/useAuthQueries";
import { useAuthClientStore } from "@/store/authClientStore";
import type { RootStackParamList, User } from "@/types";
import { InputForm } from "@/components/common";

type CreatePasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePassword"
>;
type CreatePasswordScreenRouteProp = RouteProp<
  RootStackParamList,
  "CreatePassword"
>;

const createPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải có chữ hoa, chữ thường và số"
      ),
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

      if (response.access_token) {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          first_name: response.user.fullName?.split(" ")[0] || "",
          last_name:
            response.user.fullName?.split(" ").slice(1).join(" ") || "",
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

      Alert.alert(
        "Tạo tài khoản thành công",
        "Tài khoản của bạn đã được tạo thành công!",
        [
          {
            text: "Tiếp tục",
            onPress: () => navigation.navigate("MainTabs"),
          },
        ]
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể tạo tài khoản";
      Alert.alert("Lỗi", errorMessage);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: tokens.colors.background.primary }}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: tokens.spacing[6],
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, paddingTop: tokens.spacing[6] }}>
            <Text
              style={{
                fontSize: tokens.typography.fontSize.xl,
                fontWeight: 600,
                color: tokens.colors.text.primary,
                marginBottom: tokens.spacing[2],
              }}
            >
              Thiết lập mật khẩu tài khoản
            </Text>

            <View style={{ flex: 1, marginTop: tokens.spacing[10] }}>
              <InputForm
                name="password"
                control={control}
                label="Nhập mật khẩu"
                placeholder="Nhập mật khẩu"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                required
                leftIcon={
                  <Icon
                    name="lock"
                    size={20}
                    color={tokens.colors.text.secondary}
                  />
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon
                      name={showPassword ? "eye" : "eye-slash"}
                      size={20}
                      color={tokens.colors.text.secondary}
                    />
                  </TouchableOpacity>
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
                style={{ marginBottom: tokens.spacing[4] }}
              />

              <InputForm
                name="confirmPassword"
                control={control}
                label="Nhập lại mật khẩu"
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                required
                leftIcon={
                  <Icon
                    name="lock"
                    size={20}
                    color={tokens.colors.text.secondary}
                  />
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon
                      name={showConfirmPassword ? "eye" : "eye-slash"}
                      size={20}
                      color={tokens.colors.text.secondary}
                    />
                  </TouchableOpacity>
                }
                onRightIconPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />

              {/* Password Requirements */}
              <View
                style={{
                  backgroundColor: tokens.colors.background.secondary,
                  padding: tokens.spacing[4],
                  borderRadius: tokens.borderRadius.lg,
                  marginTop: tokens.spacing[4],
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: tokens.spacing[2],
                  }}
                >
                  <Icon
                    name="tick"
                    size={16}
                    color={tokens.colors.success[500]}
                    style={{ marginRight: tokens.spacing[1] }}
                  />
                  <Text
                    style={{
                      fontSize: tokens.typography.fontSize.sm,
                      color: tokens.colors.text.secondary,
                    }}
                  >
                    Mật khẩu ít nhất 8 kí tự
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: tokens.spacing[2],
                  }}
                >
                  <Icon
                    name="tick"
                    size={16}
                    color={tokens.colors.success[500]}
                    style={{ marginRight: tokens.spacing[1] }}
                  />
                  <Text
                    style={{
                      fontSize: tokens.typography.fontSize.sm,
                      color: tokens.colors.text.secondary,
                    }}
                  >
                    Bao gồm cả kí tự đặc biệt, chữ và số
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: tokens.spacing[2],
                  }}
                >
                  <Icon
                    name="tick"
                    size={16}
                    color={tokens.colors.success[500]}
                    style={{ marginRight: tokens.spacing[1] }}
                  />
                  <Text
                    style={{
                      fontSize: tokens.typography.fontSize.sm,
                      color: tokens.colors.text.secondary,
                    }}
                  >
                    Có ít nhất 1 chữ viết thường (a-z)
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name="tick"
                    size={16}
                    color={tokens.colors.success[500]}
                    style={{ marginRight: tokens.spacing[1] }}
                  />
                  <Text
                    style={{
                      fontSize: tokens.typography.fontSize.sm,
                      color: tokens.colors.text.secondary,
                    }}
                  >
                    Có ít nhất 1 chữ viết hoa (A-Z)
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button Bar */}
        <View
          style={{
            paddingHorizontal: tokens.spacing[6],
            paddingVertical: tokens.spacing[4],
            borderTopWidth: 1,
            borderTopColor: tokens.colors.border.primary,
            backgroundColor: tokens.colors.background.primary,
          }}
        >
          <Button
            variant="primary"
            size="large"
            title={
              registerMutation.isPending ? "Đang tạo tài khoản..." : "Tiếp tục"
            }
            onPress={handleSubmit(onSubmit)}
            loading={registerMutation.isPending}
            disabled={registerMutation.isPending || !isValid}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreatePasswordScreen;
