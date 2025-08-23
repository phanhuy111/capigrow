import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '@/types';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/utils/theme';
import { formatCurrency, formatDate } from '@/utils/helpers';

type PaymentConfirmationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PaymentConfirmation'
>;
type PaymentConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'PaymentConfirmation'>;

const PaymentConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<PaymentConfirmationScreenNavigationProp>();
  const route = useRoute<PaymentConfirmationScreenRouteProp>();

  const { transactionId } = route.params;

  // Mock transaction data - in real app, this would come from API
  const transaction = {
    id: transactionId,
    amount: 5000,
    investment_title: 'Green Energy Fund',
    payment_method: 'Bank Transfer',
    reference_number: 'TXN-' + Date.now().toString().slice(-8),
    status: 'completed',
    created_at: new Date().toISOString(),
    estimated_completion: '2-3 business days',
  };

  const handleViewTransaction = () => {
    navigation.navigate('MainTabs');
  };

  const handleNewInvestment = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Icon name="check-circle" size={80} color={COLORS.success} />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSubtitle}>
            Your investment has been processed successfully
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Transaction Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Investment:</Text>
            <Text style={styles.detailValue}>{transaction.investment_title}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={[styles.detailValue, styles.amountValue]}>
              {formatCurrency(transaction.amount)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{transaction.payment_method}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reference Number:</Text>
            <Text style={styles.detailValue}>{transaction.reference_number}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time:</Text>
            <Text style={styles.detailValue}>
              {formatDate(transaction.created_at, 'long')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <View style={styles.statusContainer}>
              <Icon name="check-circle" size={16} color={COLORS.success} />
              <Text style={[styles.detailValue, styles.statusText]}>
                Completed
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Icon name="info" size={24} color={COLORS.info} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>What's Next?</Text>
              <Text style={styles.infoText}>
                Your investment will be processed within {transaction.estimated_completion}.
                You'll receive a confirmation email and can track your investment in the Portfolio section.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleViewTransaction}>
            <Text style={styles.primaryButtonText}>View Portfolio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleNewInvestment}>
            <Text style={styles.secondaryButtonText}>Explore More Investments</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>
            Need help? Contact our support team
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Icon name="support-agent" size={16} color={COLORS.primary} />
            <Text style={styles.supportButtonText}>Get Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  successContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  successIcon: {
    marginBottom: SPACING.lg,
  },
  successTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  detailsContainer: {
    backgroundColor: COLORS.gray100,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  detailsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  amountValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  statusText: {
    marginLeft: SPACING.xs,
    color: COLORS.success,
  },
  infoContainer: {
    marginBottom: SPACING.xl,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  infoContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  infoTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: SPACING.xl,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  supportContainer: {
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  supportText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
});

export default PaymentConfirmationScreen;