import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type React from "react";
import { useState } from "react";
import { Alert, Image, ScrollView, Switch, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { Icons } from "@/assets";
import Screen from "@/components/common/Screen";
import { Button, Card } from "@/components/ui";
import { useUserProfileQuery } from "@/hooks/useUserQueries";
import { useAuthClientStore } from "@/store/authClientStore";
import type { RootStackParamList } from "@/types";
import { formatDate } from "@/utils/helpers";
import { COLORS } from "@/utils/theme";

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const { clearAuth } = useAuthClientStore();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { data: userProfile } = useUserProfileQuery();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => clearAuth() },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing feature coming soon!");
  };

  const handleChangePassword = () => {
    Alert.alert("Change Password", "Password change feature coming soon!");
  };

  const handleVerification = () => {
    navigation.navigate("IdentityVerification");
  };

  const handleBankAccount = () => {
    Alert.alert("Bank Account", "Bank account management coming soon!");
  };

  const handleNotificationSettings = () => {
    Alert.alert("Notifications", "Notification settings coming soon!");
  };

  const handleLanguageSettings = () => {
    Alert.alert("Language", "Language settings coming soon!");
  };

  const handleSecurity = () => {
    Alert.alert("Security", "Security settings coming soon!");
  };

  const handleSupport = () => {
    Alert.alert("Support", "Support center coming soon!");
  };

  const getVerificationStatus = () => {
    if (!userProfile) return "pending";
    return userProfile.is_verified ? "verified" : userProfile.verification_status;
  };

  if (!userProfile) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-gray-600">Loading profile...</Text>
        </View>
      </Screen>
    );
  }

  const verificationStatus = getVerificationStatus();
  const isVerified = verificationStatus === "verified";

  return (
    <Screen paddingHorizontal>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8 pt-4">
          <Text className="text-2xl font-semibold text-gray-900">Profile</Text>
          <Button variant="ghost" size="icon" onPress={handleNotificationSettings}>
            <SvgXml xml={Icons.menuSquare} width={24} height={24} fill={COLORS.textPrimary} />
          </Button>
        </View>

        {/* Profile Card */}
        <Card className="mb-8">
          <View className="flex-row items-center gap-6">
            <View className="relative">
              {userProfile.profile_image_url ? (
                <Image
                  source={{ uri: userProfile.profile_image_url }}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <View className="w-20 h-20 rounded-full bg-blue-600 justify-center items-center">
                  <SvgXml xml={Icons.user} width={32} height={32} fill={COLORS.white} />
                </View>
              )}
              <Button variant="ghost" size="icon">
                <SvgXml xml={Icons.camera} width={16} height={16} fill={COLORS.white} />
              </Button>
            </View>

            <View className="flex-1 gap-2">
              <Text className="text-xl font-semibold text-gray-900">
                {userProfile.first_name} {userProfile.last_name}
              </Text>
              <Text className="text-base text-gray-600">{userProfile.email}</Text>
              <View className="flex-row items-center gap-2">
                <SvgXml
                  xml={isVerified ? Icons.shieldTickBold : Icons.warning}
                  width={16}
                  height={16}
                  fill={isVerified ? COLORS.success : COLORS.warning}
                />
                <Text
                  style={[
                    { fontSize: 12, fontWeight: "500" },
                    { color: isVerified ? COLORS.success : COLORS.warning },
                  ]}
                >
                  {isVerified ? "Verified Account" : "Verification Pending"}
                </Text>
              </View>
            </View>

            <Button variant="ghost" size="icon" onPress={handleEditProfile}>
              <SvgXml xml={Icons.edit} width={20} height={20} fill={COLORS.textSecondary} />
            </Button>
          </View>
        </Card>

        {/* Quick Stats */}
        <View className="flex-row gap-4 mb-8">
          <Card className="flex-1 items-center gap-4 py-6">
            <SvgXml xml={Icons.emptyWallet} width={24} height={24} fill={COLORS.primary} />
            <Text className="text-lg font-semibold text-gray-900">125M VND</Text>
            <Text className="text-sm text-gray-600 text-center">Total Invested</Text>
          </Card>
          <Card className="flex-1 items-center gap-4 py-6">
            <SvgXml xml={Icons.trendUp} width={24} height={24} fill={COLORS.positive} />
            <Text className="text-lg font-semibold text-gray-900">+25%</Text>
            <Text className="text-sm text-gray-600 text-center">Total Return</Text>
          </Card>
        </View>

        {/* Account Management */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-900 mb-6">Account Management</Text>

          <Card className="py-2">
            <Button variant="ghost" onPress={handleEditProfile}>
              <View className="flex-row items-center flex-1 gap-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
                  <SvgXml xml={Icons.user} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text className="text-base font-medium text-gray-900">Personal Information</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>

            <Button variant="ghost" onPress={handleBankAccount}>
              <View className="flex-row items-center flex-1 gap-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
                  <SvgXml xml={Icons.bank} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text className="text-base font-medium text-gray-900">Bank Account</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>

            <Button variant="ghost" onPress={handleVerification}>
              <View className="flex-row items-center flex-1 gap-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
                  <SvgXml xml={Icons.shieldTick} width={20} height={20} fill={COLORS.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-900">Identity Verification</Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <SvgXml
                      xml={isVerified ? Icons.tick : Icons.warning}
                      width={12}
                      height={12}
                      fill={isVerified ? COLORS.success : COLORS.warning}
                    />
                    <Text
                      style={[
                        { fontSize: 11, fontWeight: "500" },
                        { color: isVerified ? COLORS.success : COLORS.warning },
                      ]}
                    >
                      {isVerified ? "Verified" : "Pending"}
                    </Text>
                  </View>
                </View>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>

            <Button variant="ghost" onPress={handleChangePassword}>
              <View className="flex-row items-center flex-1 gap-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
                  <SvgXml xml={Icons.lock} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text className="text-base font-medium text-gray-900">Change Password</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>
          </Card>
        </View>

        {/* Settings */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-900 mb-6">Settings</Text>

          <Card className="py-2">
            <Button variant="ghost" onPress={handleNotificationSettings}>
              <View className="flex-row items-center flex-1 gap-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
                  <SvgXml xml={Icons.notification} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text className="text-base font-medium text-gray-900">Notifications</Text>
              </View>
              <View className="flex-row items-center gap-4">
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: COLORS.gray300, true: `${COLORS.primary}30` }}
                  thumbColor={notificationsEnabled ? COLORS.primary : COLORS.gray400}
                />
              </View>
            </Button>

            <Button variant="ghost" onPress={handleLanguageSettings}>
              <View className="flex-row items-center flex-1 gap-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
                  <SvgXml xml={Icons.global} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text className="text-base font-medium text-gray-900">Language</Text>
              </View>
              <View className="flex-row items-center gap-4">
                <Text className="text-base text-gray-600">English</Text>
                <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
              </View>
            </Button>

            <Button variant="ghost" onPress={handleSecurity}>
              <View className="flex-row items-center flex-1 gap-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
                  <SvgXml xml={Icons.lockBold} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text className="text-base font-medium text-gray-900">Security</Text>
              </View>
              <View className="flex-row items-center gap-4">
                <Switch
                  value={biometricEnabled}
                  onValueChange={setBiometricEnabled}
                  trackColor={{ false: COLORS.gray300, true: `${COLORS.primary}30` }}
                  thumbColor={biometricEnabled ? COLORS.primary : COLORS.gray400}
                />
              </View>
            </Button>
          </Card>
        </View>

        {/* Support */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-900 mb-6">Support</Text>

          <Card className="py-2">
            <Button
              variant="ghost"
              onPress={handleSupport}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 16,
              }}
            >
              <View className="flex-row items-center flex-1 gap-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
                  <SvgXml xml={Icons.infoCircle} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text className="text-base font-medium text-gray-900">Help Center</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>

            <Button
              variant="ghost"
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 16,
              }}
            >
              <View className="flex-row items-center flex-1 gap-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
                  <SvgXml xml={Icons.note} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text className="text-base font-medium text-gray-900">Terms & Conditions</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>

            <Button
              variant="ghost"
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 16,
              }}
            >
              <View className="flex-row items-center flex-1 gap-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
                  <SvgXml xml={Icons.shieldTick} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text className="text-base font-medium text-gray-900">Privacy Policy</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>

            <Button
              variant="ghost"
              onPress={() => navigation.navigate("BottomSheetDemo")}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 16,
              }}
            >
              <View className="flex-row items-center flex-1 gap-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center">
                  <SvgXml xml={Icons.note} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text className="text-base font-medium text-gray-900">Bottom Sheet Demo</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>
          </Card>
        </View>

        {/* App Info */}
        <View className="items-center py-8 gap-2">
          <Text className="text-sm text-gray-400 text-center">CapiGrow v1.0.0</Text>
          <Text className="text-sm text-gray-400 text-center">
            Member since {formatDate(userProfile.created_at, "short")}
          </Text>
        </View>

        {/* Logout Button */}
        <Button variant="destructive" onPress={handleLogout}>
          <SvgXml xml={Icons.logout} width={24} height={24} fill={COLORS.error} />
          <Text className="text-base font-semibold text-red-600">Logout</Text>
        </Button>
      </ScrollView>
    </Screen>
  );
};

export default ProfileScreen;
