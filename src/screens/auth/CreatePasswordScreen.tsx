import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "@/utils/theme";
import { Input, Button } from "@/components/ui";
import { useRegisterMutation } from "@/hooks/useAuthQueries";
import { useAuthStore } from "@/store/authStore";

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
  const { setAuthData } = useAuthStore();
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
        phone_number: phoneNumber,
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        email: userInfo.email,
        password: data.password,
      });

      // Store authentication data
      if (response.access_token) {
        setAuthData({
          user: response.user,
          access_token: response.access_token,
          refresh_token: response.refresh_token
        });
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
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tạo tài khoản");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.keyboardAvoidingView}
        contentContainerStyle={{ flexGrow: 1 }}
        bottomOffset={0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <Button
            variant="ghost"
            onPress={() => navigation.goBack()}
            className="w-10 h-10 justify-center items-center p-0"
          >
            <Text className="text-xl text-gray-900">←</Text>
          </Button>
          <Text className="text-lg font-semibold text-gray-900">Tạo mật khẩu</Text>
          <View className="w-10" />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Tạo mật khẩu bảo mật</Text>
            <Text style={styles.subtitle}>
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và
              số
            </Text>

            <View style={styles.form}>
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
                    leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Text style={styles.eyeIcon}>
                          {showPassword ? "👁️" : "👁️‍🗨️"}
                        </Text>
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
                    leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Text style={styles.eyeIcon}>
                          {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                        </Text>
                      </TouchableOpacity>
                    }
                    onRightIconPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />
                )}
              />

              {/* Password Requirements */}
              <View className="bg-gray-50 p-4 rounded-lg mt-4">
                <Text className="text-base font-medium text-gray-900 mb-3">Yêu cầu mật khẩu:</Text>
                <Text className="text-sm text-gray-600 mb-1">• Ít nhất 8 ký tự</Text>
                <Text className="text-sm text-gray-600 mb-1">
                  • Có chữ hoa và chữ thường
                </Text>
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
            className="bg-purple-600 py-4 rounded-lg items-center w-full"
          >
            <Text className="text-white text-base font-semibold">
              {registerMutation.isPending
                ? "Đang tạo tài khoản..."
                : "Tạo tài khoản"}
            </Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
  },
  content: {
    flex: 1,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.xxxl,
  },
  form: {
    flex: 1,
  },
  inputIcon: {
    fontSize: FONT_SIZES.lg,
  },
  eyeIcon: {
    fontSize: FONT_SIZES.lg,
  },
  requirementsContainer: {
    backgroundColor: COLORS.gray50,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
  },
  requirementsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "500",
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  requirementItem: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
});

export default CreatePasswordScreen;
