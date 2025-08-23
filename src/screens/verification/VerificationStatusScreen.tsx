import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useVerificationStore } from '../../store';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, VERIFICATION_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

type VerificationStatusScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationStatus'
>;

const VerificationStatusScreen: React.FC = () => {
  const navigation = useNavigation<VerificationStatusScreenNavigationProp>();
  const { verification, isLoading, fetchVerificationStatus } = useVerificationStore();

  useEffect(() => {
    fetchVerificationStatus();
  }, [fetchVerificationStatus]);

  const getStatusInfo = () => {
    if (!verification) {
      return {
        status: 'pending',
        color: COLORS.warning,
        icon: '⏳',
        title: 'Verification Pending',
        description: 'Please complete your document and selfie verification.',
      };
    }

    const statusKey = verification.status as keyof typeof VERIFICATION_STATUS;
    const statusInfo = VERIFICATION_STATUS[statusKey];

    const icons = {
      pending: '⏳',
      under_review: '👀',
      approved: '✅',
      rejected: '❌',
    };

    return {
      status: verification.status,
      color: statusInfo.color,
      icon: icons[statusKey] || '⏳',
      title: statusInfo.label,
      description: statusInfo.description,
    };
  };

  const statusInfo = getStatusInfo();

  const handleRetryVerification = () => {
    navigation.navigate('VerificationDocument');
  };

  const handleGoHome = () => {
    navigation.navigate('MainTabs');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading verification status...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIcon, { backgroundColor: statusInfo.color + '20' }]}>
            <Text style={styles.statusEmoji}>{statusInfo.icon}</Text>
          </View>

          <Text style={styles.statusTitle}>{statusInfo.title}</Text>
          <Text style={styles.statusDescription}>{statusInfo.description}</Text>
        </View>

        {verification && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Verification Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Document Type:</Text>
              <Text style={styles.detailValue}>
                {verification.document_type?.replace('_', ' ').toUpperCase() || 'Not specified'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Submitted:</Text>
              <Text style={styles.detailValue}>
                {formatDate(verification.created_at, 'long')}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
                <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
                  {statusInfo.title}
                </Text>
              </View>
            </View>

            {verification.verified_at && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Verified:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(verification.verified_at, 'long')}
                </Text>
              </View>
            )}

            {verification.rejection_reason && (
              <View style={styles.rejectionContainer}>
                <Text style={styles.rejectionTitle}>Rejection Reason:</Text>
                <Text style={styles.rejectionText}>{verification.rejection_reason}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.actionsContainer}>
          {verification?.status === 'rejected' && (
            <TouchableOpacity style={styles.retryButton} onPress={handleRetryVerification}>
              <Text style={styles.retryButtonText}>Retry Verification</Text>
            </TouchableOpacity>
          )}

          {verification?.status === 'approved' && (
            <TouchableOpacity style={styles.continueButton} onPress={handleGoHome}>
              <Text style={styles.continueButtonText}>Continue to App</Text>
            </TouchableOpacity>
          )}

          {(!verification || verification.status === 'pending' || verification.status === 'under_review') && (
            <View style={styles.waitingContainer}>
              <Text style={styles.waitingText}>
                We'll notify you once your verification is complete. This usually takes 1-2 business days.
              </Text>
              <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
                <Text style={styles.homeButtonText}>Go to Home</Text>
              </TouchableOpacity>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  statusIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  statusEmoji: {
    fontSize: 50,
  },
  statusTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  statusDescription: {
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
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
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
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  rejectionContainer: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.error + '10',
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  rejectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.error,
    marginBottom: SPACING.xs,
  },
  rejectionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  actionsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: SPACING.xl,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  waitingContainer: {
    alignItems: 'center',
  },
  waitingText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  homeButton: {
    backgroundColor: COLORS.gray600,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  homeButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default VerificationStatusScreen;