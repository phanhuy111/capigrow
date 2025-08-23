import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/theme';
import { Icons } from '../../assets';
import Screen from '../../components/common/Screen';
import Card from '../../components/common/Card';
import { mockPortfolioApi } from '../../mock/api/portfolio';
import { formatDate } from '../../utils/helpers';



const PortfolioScreen: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [_performanceData, setPerformanceData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'investments'>('overview');

  useEffect(() => {
    loadPortfolioData();
  }, [loadPortfolioData]);

  const loadPortfolioData = useCallback(async () => {
    try {
      const [portfolioResponse, performanceResponse] = await Promise.all([
        mockPortfolioApi.getPortfolio(),
        mockPortfolioApi.getPerformance(selectedPeriod),
      ]);

      if (portfolioResponse.success) {
        setPortfolioData(portfolioResponse.data);
      }
      if (performanceResponse.success) {
        setPerformanceData(performanceResponse.data);
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    }
  }, [selectedPeriod]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPortfolioData();
    setRefreshing(false);
  };

  const formatCurrencyVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatPercentageValue = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return COLORS.success;
      case 'completed':
        return COLORS.info;
      case 'pending':
        return COLORS.warning;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.textTertiary;
    }
  };

  const renderInvestmentItem = (item: any) => {
    const returnAmount = item.currentValue - item.amount;
    const returnPercentage = item.amount > 0 ? (returnAmount / item.amount) * 100 : 0;
    const isPositive = returnAmount >= 0;

    return (
      <Card key={item.id} style={styles.investmentCard}>
        <View style={styles.investmentHeader}>
          <View style={styles.investmentInfo}>
            <Text style={styles.investmentTitle}>{item.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <SvgXml xml={Icons.more} width={20} height={20} fill={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.investmentStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Invested</Text>
            <Text style={styles.statValue}>{formatCurrencyVND(item.amount)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Current Value</Text>
            <Text style={styles.statValue}>{formatCurrencyVND(item.currentValue)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Return</Text>
            <Text style={[styles.statValue, { color: isPositive ? COLORS.positive : COLORS.negative }]}>
              {formatCurrencyVND(returnAmount)}
            </Text>
            <Text style={[styles.statSubValue, { color: isPositive ? COLORS.positive : COLORS.negative }]}>
              ({formatPercentageValue(returnPercentage)})
            </Text>
          </View>
        </View>

        <View style={styles.investmentFooter}>
          <Text style={styles.investmentDate}>
            Invested: {formatDate(item.investedAt)}
          </Text>
          {item.expectedMaturity && (
            <Text style={styles.maturityDate}>
              Maturity: {formatDate(item.expectedMaturity)}
            </Text>
          )}
        </View>
      </Card>
    );
  };

  if (!portfolioData) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading portfolio...</Text>
        </View>
      </Screen>
    );
  }

  const isPositiveReturn = portfolioData.totalReturn >= 0;

  return (
    <Screen paddingHorizontal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Portfolio</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <SvgXml xml={Icons.notification} width={24} height={24} fill={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Portfolio Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
            <TouchableOpacity>
              <SvgXml xml={Icons.more} width={20} height={20} fill={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.summaryMain}>
            <Text style={styles.summaryValue}>{formatCurrencyVND(portfolioData.totalValue)}</Text>
            <View style={styles.returnContainer}>
              <SvgXml
                xml={Icons.trendUp}
                width={16}
                height={16}
                fill={isPositiveReturn ? COLORS.positive : COLORS.negative}
              />
              <Text style={[styles.returnText, { color: isPositiveReturn ? COLORS.positive : COLORS.negative }]}>
                {formatCurrencyVND(portfolioData.totalReturn)}
              </Text>
              <Text style={[styles.returnPercentage, { color: isPositiveReturn ? COLORS.positive : COLORS.negative }]}>
                ({formatPercentageValue(portfolioData.returnPercentage)})
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatCurrencyVND(portfolioData.totalInvested)}</Text>
              <Text style={styles.statLabel}>Total Invested</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{portfolioData.activeInvestments}</Text>
              <Text style={styles.statLabel}>Active Investments</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{portfolioData.completedInvestments}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </Card>

        {/* Performance Period Selector */}
        <View style={styles.periodSelector}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.periodButtons}>
            {(['daily', 'monthly', 'yearly'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[styles.periodButton, selectedPeriod === period && styles.activePeriodButton]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[styles.periodButtonText, selectedPeriod === period && styles.activePeriodButtonText]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Performance Chart Placeholder */}
        <Card style={styles.chartCard}>
          <View style={styles.chartPlaceholder}>
            <SvgXml xml={Icons.chartSuccess} width={48} height={48} fill={COLORS.primary} />
            <Text style={styles.chartPlaceholderText}>Performance Chart</Text>
            <Text style={styles.chartPlaceholderSubtext}>
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} performance data
            </Text>
          </View>
        </Card>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'investments' && styles.activeTab]}
            onPress={() => setSelectedTab('investments')}
          >
            <Text style={[styles.tabText, selectedTab === 'investments' && styles.activeTabText]}>
              My Investments
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' ? (
          <View style={styles.overviewContent}>
            <View style={styles.quickStatsGrid}>
              <Card style={styles.quickStatCard}>
                <SvgXml xml={Icons.trendUp} width={24} height={24} fill={COLORS.positive} />
                <Text style={styles.quickStatValue}>+{formatPercentageValue(8.5)}</Text>
                <Text style={styles.quickStatLabel}>Best Performing</Text>
              </Card>
              <Card style={styles.quickStatCard}>
                <SvgXml xml={Icons.graph} width={24} height={24} fill={COLORS.primary} />
                <Text style={styles.quickStatValue}>{formatPercentageValue(portfolioData.returnPercentage)}</Text>
                <Text style={styles.quickStatLabel}>Average Return</Text>
              </Card>
              <Card style={styles.quickStatCard}>
                <SvgXml xml={Icons.shieldTick} width={24} height={24} fill={COLORS.warning} />
                <Text style={styles.quickStatValue}>Medium</Text>
                <Text style={styles.quickStatLabel}>Risk Level</Text>
              </Card>
              <Card style={styles.quickStatCard}>
                <SvgXml xml={Icons.timer} width={24} height={24} fill={COLORS.info} />
                <Text style={styles.quickStatValue}>24 months</Text>
                <Text style={styles.quickStatLabel}>Avg. Duration</Text>
              </Card>
            </View>
          </View>
        ) : (
          <View style={styles.investmentsContent}>
            {portfolioData.investments && portfolioData.investments.length > 0 ? (
              portfolioData.investments.map((investment: any) => renderInvestmentItem(investment))
            ) : (
              <View style={styles.emptyContainer}>
                <SvgXml xml={Icons.cup} width={60} height={60} fill={COLORS.textTertiary} />
                <Text style={styles.emptyTitle}>No Investments Yet</Text>
                <Text style={styles.emptyText}>
                  Start building your portfolio by exploring investment opportunities
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
    paddingTop: SPACING.lg,
  },
  screenTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    marginBottom: SPACING.xxxl,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  summaryLabel: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
  },
  summaryMain: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
    gap: SPACING.lg,
  },
  summaryValue: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
  },
  returnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  returnText: {
    ...TYPOGRAPHY.labelLarge,
    fontWeight: '600',
  },
  returnPercentage: {
    ...TYPOGRAPHY.labelMedium,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statValue: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  statLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h5,
    color: COLORS.textPrimary,
  },
  periodButtons: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
  },
  periodButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  activePeriodButton: {
    backgroundColor: COLORS.primary,
  },
  periodButtonText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
  },
  activePeriodButtonText: {
    color: COLORS.white,
  },
  chartCard: {
    marginBottom: SPACING.xxxl,
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxxl,
    gap: SPACING.lg,
  },
  chartPlaceholderText: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.textPrimary,
  },
  chartPlaceholderSubtext: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.white,
  },
  overviewContent: {
    paddingHorizontal: SPACING.lg,
  },
  performanceSection: {
    marginBottom: SPACING.lg,
  },
  performanceCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  performanceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  allocationSection: {
    marginBottom: SPACING.lg,
  },
  allocationCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  allocationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  investmentsContent: {
    paddingHorizontal: SPACING.lg,
  },
  investmentCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  investmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  investmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statSubValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  investmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
  },
  investmentDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  investmentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  moreButton: {
    padding: SPACING.sm,
  },
  maturityDate: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  quickStatCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  quickStatLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default PortfolioScreen;