import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useInvestmentStore } from '@/store/investmentStore';
import { COLORS, SPACING, TYPOGRAPHY, FONT_SIZES, BORDER_RADIUS } from '@/utils/theme';
import { RISK_LEVELS } from '@/utils/constants';
import { formatCurrency, formatPercentage, formatDate } from '@/utils/helpers';

type InvestmentDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'InvestmentDetails'
>;
type InvestmentDetailsScreenRouteProp = RouteProp<RootStackParamList, 'InvestmentDetails'>;

const InvestmentDetailsScreen: React.FC = () => {
  const navigation = useNavigation<InvestmentDetailsScreenNavigationProp>();
  const route = useRoute<InvestmentDetailsScreenRouteProp>();
  const { selectedInvestment, isLoading, fetchInvestment } = useInvestmentStore();

  const { investmentId } = route.params;

  useEffect(() => {
    fetchInvestment(investmentId);
  }, [fetchInvestment, investmentId]);

  const handleInvest = () => {
    if (selectedInvestment) {
      navigation.navigate('InvestmentAmount', { investmentId: selectedInvestment.id });
    }
  };

  if (isLoading || !selectedInvestment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading investment details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const normalizedRiskLevel = selectedInvestment.risk_level.toLowerCase() as keyof typeof RISK_LEVELS;
  const riskInfo = RISK_LEVELS[normalizedRiskLevel] || RISK_LEVELS.medium;
  const progressPercentage = (selectedInvestment.current_amount / selectedInvestment.target_amount) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {selectedInvestment.image_url && (
          <Image source={{ uri: selectedInvestment.image_url }} style={styles.investmentImage} />
        )}

        <View style={styles.header}>
          <Text style={styles.title}>{selectedInvestment.title}</Text>
          <View style={[styles.riskBadge, { backgroundColor: riskInfo.color + '20' }]}>
            <Text style={[styles.riskText, { color: riskInfo.color }]}>
              {riskInfo.label}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{selectedInvestment.description}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatPercentage(selectedInvestment.expected_return)}</Text>
            <Text style={styles.statLabel}>Expected Return</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{selectedInvestment.duration} months</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(selectedInvestment.min_amount)}</Text>
            <Text style={styles.statLabel}>Min Investment</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Funding Progress</Text>
            <Text style={styles.progressPercentage}>
              {formatPercentage(progressPercentage, 0)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progressPercentage, 100)}%` },
              ]}
            />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.progressText}>
              {formatCurrency(selectedInvestment.current_amount)} raised
            </Text>
            <Text style={styles.progressText}>
              of {formatCurrency(selectedInvestment.target_amount)}
            </Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Investment Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{selectedInvestment.category}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Risk Level:</Text>
            <Text style={styles.detailValue}>{riskInfo.label}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Investment Range:</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(selectedInvestment.min_amount)} - {formatCurrency(selectedInvestment.max_amount)}
            </Text>
          </View>

          {selectedInvestment.start_date && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Start Date:</Text>
              <Text style={styles.detailValue}>
                {formatDate(selectedInvestment.start_date)}
              </Text>
            </View>
          )}

          {selectedInvestment.end_date && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>End Date:</Text>
              <Text style={styles.detailValue}>
                {formatDate(selectedInvestment.end_date)}
              </Text>
            </View>
          )}

          {selectedInvestment.maturity_date && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Maturity Date:</Text>
              <Text style={styles.detailValue}>
                {formatDate(selectedInvestment.maturity_date)}
              </Text>
            </View>
          )}
        </View>

        {selectedInvestment.terms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <Text style={styles.sectionContent}>{selectedInvestment.terms}</Text>
          </View>
        )}

        {selectedInvestment.conditions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Conditions</Text>
            <Text style={styles.sectionContent}>{selectedInvestment.conditions}</Text>
          </View>
        )}

        {selectedInvestment.tags && selectedInvestment.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {selectedInvestment.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.investButton} onPress={handleInvest}>
          <Text style={styles.investButtonText}>Invest Now</Text>
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
  },
  investmentImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  riskBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  riskText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statCard: {
    backgroundColor: COLORS.gray100,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  progressSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  progressPercentage: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  detailsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
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
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionContent: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tagText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  investButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  investButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default InvestmentDetailsScreen;