import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type React from "react";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Camera,
  Edit,
  Settings,
  HelpCircle,
  Shield,
  LogOut,
} from "lucide-react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, Card } from "@/components/ui";
import { Icon } from "@/components/ui/icon";
import { useUserProfileQuery } from "@/hooks/useUserQueries";
import { useAuthClientStore } from "@/store/authClientStore";
import type { RootStackParamList } from "@/types";
import { formatDate } from "@/utils/helpers";
import { COLORS } from "@/utils/theme";
import HeaderProfile from "./components/Header";
import Screen from "@/components/common/Screen";

type ProfileScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const { clearAuth } = useAuthClientStore();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { data: userProfile, isLoading } = useUserProfileQuery();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
    return userProfile?.is_verified
      ? "verified"
      : userProfile?.verification_status;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-gray-600">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const verificationStatus = getVerificationStatus();

  return (
    <Screen>
      {/* Header */}
      <HeaderProfile />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Section */}
        <View className="px-4 py-6 bg-white">
          <View className="items-center">
            {/* Avatar with Camera Button */}
            <View className="relative mb-4">
              <Avatar className="w-24 h-24" alt="Profile Avatar">
                <AvatarImage
                  source={{
                    uri:
                      userProfile?.profile_image_url ||
                      "https://via.placeholder.com/96x96?text=Avatar",
                  }}
                />
                <AvatarFallback className="bg-gray-200">
                  <Text className="text-gray-600 text-xl font-semibold">
                    {(userProfile?.first_name || "U").charAt(0).toUpperCase()}
                  </Text>
                </AvatarFallback>
              </Avatar>
              <TouchableOpacity
                onPress={handleEditProfile}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full items-center justify-center border-2 border-white"
              >
                <Icon as={Camera} size={16} className="text-white" />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <Text className="text-xl font-semibold text-gray-900 mb-1">
              {userProfile?.first_name} {userProfile?.last_name}
            </Text>
            <Text className="text-sm text-gray-500 mb-6">
              {userProfile?.email}
            </Text>
          </View>
        </View>

        {/* Basic Information Section */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Basic information
          </Text>

          <Card className="bg-white border border-gray-200 rounded-lg">
            <View className="p-4 space-y-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm font-medium text-gray-900">
                    Full name
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {userProfile?.first_name} {userProfile?.last_name}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleEditProfile}>
                  <Icon as={Edit} size={20} className="text-gray-400" />
                </TouchableOpacity>
              </View>

              <View className="h-px bg-gray-200" />

              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm font-medium text-gray-900">
                    Phone number
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {"Not updated"}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleEditProfile}>
                  <Icon as={Edit} size={20} className="text-gray-400" />
                </TouchableOpacity>
              </View>

              <View className="h-px bg-gray-200" />

              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm font-medium text-gray-900">
                    Date of birth
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {userProfile?.date_of_birth || "Not updated"}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleEditProfile}>
                  <Icon as={Edit} size={20} className="text-gray-400" />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </View>

        {/* Contact Details Section */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Contact details
          </Text>

          <Card className="bg-white border border-gray-200 rounded-lg">
            <View className="p-4 space-y-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm font-medium text-gray-900">
                    Email
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {userProfile?.email}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleEditProfile}>
                  <Icon as={Edit} size={20} className="text-gray-400" />
                </TouchableOpacity>
              </View>

              <View className="h-px bg-gray-200" />

              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm font-medium text-gray-900">
                    Address
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {"Not updated"}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleEditProfile}>
                  <Icon as={Edit} size={20} className="text-gray-400" />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </View>

        {/* Settings Section */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Settings
          </Text>

          <Card className="bg-white border border-gray-200 rounded-lg">
            <View className="p-4 space-y-4">
              <TouchableOpacity
                onPress={handleNotificationSettings}
                className="flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                    <Icon as={Settings} size={16} className="text-blue-600" />
                  </View>
                  <Text className="text-sm font-medium text-gray-900">
                    Notification settings
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#f3f4f6", true: "#3b82f6" }}
                  thumbColor="#ffffff"
                />
              </TouchableOpacity>

              <View className="h-px bg-gray-200" />

              <TouchableOpacity
                onPress={handleSupport}
                className="flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                    <Icon as={Shield} size={16} className="text-green-600" />
                  </View>
                  <Text className="text-sm font-medium text-gray-900">
                    Privacy policy
                  </Text>
                </View>
                <Icon
                  as={ArrowLeft}
                  size={16}
                  className="text-gray-400 rotate-180"
                />
              </TouchableOpacity>

              <View className="h-px bg-gray-200" />

              <TouchableOpacity
                onPress={handleSupport}
                className="flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
                    <Icon
                      as={HelpCircle}
                      size={16}
                      className="text-orange-600"
                    />
                  </View>
                  <Text className="text-sm font-medium text-gray-900">
                    Help center
                  </Text>
                </View>
                <Icon
                  as={ArrowLeft}
                  size={16}
                  className="text-gray-400 rotate-180"
                />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Logout Section */}
        <View className="px-4 py-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center py-4 bg-red-50 rounded-lg border border-red-200"
          >
            <Icon as={LogOut} size={20} className="text-red-600 mr-2" />
            <Text className="text-red-600 font-medium">Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ProfileScreen;
