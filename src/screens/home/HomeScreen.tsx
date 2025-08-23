import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SvgXml } from 'react-native-svg';
import { RootState, AppDispatch } from '../../store';
import { RootStackParamList } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/theme';
import { Icons } from '../../assets';
import Screen from '../../components/common/Screen';
import Card from '../../components/common/Card';
import { mockPortfolioApi } from '../../mock/api/portfolio';
import { mockInvestmentApi } from '../../mock/api/investments';
import { mockNotificationApi } from '../../mock/api/notifications';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [portfolioResponse, investmentsResponse, notificationsResponse] = await Promise.all([
        mockPortfolioApi.getPortfolio(),
        mockInvestmentApi.getInvestments(),
        mockNotificationApi.getNotifications({ limit: 5 }),
      ]);

      if (portfolioResponse.success) {
        setPortfolioData(portfolioResponse.data);
      }
      if (investmentsResponse.success) {
        setInvestments(investmentsResponse.data.slice(0, 3));
      }
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <Screen paddingHorizontal>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user?.first_name || 'User'}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <SvgXml xml={Icons.notification} width={24} height={24} fill={COLORS.textPrimary} />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notifications.filter(n => !n.isRead).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <SvgXml xml={Icons.search} width={20} height={20} fill={COLORS.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search investments..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <SvgXml xml={Icons.menuSquare} width={20} height={20} fill={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Portfolio Overview */}
        {portfolioData && (
          <Card style={styles.portfolioCard}>
            <View style={styles.portfolioHeader}>
              <Text style={styles.portfolioTitle}>Portfolio Overview</Text>
              <TouchableOpacity>
                <SvgXml xml={Icons.more} width={20} height={20} fill={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.portfolioStats}>
              <View style={styles.portfolioMainStat}>
                <Text style={styles.portfolioValue}>
                  {formatCurrency(portfolioData.totalValue)}
                </Text>
                <View style={styles.portfolioReturn}>
                  <SvgXml
                    xml={Icons.trendUp}
                    width={16}
                    height={16}
                    fill={portfolioData.returnPercentage >= 0 ? COLORS.positive : COLORS.negative}
                  />
                  <Text style={[
                    styles.portfolioReturnText,
                    { color: portfolioData.returnPercentage >= 0 ? COLORS.positive : COLORS.negative }
                  ]}>
                    {formatPercentage(portfolioData.returnPercentage)}
                  </Text>
                </View>
              </View>

              <View style={styles.portfolioSubStats}>
                <View style={styles.portfolioSubStat}>
                  <Text style={styles.portfolioSubStatValue}>
                    {formatCurrency(portfolioData.totalInvested)}
                  </Text>
                  <Text style={styles.portfolioSubStatLabel}>Total Invested</Text>
                </View>
                <View style={styles.portfolioSubStat}>
                  <Text style={styles.portfolioSubStatValue}>
                    {formatCurrency(portfolioData.totalReturn)}
                  </Text>
                  <Text style={styles.portfolioSubStatLabel}>Total Return</Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* Investment Categories */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {['Energy', 'Technology', 'Real Estate', 'Healthcare'].map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <View style={styles.categoryIcon}>
                  <SvgXml
                    xml={index === 0 ? Icons.cup : index === 1 ? Icons.diagram : index === 2 ? Icons.buildings : Icons.health}
                    width={24}
                    height={24}
                    fill={COLORS.primary}
                  />
                </View>
                <Text style={styles.categoryName}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Investments */}
        <View style={styles.investmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Investments</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {investments.map((investment, index) => (
            <Card key={investment.id} style={styles.investmentCard}>
              <View style={styles.investmentHeader}>
                <View style={styles.investmentInfo}>
                  <Text style={styles.investmentTitle}>{investment.title}</Text>
                  <Text style={styles.investmentCategory}>{investment.category}</Text>
                </View>
                <View style={styles.investmentReturn}>
                  <Text style={styles.investmentReturnText}>
                    {investment.expectedReturn}% APY
                  </Text>
                </View>
              </View>

              <View style={styles.investmentProgress}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(investment.totalRaised / investment.targetAmount) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {formatCurrency(investment.totalRaised)} of {formatCurrency(investment.targetAmount)}
                </Text>
              </View>

              <View style={styles.investmentFooter}>
                <Text style={styles.investmentMinAmount}>
                  Min: {formatCurrency(investment.minInvestment)}
                </Text>
                <Text style={styles.investmentInvestors}>
                  {investment.investorCount} investors
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
    paddingTop: SPACING.lg,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  userName: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
    gap: SPACING.lg,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    gap: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    padding: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portfolioCard: {
    marginBottom: SPACING.xxxl,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  portfolioTitle: {
    ...TYPOGRAPHY.h5,
    color: COLORS.textPrimary,
  },
  portfolioStats: {
    gap: SPACING.xl,
  },
  portfolioMainStat: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  portfolioValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  portfolioReturn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  portfolioReturnText: {
    ...TYPOGRAPHY.labelMedium,
    fontWeight: '600',
  },
  portfolioSubStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  portfolioSubStat: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  portfolioSubStatValue: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  portfolioSubStatLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  categoriesSection: {
    marginBottom: SPACING.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h5,
    color: COLORS.textPrimary,
  },
  seeAllText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.primary,
  },
  categoriesScroll: {
    marginHorizontal: -SPACING.xxxxl,
    paddingHorizontal: SPACING.xxxxl,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: SPACING.xl,
    gap: SPACING.lg,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textPrimary,
  },
  investmentsSection: {
    marginBottom: SPACING.xxxxxxl,
  },
  investmentCard: {
    marginBottom: SPACING.xl,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  investmentInfo: {
    flex: 1,
    marginRight: SPACING.lg,
  },
  investmentTitle: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  investmentCategory: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  investmentReturn: {
    backgroundColor: COLORS.secondaryLight10,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  investmentReturnText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  investmentProgress: {
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  investmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  investmentMinAmount: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  investmentInvestors: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;