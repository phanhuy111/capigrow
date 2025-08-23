import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SvgXml } from 'react-native-svg';
import { RootStackParamList } from '../../types';
import { RootState, AppDispatch } from '../../store';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/theme';
import { Icons } from '../../assets';
import Screen from '../../components/common/Screen';
import Card from '../../components/common/Card';
import { mockInvestmentApi } from '../../mock/api/investments';
import { formatCurrency, formatPercentage } from '../../utils/helpers';

const { width } = Dimensions.get('window');

type InvestmentsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const InvestmentsScreen: React.FC = () => {
  const navigation = useNavigation<InvestmentsScreenNavigationProp>();

  const [investments, setInvestments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      const [investmentsResponse, categoriesResponse] = await Promise.all([
        mockInvestmentApi.getInvestments(),
        mockInvestmentApi.getCategories(),
      ]);

      if (investmentsResponse.success) {
        setInvestments(investmentsResponse.data);
      }
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error('Error loading investments:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInvestments();
    setRefreshing(false);
  };

  const filteredInvestments = investments.filter((investment) => {
    const matchesSearch = investment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || investment.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesRisk = !selectedRiskLevel || investment.riskLevel.toLowerCase() === selectedRiskLevel.toLowerCase();
    return matchesSearch && matchesCategory && matchesRisk && investment.status === 'active';
  });

  const formatCurrencyVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return COLORS.success;
      case 'medium':
        return COLORS.warning;
      case 'high':
        return COLORS.error;
      default:
        return COLORS.textTertiary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'energy':
        return Icons.cup;
      case 'technology':
        return Icons.diagram;
      case 'real estate':
        return Icons.buildings;
      case 'healthcare':
        return Icons.health;
      case 'agriculture':
        return Icons.global;
      case 'finance':
        return Icons.bank;
      default:
        return Icons.cup;
    }
  };

  const renderInvestmentCard = (item: any) => {
    const progressPercentage = (item.totalRaised / item.targetAmount) * 100;
    const riskColor = getRiskColor(item.riskLevel);

    return (
      <Card key={item.id} style={styles.investmentCard}>
        <TouchableOpacity
          onPress={() => navigation.navigate('InvestmentDetails', { investmentId: item.id })}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.categoryIcon}>
                <SvgXml
                  xml={getCategoryIcon(item.category)}
                  width={20}
                  height={20}
                  fill={COLORS.primary}
                />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.investmentTitle}>{item.title}</Text>
                <Text style={styles.investmentCategory}>{item.category}</Text>
              </View>
            </View>
            <View style={[styles.riskBadge, { backgroundColor: riskColor + '20' }]}>
              <Text style={[styles.riskText, { color: riskColor }]}>
                {item.riskLevel.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.investmentDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.investmentStats}>
            <View style={styles.statItem}>
              <SvgXml xml={Icons.trendUp} width={16} height={16} fill={COLORS.positive} />
              <Text style={styles.statValue}>{item.expectedReturn}% APY</Text>
            </View>
            <View style={styles.statItem}>
              <SvgXml xml={Icons.timer} width={16} height={16} fill={COLORS.textSecondary} />
              <Text style={styles.statValue}>{item.duration} months</Text>
            </View>
            <View style={styles.statItem}>
              <SvgXml xml={Icons.emptyWallet} width={16} height={16} fill={COLORS.textSecondary} />
              <Text style={styles.statValue}>{formatCurrencyVND(item.minInvestment)}</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Funding Progress</Text>
              <Text style={styles.progressPercentage}>
                {Math.round(progressPercentage)}%
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
                {formatCurrencyVND(item.totalRaised)} raised
              </Text>
              <Text style={styles.progressText}>
                {item.investorCount} investors
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  const renderCategoryFilter = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryFilter,
        selectedCategory === category.name && styles.activeCategoryFilter,
      ]}
      onPress={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
    >
      <View style={[styles.categoryFilterIcon, { backgroundColor: category.color + '20' }]}>
        <SvgXml
          xml={getCategoryIcon(category.name)}
          width={20}
          height={20}
          fill={selectedCategory === category.name ? COLORS.white : category.color}
        />
      </View>
      <Text style={[
        styles.categoryFilterText,
        selectedCategory === category.name && styles.activeCategoryFilterText,
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderRiskFilter = (riskLevel: string) => (
    <TouchableOpacity
      key={riskLevel}
      style={[
        styles.riskFilter,
        selectedRiskLevel === riskLevel && styles.activeRiskFilter,
      ]}
      onPress={() => setSelectedRiskLevel(selectedRiskLevel === riskLevel ? '' : riskLevel)}
    >
      <Text style={[
        styles.riskFilterText,
        selectedRiskLevel === riskLevel && styles.activeRiskFilterText,
      ]}>
        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Screen paddingHorizontal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Explore</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <SvgXml xml={Icons.notification} width={24} height={24} fill={COLORS.textPrimary} />
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

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map(renderCategoryFilter)}
          </ScrollView>
        </View>

        {/* Risk Level Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Risk Level</Text>
          <View style={styles.riskFiltersContainer}>
            {['low', 'medium', 'high'].map(renderRiskFilter)}
          </View>
        </View>

        {/* Investment Results */}
        <View style={styles.resultsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {filteredInvestments.length} Investment{filteredInvestments.length !== 1 ? 's' : ''} Found
            </Text>
            <TouchableOpacity style={styles.sortButton}>
              <SvgXml xml={Icons.arrowDown} width={16} height={16} fill={COLORS.textSecondary} />
              <Text style={styles.sortText}>Sort</Text>
            </TouchableOpacity>
          </View>

          {filteredInvestments.length > 0 ? (
            filteredInvestments.map(renderInvestmentCard)
          ) : (
            <View style={styles.emptyContainer}>
              <SvgXml xml={Icons.cup} width={60} height={60} fill={COLORS.textTertiary} />
              <Text style={styles.emptyTitle}>No Investments Found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your search criteria or check back later for new opportunities.
              </Text>
            </View>
          )}
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
  categoryFilter: {
    alignItems: 'center',
    marginRight: SPACING.xl,
    gap: SPACING.lg,
  },
  activeCategoryFilter: {
    // Active state handled by icon background
  },
  categoryFilterIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryFilterText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textPrimary,
  },
  activeCategoryFilterText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  filtersSection: {
    marginBottom: SPACING.xxxl,
  },
  riskFiltersContainer: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  riskFilter: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeRiskFilter: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  riskFilterText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
  },
  activeRiskFilterText: {
    color: COLORS.white,
  },
  resultsSection: {
    marginBottom: SPACING.xxxxxxl,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sortText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
  },
  investmentCard: {
    marginBottom: SPACING.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.lg,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitleContainer: {
    flex: 1,
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
  riskBadge: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  riskText: {
    ...TYPOGRAPHY.labelSmall,
    fontWeight: '600',
  },
  investmentDescription: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  investmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statValue: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  progressContainer: {
    gap: SPACING.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  progressPercentage: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.primary,
    fontWeight: '600',
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
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxxxxl,
    gap: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h5,
    color: COLORS.textPrimary,
  },
  emptyText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});

export default InvestmentsScreen;