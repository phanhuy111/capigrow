import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '@/types';
import { COLORS } from '@/utils/theme';
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16 }}>
        <View className="items-center mt-6 mb-6">
          <View className="mb-4">
            <Icon name="check-circle" size={80} color={COLORS.success} />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-1 text-center">
            Payment Successful!
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            Your investment has been processed successfully
          </Text>
        </View>

        <View className="bg-gray-100 p-4 rounded-md mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Transaction Details</Text>

          <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
            <Text className="text-sm text-gray-600 flex-1">Investment:</Text>
            <Text className="text-sm text-gray-900 font-medium flex-1 text-right">
              {transaction.investment_title}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
            <Text className="text-sm text-gray-600 flex-1">Amount:</Text>
            <Text 
              className="text-base font-bold flex-1 text-right"
              style={{ color: COLORS.primary }}
            >
              {formatCurrency(transaction.amount)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
            <Text className="text-sm text-gray-600 flex-1">Payment Method:</Text>
            <Text className="text-sm text-gray-900 font-medium flex-1 text-right">
              {transaction.payment_method}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
            <Text className="text-sm text-gray-600 flex-1">Reference Number:</Text>
            <Text className="text-sm text-gray-900 font-medium flex-1 text-right">
              {transaction.reference_number}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
            <Text className="text-sm text-gray-600 flex-1">Date & Time:</Text>
            <Text className="text-sm text-gray-900 font-medium flex-1 text-right">
              {formatDate(transaction.created_at, 'long')}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-2">
            <Text className="text-sm text-gray-600 flex-1">Status:</Text>
            <View className="flex-row items-center flex-1 justify-end">
              <Icon name="check-circle" size={16} color={COLORS.success} />
              <Text 
                className="text-sm font-medium ml-1"
                style={{ color: COLORS.success }}
              >
                Completed
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <View 
            className="flex-row p-4 rounded-md border-l-4"
            style={{ backgroundColor: COLORS.info + '10', borderLeftColor: COLORS.info }}
          >
            <Icon name="info" size={24} color={COLORS.info} />
            <View className="flex-1 ml-2">
              <Text className="text-sm font-semibold text-gray-900 mb-1">What's Next?</Text>
              <Text className="text-sm text-gray-600 leading-5">
                Your investment will be processed within {transaction.estimated_completion}.
                You'll receive a confirmation email and can track your investment in the Portfolio section.
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <TouchableOpacity 
            className="py-4 rounded-md items-center mb-4"
            style={{ backgroundColor: COLORS.primary }}
            onPress={handleViewTransaction}
          >
            <Text className="text-white text-base font-semibold">View Portfolio</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="border py-4 rounded-md items-center"
            style={{ borderColor: COLORS.primary }}
            onPress={handleNewInvestment}
          >
            <Text className="text-base font-semibold" style={{ color: COLORS.primary }}>
              Explore More Investments
            </Text>
          </TouchableOpacity>
        </View>

        <View className="items-center pb-6">
          <Text className="text-sm text-gray-600 mb-2">
            Need help? Contact our support team
          </Text>
          <TouchableOpacity className="flex-row items-center">
            <Icon name="support-agent" size={16} color={COLORS.primary} />
            <Text 
              className="text-sm font-medium ml-1"
              style={{ color: COLORS.primary }}
            >
              Get Support
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



export default PaymentConfirmationScreen;