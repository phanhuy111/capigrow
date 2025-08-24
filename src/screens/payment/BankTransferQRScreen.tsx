import { type RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type React from "react";
import { useState } from "react";
import { Alert, Clipboard, ScrollView, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import type { RootStackParamList } from "@/types";
import { formatCurrency, generateQRData } from "@/utils/helpers";
import { COLORS } from "@/utils/theme";

type BankTransferQRScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BankTransferQR"
>;
type BankTransferQRScreenRouteProp = RouteProp<RootStackParamList, "BankTransferQR">;

const BankTransferQRScreen: React.FC = () => {
  const navigation = useNavigation<BankTransferQRScreenNavigationProp>();
  const route = useRoute<BankTransferQRScreenRouteProp>();
  const [qrSize, _setQrSize] = useState(200);

  const { transactionId } = route.params;

  // Mock transaction data - in real app, this would come from API
  const transaction = {
    id: transactionId,
    amount: 5000,
    reference_number: `TXN-${Date.now().toString().slice(-8)}`,
    bank_details: {
      bank_name: "Capigrow Bank",
      account_name: "Capigrow Investment Ltd",
      account_number: "1234567890",
      routing_number: "021000021",
      swift_code: "CAPIUS33",
    },
    payment_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  };

  const qrData = generateQRData({
    type: "bank_transfer",
    amount: transaction.amount,
    reference: transaction.reference_number,
    account: transaction.bank_details.account_number,
    bank: transaction.bank_details.bank_name,
  });

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert("Copied!", `${label} copied to clipboard`);
  };

  const handlePaymentComplete = () => {
    navigation.navigate("PaymentProcessing", { transactionId });
  };

  const handleCancel = () => {
    Alert.alert("Cancel Payment", "Are you sure you want to cancel this payment?", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16 }}>
        <View className="mt-4 mb-6 items-center">
          <Text className="text-2xl font-bold text-gray-900 mb-1 text-center">
            Bank Transfer Payment
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            Complete your payment using the QR code or bank details below
          </Text>
        </View>

        <View
          className="p-4 rounded-md items-center mb-6 border-l-4"
          style={{
            backgroundColor: `${COLORS.primary}10`,
            borderLeftColor: COLORS.primary,
          }}
        >
          <Text className="text-sm text-gray-600 mb-1">Amount to Transfer</Text>
          <Text className="text-4xl font-bold mb-2" style={{ color: COLORS.primary }}>
            {formatCurrency(transaction.amount)}
          </Text>
          <Text className="text-sm text-gray-600 font-medium">
            Reference: {transaction.reference_number}
          </Text>
        </View>

        <View className="items-center mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Scan QR Code</Text>
          <View className="bg-white p-4 rounded-md shadow-md mb-4">
            <QRCode
              value={qrData}
              size={qrSize}
              color={COLORS.textPrimary}
              backgroundColor={COLORS.white}
            />
          </View>
          <Text className="text-sm text-gray-600 text-center">
            Scan with your banking app to auto-fill transfer details
          </Text>
        </View>

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="text-sm text-gray-600 mx-4 font-medium">OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Bank Transfer Details</Text>

          <View className="bg-gray-100 p-4 rounded-md">
            <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
              <Text className="text-sm text-gray-600 flex-1">Bank Name:</Text>
              <View className="flex-row items-center flex-2 justify-end">
                <Text className="text-sm text-gray-900 font-medium mr-2 text-right">
                  {transaction.bank_details.bank_name}
                </Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(transaction.bank_details.bank_name, "Bank name")}
                >
                  <Icon name="content-copy" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
              <Text className="text-sm text-gray-600 flex-1">Account Name:</Text>
              <View className="flex-row items-center flex-2 justify-end">
                <Text className="text-sm text-gray-900 font-medium mr-2 text-right">
                  {transaction.bank_details.account_name}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(transaction.bank_details.account_name, "Account name")
                  }
                >
                  <Icon name="content-copy" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
              <Text className="text-sm text-gray-600 flex-1">Account Number:</Text>
              <View className="flex-row items-center flex-2 justify-end">
                <Text className="text-sm text-gray-900 font-medium mr-2 text-right">
                  {transaction.bank_details.account_number}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(transaction.bank_details.account_number, "Account number")
                  }
                >
                  <Icon name="content-copy" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
              <Text className="text-sm text-gray-600 flex-1">Routing Number:</Text>
              <View className="flex-row items-center flex-2 justify-end">
                <Text className="text-sm text-gray-900 font-medium mr-2 text-right">
                  {transaction.bank_details.routing_number}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(transaction.bank_details.routing_number, "Routing number")
                  }
                >
                  <Icon name="content-copy" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-gray-600 flex-1">Reference:</Text>
              <View className="flex-row items-center flex-2 justify-end">
                <Text
                  className="text-sm font-bold mr-2 text-right"
                  style={{ color: COLORS.primary }}
                >
                  {transaction.reference_number}
                </Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(transaction.reference_number, "Reference number")}
                >
                  <Icon name="content-copy" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View
          className="flex-row p-4 rounded-md border-l-4 mb-6"
          style={{
            backgroundColor: `${COLORS.warning}10`,
            borderLeftColor: COLORS.warning,
          }}
        >
          <Icon name="warning" size={24} color={COLORS.warning} />
          <View className="flex-1 ml-2">
            <Text className="text-sm font-semibold text-gray-900 mb-1">Important Notes:</Text>
            <Text className="text-sm text-gray-600 mb-1">
              • Include the reference number in your transfer
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              • Transfer the exact amount shown above
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              • Payment must be completed within 24 hours
            </Text>
          </View>
        </View>

        <View className="pb-6">
          <TouchableOpacity
            className="py-4 rounded-md items-center mb-4"
            style={{ backgroundColor: COLORS.success }}
            onPress={handlePaymentComplete}
          >
            <Text className="text-white text-base font-semibold">I've Completed the Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border py-4 rounded-md items-center"
            style={{ borderColor: COLORS.error }}
            onPress={handleCancel}
          >
            <Text className="text-base font-semibold" style={{ color: COLORS.error }}>
              Cancel Payment
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BankTransferQRScreen;
