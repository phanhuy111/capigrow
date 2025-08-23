import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../../types';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { formatCurrency, generateQRData } from '../../utils/helpers';

type BankTransferQRScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BankTransferQR'
>;
type BankTransferQRScreenRouteProp = RouteProp<RootStackParamList, 'BankTransferQR'>;

const BankTransferQRScreen: React.FC = () => {
  const navigation = useNavigation<BankTransferQRScreenNavigationProp>();
  const route = useRoute<BankTransferQRScreenRouteProp>();
  const [qrSize, setQrSize] = useState(200);

  const { transactionId } = route.params;

  // Mock transaction data - in real app, this would come from API
  const transaction = {
    id: transactionId,
    amount: 5000,
    reference_number: 'TXN-' + Date.now().toString().slice(-8),
    bank_details: {
      bank_name: 'Capigrow Bank',
      account_name: 'Capigrow Investment Ltd',
      account_number: '1234567890',
      routing_number: '021000021',
      swift_code: 'CAPIUS33',
    },
    payment_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  };

  const qrData = generateQRData({
    type: 'bank_transfer',
    amount: transaction.amount,
    reference: transaction.reference_number,
    account: transaction.bank_details.account_number,
    bank: transaction.bank_details.bank_name,
  });

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  };

  const handlePaymentComplete = () => {
    navigation.navigate('PaymentProcessing', { transactionId });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Payment',
      'Are you sure you want to cancel this payment?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Bank Transfer Payment</Text>
          <Text style={styles.subtitle}>
            Complete your payment using the QR code or bank details below
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount to Transfer</Text>
          <Text style={styles.amountValue}>{formatCurrency(transaction.amount)}</Text>
          <Text style={styles.referenceText}>
            Reference: {transaction.reference_number}
          </Text>
        </View>

        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Scan QR Code</Text>
          <View style={styles.qrCodeWrapper}>
            <QRCode
              value={qrData}
              size={qrSize}
              color={COLORS.textPrimary}
              backgroundColor={COLORS.white}
            />
          </View>
          <Text style={styles.qrSubtitle}>
            Scan with your banking app to auto-fill transfer details
          </Text>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.bankDetailsContainer}>
          <Text style={styles.bankDetailsTitle}>Bank Transfer Details</Text>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bank Name:</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{transaction.bank_details.bank_name}</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(transaction.bank_details.bank_name, 'Bank name')}
                >
                  <Icon name="content-copy" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Name:</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{transaction.bank_details.account_name}</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(transaction.bank_details.account_name, 'Account name')}
                >
                  <Icon name="content-copy" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Number:</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{transaction.bank_details.account_number}</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(transaction.bank_details.account_number, 'Account number')}
                >
                  <Icon name="content-copy" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Routing Number:</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{transaction.bank_details.routing_number}</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(transaction.bank_details.routing_number, 'Routing number')}
                >
                  <Icon name="content-copy" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference:</Text>
              <View style={styles.detailValueContainer}>
                <Text style={[styles.detailValue, styles.referenceValue]}>
                  {transaction.reference_number}
                </Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(transaction.reference_number, 'Reference number')}
                >
                  <Icon name="content-copy" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.warningContainer}>
          <Icon name="warning" size={24} color={COLORS.warning} />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Important Notes:</Text>
            <Text style={styles.warningText}>
              • Include the reference number in your transfer
            </Text>
            <Text style={styles.warningText}>
              • Transfer the exact amount shown above
            </Text>
            <Text style={styles.warningText}>
              • Payment must be completed within 24 hours
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.completeButton} onPress={handlePaymentComplete}>
            <Text style={styles.completeButtonText}>I've Completed the Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel Payment</Text>
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  amountContainer: {
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  amountLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  amountValue: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  referenceText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  qrTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  qrCodeWrapper: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: SPACING.md,
  },
  qrSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray300,
  },
  dividerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.md,
    fontWeight: '500',
  },
  bankDetailsContainer: {
    marginBottom: SPACING.xl,
  },
  bankDetailsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  detailCard: {
    backgroundColor: COLORS.gray100,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
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
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginRight: SPACING.sm,
    textAlign: 'right',
  },
  referenceValue: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.warning + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    marginBottom: SPACING.xl,
  },
  warningContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  warningTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  warningText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  actionsContainer: {
    paddingBottom: SPACING.xl,
  },
  completeButton: {
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  completeButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default BankTransferQRScreen;