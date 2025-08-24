import type React from "react";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTransactionsQuery } from "@/hooks/useTransactionQueries";
import type { Transaction } from "@/services/transactionService";
import { TRANSACTION_STATUS } from "@/utils/constants";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { COLORS } from "@/utils/theme";

const TransactionsScreen: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const { data: transactions = [], isLoading, refetch } = useTransactionsQuery();

  const onRefresh = async () => {
    await refetch();
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "investment":
        return "trending-up";
      case "withdrawal":
        return "trending-down";
      case "dividend":
        return "attach-money";
      case "fee":
        return "receipt";
      default:
        return "swap-horiz";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "investment":
        return COLORS.primary;
      case "withdrawal":
        return COLORS.error;
      case "dividend":
        return COLORS.success;
      case "fee":
        return COLORS.warning;
      default:
        return COLORS.gray500;
    }
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const statusInfo = TRANSACTION_STATUS[item.status as keyof typeof TRANSACTION_STATUS];
    const transactionColor = getTransactionColor(item.type);
    const isDebit = item.type === "withdrawal" || item.type === "fee";

    return (
      <TouchableOpacity className="bg-white rounded-lg p-6 mb-4 flex-row justify-between items-center shadow-sm">
        <View className="flex-row items-center flex-1">
          <View
            className="w-12 h-12 rounded-full justify-center items-center mr-4"
            style={{ backgroundColor: `${transactionColor}20` }}
          >
            <Icon name={getTransactionIcon(item.type)} size={24} color={transactionColor} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-1">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              {formatDate(item.createdAt, "short")}
            </Text>
            {item.description && (
              <Text className="text-xs text-gray-600" numberOfLines={1}>
                {item.description}
              </Text>
            )}
          </View>
        </View>

        <View className="items-end">
          <Text
            className="text-base font-bold mb-1"
            style={{ color: isDebit ? COLORS.error : COLORS.success }}
          >
            {isDebit ? "-" : "+"}
            {formatCurrency(item.amount)}
          </Text>
          <View className="px-3 py-1 rounded" style={{ backgroundColor: `${statusInfo.color}20` }}>
            <Text className="text-xs font-semibold" style={{ color: statusInfo.color }}>
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
      className={`border border-gray-300 rounded px-4 py-2 mr-2 mb-2 ${
        filter === filterType ? "bg-blue-600 border-blue-600" : ""
      }`}
      onPress={() => setFilter(filterType)}
    >
      <Text
        className={`text-sm font-medium ${filter === filterType ? "text-white" : "text-gray-600"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="mt-4 text-base text-gray-600">Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-6 pb-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Transaction History</Text>

        <View className="mb-2">
          <View className="flex-row flex-wrap">
            {renderFilterButton("all", "All")}
            {renderFilterButton("investment", "Investments")}
            {renderFilterButton("withdrawal", "Withdrawals")}
            {renderFilterButton("dividend", "Dividends")}
          </View>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        className="px-6 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-16">
            <Icon name="receipt-long" size={60} color={COLORS.gray400} />
            <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">No Transactions</Text>
            <Text className="text-sm text-gray-600 text-center px-6">
              {filter === "all"
                ? "Your transaction history will appear here"
                : `No ${filter} transactions found`}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default TransactionsScreen;
