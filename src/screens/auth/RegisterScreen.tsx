import React from "react";
import { View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { Input, Button } from "@/components/ui";
import { useRegisterMutation } from "@/hooks/useAuthQueries";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

// Zod schema for registration validation
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().optional().or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const registerMutation = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerMutation.mutateAsync({
        email: registerData.email,
        password: registerData.password,
        first_name: registerData.firstName,
        last_name: registerData.lastName,
        phone_number: registerData.phoneNumber || "",
      });
      // Navigation will be handled by the mutation's onSuccess callback
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
        bottomOffset={20}
      >
        <View className="mt-8 mb-8">
          <Text className="text-4xl font-bold text-gray-900 mb-2">
            Create Account
          </Text>
          <Text className="text-base text-gray-600">
            Join Capigrow and start investing
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between">
            <View className="mb-6 w-[48%]">
              <Text className="text-sm font-medium text-gray-900 mb-2">
                First Name
              </Text>
              <Controller
                control={control}
                name="firstName"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <Input
                      placeholder="First name"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="words"
                      error={error?.message}
                    />
                  </>
                )}
              />
            </View>

            <View className="mb-6 w-[48%]">
              <Text className="text-sm font-medium text-gray-900 mb-2">
                Last Name
              </Text>
              <Controller
                control={control}
                name="lastName"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <Input
                      placeholder="Last name"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="words"
                      error={error?.message}
                    />
                  </>
                )}
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-900 mb-2">
              Email
            </Text>
            <Controller
              control={control}
              name="email"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <Input
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={error?.message}
                  />
                </>
              )}
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-900 mb-2">
              Phone Number (Optional)
            </Text>
            <Controller
              control={control}
              name="phoneNumber"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <Input
                    placeholder="Enter your phone number"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    error={error?.message}
                  />
                </>
              )}
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-900 mb-2">
              Password
            </Text>
            <Controller
              control={control}
              name="password"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <Input
                    placeholder="Create a password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    autoCapitalize="none"
                    error={error?.message}
                  />
                </>
              )}
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-900 mb-2">
              Confirm Password
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <Input
                    placeholder="Confirm your password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    autoCapitalize="none"
                    error={error?.message}
                  />
                </>
              )}
            />
          </View>

          <Button
            title={
              registerMutation.isPending
                ? "Creating Account..."
                : "Create Account"
            }
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || registerMutation.isPending}
            loading={registerMutation.isPending}
          />
        </View>

        <View className="flex-row justify-center items-center pb-4">
          <Text className="text-sm text-gray-600">
            Already have an account?{" "}
          </Text>
          <Button
            variant="ghost"
            onPress={() => navigation.navigate("Login")}
            className="p-0"
          >
            <Text className="text-sm text-purple-600 font-semibold">
              Sign In
            </Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
