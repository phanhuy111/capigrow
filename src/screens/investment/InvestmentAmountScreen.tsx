import { zodResolver } from "@hookform/resolvers/zod";
import { type RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { useInvestmentClientStore } from "@/store/investmentClientStore";
import type { RootStackParamList } from "@/types";
import { calculateReturns, formatCurrency } from "@/utils/helpers";

type InvestmentAmountScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "InvestmentAmount"
>;
type InvestmentAmountScreenRouteProp = RouteProp<RootStackParamList, "InvestmentAmount">;

// Zod schema for investment amount validation
const investmentAmountSchema = z.object({
  amount: z
    .string()
    .min(1, "Vui lòng nhập số tiền đầu tư")
    .regex(/^\d+$/, "Số tiền phải là số nguyên dương")
    .refine((val) => parseInt(val, 10) >= 1000000, "Số tiền tối thiểu là 1,000,000 VND")
    .refine((val) => parseInt(val, 10) <= 1000000000, "Số tiền tối đa là 1,000,000,000 VND"),
});

type InvestmentAmountFormData = z.infer<typeof investmentAmountSchema>;

const InvestmentAmountScreen: React.FC = () => {
  const navigation = useNavigation<InvestmentAmountScreenNavigationProp>();
  const route = useRoute<InvestmentAmountScreenRouteProp>();
  const { selectedInvestment } = useInvestmentClientStore();

  const { investmentId } = route.params;
  const investment = selectedInvestment;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<InvestmentAmountFormData>({
    defaultValues: {
      amount: "",
    },
    resolver: zodResolver(investmentAmountSchema),
    mode: "onChange",
  });

  const amount = watch("amount");

  const onSubmit = (data: InvestmentAmountFormData) => {
    const investmentAmount = parseFloat(data.amount);

    if (!investment) {
      Alert.alert("Error", "Investment details not found");
      return;
    }

    navigation.navigate("InvestmentReview", {
      investmentId,
      amount: investmentAmount,
    });
  };

  const setQuickAmount = (value: number) => {
    setValue("amount", value.toString());
  };

  if (!investment) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 px-4">
          <Text className="text-2xl font-bold text-gray-900">Investment not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const investmentAmount = parseFloat(amount) || 0;
  const expectedReturns = calculateReturns(
    investmentAmount,
    investment.expected_return,
    investment.duration
  );

  const quickAmounts = [
    investment.min_amount,
    investment.min_amount * 2,
    investment.min_amount * 5,
    investment.min_amount * 10,
  ].filter((amt) => amt <= investment.max_amount);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mt-4 mb-6 items-center">
          <Text className="text-2xl font-bold text-gray-900 mb-1">Choose Investment Amount</Text>
          <Text className="text-base text-gray-600 text-center">{investment.title}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-2 text-center">
            Investment Amount
          </Text>
          <View className="flex-row items-center justify-center border-b-2 border-blue-600 pb-2">
            <Text className="text-4xl font-bold text-blue-600 mr-1">$</Text>
            <Controller
              control={control}
              name="amount"
              rules={{
                required: "Amount is required",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Please enter a valid amount",
                },
                validate: {
                  positive: (value: string) =>
                    parseFloat(value) > 0 || "Amount must be greater than 0",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="text-4xl font-bold text-gray-900 text-center min-w-[200px]"
                  value={value}
                  onChangeText={onChange}
                  placeholder="0"
                  keyboardType="numeric"
                  autoFocus
                />
              )}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-900 mb-2">Quick Amounts</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickAmounts.map((quickAmount, index) => (
              <TouchableOpacity
                key={`quick-amount-${quickAmount}`}
                className="bg-gray-100 py-2 px-3 rounded-lg mb-2 min-w-[48%] items-center"
                onPress={() => setQuickAmount(quickAmount)}
              >
                <Text className="text-sm text-gray-900 font-medium">
                  {formatCurrency(quickAmount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="bg-gray-100 p-3 rounded-lg mb-6">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-sm text-gray-600">Minimum:</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {formatCurrency(investment.min_amount)}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-sm text-gray-600">Maximum:</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {formatCurrency(investment.max_amount)}
            </Text>
          </View>
        </View>

        {investmentAmount > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">Investment Projection</Text>
            <View className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-gray-600">Investment Amount:</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {formatCurrency(investmentAmount)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-gray-600">Expected Return:</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {formatCurrency(expectedReturns)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-gray-600">Total Value:</Text>
                <Text className="text-base font-semibold text-blue-600">
                  {formatCurrency(investmentAmount + expectedReturns)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-gray-600">Duration:</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {investment.duration} months
                </Text>
              </View>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>

      <View className="p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          className={`py-3 rounded-lg items-center ${!isValid ? "bg-gray-400" : "bg-blue-600"}`}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          <Text className="text-white text-base font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default InvestmentAmountScreen;
