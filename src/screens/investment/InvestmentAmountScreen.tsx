import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import Screen from '@/components/common/Screen';
import NumericKeypad from '@/components/common/NumericKeypad';
import { COLORS, SPACING, TYPOGRAPHY, FONT_SIZES, BORDER_RADIUS } from '@/utils/theme';
import { useInvestmentStore } from '@/store/investmentStore';
import { formatCurrency, calculateReturns } from '@/utils/helpers';
import { Input } from '@/components/ui';

type InvestmentAmountScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'InvestmentAmount'
>;
type InvestmentAmountScreenRouteProp = RouteProp<RootStackParamList, 'InvestmentAmount'>;

// Zod schema for investment amount validation
const investmentAmountSchema = z.object({
  amount: z.string()
    .min(1, 'Vui lòng nhập số tiền đầu tư')
    .regex(/^\d+$/, 'Số tiền phải là số nguyên dương')
    .refine((val) => parseInt(val) >= 1000000, 'Số tiền tối thiểu là 1,000,000 VND')
    .refine((val) => parseInt(val) <= 1000000000, 'Số tiền tối đa là 1,000,000,000 VND'),
});

type InvestmentAmountFormData = z.infer<typeof investmentAmountSchema>;

const InvestmentAmountScreen: React.FC = () => {
  const navigation = useNavigation<InvestmentAmountScreenNavigationProp>();
  const route = useRoute<InvestmentAmountScreenRouteProp>();
  const { selectedInvestment } = useInvestmentStore();

  const { investmentId } = route.params;
  const investment = selectedInvestment;

  const { control, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm<InvestmentAmountFormData>({
    defaultValues: {
      amount: '',
    },
    resolver: zodResolver(investmentAmountSchema),
    mode: 'onChange'
  });

  const amount = watch('amount');

  const onSubmit = (data: InvestmentAmountFormData) => {
    const investmentAmount = parseFloat(data.amount);

    if (!investment) {
      Alert.alert('Error', 'Investment details not found');
      return;
    }

    navigation.navigate('InvestmentReview', {
      investmentId,
      amount: investmentAmount,
    });
  };

  const setQuickAmount = (value: number) => {
    setValue('amount', value.toString());
  };

  if (!investment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Investment not found</Text>
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
  ].filter(amt => amt <= investment.max_amount);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Investment Amount</Text>
          <Text style={styles.subtitle}>{investment.title}</Text>
        </View>

        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Investment Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <Controller
                  control={control}
                  name="amount"
                  rules={{
                    required: 'Amount is required',
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'Please enter a valid amount',
                    },
                    validate: {
                      positive: (value: string) => parseFloat(value) > 0 || 'Amount must be greater than 0',
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.amountInput}
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

        <View style={styles.quickAmountsSection}>
          <Text style={styles.quickAmountsLabel}>Quick Amounts</Text>
          <View style={styles.quickAmountsContainer}>
            {quickAmounts.map((quickAmount, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickAmountButton}
                onPress={() => setQuickAmount(quickAmount)}
              >
                <Text style={styles.quickAmountText}>
                  {formatCurrency(quickAmount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.limitsSection}>
          <View style={styles.limitRow}>
            <Text style={styles.limitLabel}>Minimum:</Text>
            <Text style={styles.limitValue}>
              {formatCurrency(investment.min_amount)}
            </Text>
          </View>
          <View style={styles.limitRow}>
            <Text style={styles.limitLabel}>Maximum:</Text>
            <Text style={styles.limitValue}>
              {formatCurrency(investment.max_amount)}
            </Text>
          </View>
        </View>

        {investmentAmount > 0 && (
          <View style={styles.projectionSection}>
            <Text style={styles.projectionTitle}>Investment Projection</Text>
            <View style={styles.projectionCard}>
              <View style={styles.projectionRow}>
                <Text style={styles.projectionLabel}>Investment Amount:</Text>
                <Text style={styles.projectionValue}>
                  {formatCurrency(investmentAmount)}
                </Text>
              </View>
              <View style={styles.projectionRow}>
                <Text style={styles.projectionLabel}>Expected Return:</Text>
                <Text style={styles.projectionValue}>
                  {formatCurrency(expectedReturns)}
                </Text>
              </View>
              <View style={styles.projectionRow}>
                <Text style={styles.projectionLabel}>Total Value:</Text>
                <Text style={[styles.projectionValue, styles.totalValue]}>
                  {formatCurrency(investmentAmount + expectedReturns)}
                </Text>
              </View>
              <View style={styles.projectionRow}>
                <Text style={styles.projectionLabel}>Duration:</Text>
                <Text style={styles.projectionValue}>
                  {investment.duration} months
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !isValid && styles.continueButtonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  amountSection: {
    marginBottom: SPACING.xl,
  },
  amountLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: SPACING.sm,
  },
  currencySymbol: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  amountInput: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    minWidth: 200,
  },
  quickAmountsSection: {
    marginBottom: SPACING.xl,
  },
  quickAmountsLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    backgroundColor: COLORS.gray100,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    minWidth: '48%',
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  limitsSection: {
    backgroundColor: COLORS.gray100,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  limitLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  limitValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  projectionSection: {
    marginBottom: SPACING.xl,
  },
  projectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  projectionCard: {
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  projectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  projectionLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  projectionValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  totalValue: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.gray400,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default InvestmentAmountScreen;