import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTransactionStore } from '../../store';
import { Transaction } from '../../types';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, TRANSACTION_STATUS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/helpers';

const TransactionsScreen: React.FC = () => {
  const { transactions, isLoading, fetchTransactions } = useTransactionStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const filteredTransactions = (transactions || []).filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'investment':
        return 'trending-up';
      case 'withdrawal':
        return 'trending-down';
      case 'dividend':
        return 'attach-money';
      case 'fee':
        return 'receipt';
      default:
        return 'swap-horiz';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'investment':
        return COLORS.primary;
      case 'withdrawal':
        return COLORS.error;
      case 'dividend':
        return COLORS.success;
      case 'fee':
        return COLORS.warning;
      default:
        return COLORS.gray500;
    }
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const statusInfo = TRANSACTION_STATUS[item.status as keyof typeof TRANSACTION_STATUS];
    const transactionColor = getTransactionColor(item.type);
    const isDebit = item.type === 'withdrawal' || item.type === 'fee';

    return (
      <TouchableOpacity style={styles.transactionCard}>
        <View style={styles.transactionLeft}>
          <View style={[styles.iconContainer, { backgroundColor: transactionColor + '20' }]}>
            <Icon
              name={getTransactionIcon(item.type)}
              size={24}
              color={transactionColor}
            />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionType}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
            <Text style={styles.transactionDate}>
              {formatDate(item.created_at, 'short')}
            </Text>
            {item.description && (
              <Text style={styles.transactionDescription} numberOfLines={1}>
                {item.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.transactionRight}>
          <Text style={[
            styles.transactionAmount,
            { color: isDebit ? COLORS.error : COLORS.success }
          ]}>
            {isDebit ? '-' : '+'}{formatCurrency(item.amount)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (filterType: string, label: string) => (
    <TouchableOpacity
      key={filterType}
      style={[
        styles.filterButton,
        filter === filterType && styles.activeFilterButton,
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === filterType && styles.activeFilterButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Transaction History</Text>

        <View style={styles.filtersContainer}>
          <View style={styles.filtersRow}>
            {renderFilterButton('all', 'All')}
            {renderFilterButton('investment', 'Investments')}
            {renderFilterButton('withdrawal', 'Withdrawals')}
            {renderFilterButton('dividend', 'Dividends')}
          </View>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="receipt-long" size={60} color={COLORS.gray400} />
            <Text style={styles.emptyTitle}>No Transactions</Text>
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'Your transaction history will appear here'
                : `No ${filter} transactions found`}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  screenTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  filtersContainer: {
    marginBottom: SPACING.sm,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: COLORS.white,
  },
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  transactionCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  transactionDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  transactionDescription: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
});

export default TransactionsScreen;