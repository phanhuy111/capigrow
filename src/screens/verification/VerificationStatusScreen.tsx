import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { VerificationStatus } from '@/services/verificationService';
import { useVerificationStatusQuery } from '@/hooks/useVerificationQueries';
import { COLORS } from '@/utils/theme';
import { VERIFICATION_STATUS } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';

type VerificationStatusScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationStatus'
>;

const VerificationStatusScreen: React.FC = () => {
  const navigation = useNavigation<VerificationStatusScreenNavigationProp>();
  const { data: verification, isLoading } = useVerificationStatusQuery();

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

    const statusKey = verification.overall as keyof typeof VERIFICATION_STATUS;
    const statusInfo = VERIFICATION_STATUS[statusKey];

    const icons = {
      pending: '⏳',
      under_review: '👀',
      approved: '✅',
      rejected: '❌',
    };

    return {
      status: verification.overall,
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
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="mt-4 text-base text-gray-600">
            Loading verification status...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16 }}>
        <View className="items-center mt-6 mb-6">
          <View 
            className="w-24 h-24 rounded-full justify-center items-center mb-4"
            style={{ backgroundColor: statusInfo.color + '20' }}
          >
            <Text className="text-5xl">{statusInfo.icon}</Text>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {statusInfo.title}
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            {statusInfo.description}
          </Text>
        </View>

        {verification && (
          <View className="bg-gray-100 p-4 rounded-md mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Verification Details
            </Text>

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600 flex-1">Completed Steps:</Text>
              <Text className="text-sm text-gray-900 font-medium flex-2 text-right">
                {verification.completedSteps} of {verification.totalSteps}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600 flex-1">Last Updated:</Text>
              <Text className="text-sm text-gray-900 font-medium flex-2 text-right">
                {formatDate(verification.lastUpdated, 'long')}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600 flex-1">Status:</Text>
              <View 
                className="px-2 py-1 rounded"
                style={{ backgroundColor: statusInfo.color + '20' }}
              >
                <Text 
                  className="text-xs font-semibold"
                  style={{ color: statusInfo.color }}
                >
                  {statusInfo.title}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600 flex-1">Identity:</Text>
              <Text className="text-sm text-gray-900 font-medium flex-2 text-right">
                {verification.identity.replace('_', ' ').toUpperCase()}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600 flex-1">Address:</Text>
              <Text className="text-sm text-gray-900 font-medium flex-2 text-right">
                {verification.address.replace('_', ' ').toUpperCase()}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600 flex-1">Selfie:</Text>
              <Text className="text-sm text-gray-900 font-medium flex-2 text-right">
                {verification.selfie.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        <View className="flex-1 justify-end pb-6">
          {verification?.overall === 'rejected' && (
            <TouchableOpacity 
              className="bg-blue-600 py-4 rounded-md items-center" 
              onPress={handleRetryVerification}
            >
              <Text className="text-white text-base font-semibold">
                Retry Verification
              </Text>
            </TouchableOpacity>
          )}

          {verification?.overall === 'approved' && (
            <TouchableOpacity 
              className="bg-green-600 py-4 rounded-md items-center" 
              onPress={handleGoHome}
            >
              <Text className="text-white text-base font-semibold">
                Continue to App
              </Text>
            </TouchableOpacity>
          )}

          {(!verification || verification.overall === 'pending' || verification.overall === 'under_review') && (
            <View className="items-center">
              <Text className="text-sm text-gray-600 text-center leading-5 mb-4">
                We'll notify you once your verification is complete. This usually takes 1-2 business days.
              </Text>
              <TouchableOpacity 
                className="bg-gray-600 py-4 px-6 rounded-md items-center" 
                onPress={handleGoHome}
              >
                <Text className="text-white text-base font-semibold">
                  Go to Home
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



export default VerificationStatusScreen;