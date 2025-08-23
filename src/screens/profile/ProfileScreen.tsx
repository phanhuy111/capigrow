import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SvgXml } from 'react-native-svg';
import { RootStackParamList } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/utils/theme';
import { Icons } from '@/assets';
import Screen from '@/components/common/Screen';
import { Card, Button } from '@/components/ui';
import { mockUserApi } from '@/mock/api/user';
import { formatDate } from '@/utils/helpers';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const { logoutUser } = useAuthStore();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [userProfile, setUserProfile] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await mockUserApi.getProfile();
      if (response.success) {
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => logoutUser() },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature coming soon!');
  };

  const handleVerification = () => {
    navigation.navigate('IdentityVerification');
  };

  const handleBankAccount = () => {
    Alert.alert('Bank Account', 'Bank account management coming soon!');
  };

  const handleNotificationSettings = () => {
    Alert.alert('Notifications', 'Notification settings coming soon!');
  };

  const handleLanguageSettings = () => {
    Alert.alert('Language', 'Language settings coming soon!');
  };

  const handleSecurity = () => {
    Alert.alert('Security', 'Security settings coming soon!');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Support center coming soon!');
  };

  const getVerificationStatus = () => {
    if (!userProfile?.verification) return 'pending';

    const { identity, bank, selfie } = userProfile.verification;
    if (identity.status === 'approved' && bank.status === 'approved' && selfie.status === 'approved') {
      return 'verified';
    }
    return 'pending';
  };

  if (!userProfile) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </Screen>
    );
  }

  const verificationStatus = getVerificationStatus();
  const isVerified = verificationStatus === 'verified';

  return (
    <Screen paddingHorizontal>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Profile</Text>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-11 h-11 rounded-full bg-gray-100" 
            onPress={handleNotificationSettings}
          >
            <SvgXml xml={Icons.menuSquare} width={24} height={24} fill={COLORS.textPrimary} />
          </Button>
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {userProfile.avatar ? (
                <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <SvgXml xml={Icons.user} width={32} height={32} fill={COLORS.white} />
                </View>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-purple-600 border-2 border-white"
              >
                <SvgXml xml={Icons.camera} width={16} height={16} fill={COLORS.white} />
              </Button>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.userName}>
                {userProfile.firstName} {userProfile.lastName}
              </Text>
              <Text style={styles.userEmail}>{userProfile.email}</Text>
              <View style={styles.verificationBadge}>
                <SvgXml
                  xml={isVerified ? Icons.shieldTickBold : Icons.warning}
                  width={16}
                  height={16}
                  fill={isVerified ? COLORS.success : COLORS.warning}
                />
                <Text style={[styles.verificationText, { color: isVerified ? COLORS.success : COLORS.warning }]}>
                  {isVerified ? 'Verified Account' : 'Verification Pending'}
                </Text>
              </View>
            </View>

            <Button 
              variant="ghost" 
              size="icon" 
              className="p-2" 
              onPress={handleEditProfile}
            >
              <SvgXml xml={Icons.edit} width={20} height={20} fill={COLORS.textSecondary} />
            </Button>
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.quickStatsContainer}>
          <Card style={styles.quickStatCard}>
            <SvgXml xml={Icons.emptyWallet} width={24} height={24} fill={COLORS.primary} />
            <Text style={styles.quickStatValue}>125M VND</Text>
            <Text style={styles.quickStatLabel}>Total Invested</Text>
          </Card>
          <Card style={styles.quickStatCard}>
            <SvgXml xml={Icons.trendUp} width={24} height={24} fill={COLORS.positive} />
            <Text style={styles.quickStatValue}>+25%</Text>
            <Text style={styles.quickStatLabel}>Total Return</Text>
          </Card>
        </View>

        {/* Account Management */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Management</Text>

          <Card style={styles.menuCard}>
            <Button 
              variant="ghost" 
              className="flex-row justify-between items-center py-5 px-4" 
              onPress={handleEditProfile}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <SvgXml xml={Icons.user} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text style={styles.menuTitle}>Personal Information</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>

            <Button 
              variant="ghost" 
              className="flex-row justify-between items-center py-5 px-4" 
              onPress={handleBankAccount}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <SvgXml xml={Icons.bank} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text style={styles.menuTitle}>Bank Account</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>

            <Button 
              variant="ghost" 
              className="flex-row justify-between items-center py-5 px-4" 
              onPress={handleVerification}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <SvgXml xml={Icons.shieldTick} width={20} height={20} fill={COLORS.primary} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>Identity Verification</Text>
                  <View style={styles.verificationStatusBadge}>
                    <SvgXml
                      xml={isVerified ? Icons.tick : Icons.warning}
                      width={12}
                      height={12}
                      fill={isVerified ? COLORS.success : COLORS.warning}
                    />
                    <Text style={[styles.verificationStatusText, { color: isVerified ? COLORS.success : COLORS.warning }]}>
                      {isVerified ? 'Verified' : 'Pending'}
                    </Text>
                  </View>
                </View>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>

            <Button 
              variant="ghost" 
              className="flex-row justify-between items-center py-5 px-4" 
              onPress={handleChangePassword}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <SvgXml xml={Icons.lock} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text style={styles.menuTitle}>Change Password</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>
          </Card>
        </View>

        {/* Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <Card style={styles.menuCard}>
            <Button 
              variant="ghost" 
              className="flex-row justify-between items-center py-5 px-4" 
              onPress={handleNotificationSettings}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <SvgXml xml={Icons.notification} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text style={styles.menuTitle}>Notifications</Text>
              </View>
              <View style={styles.menuRight}>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary + '30' }}
                  thumbColor={notificationsEnabled ? COLORS.primary : COLORS.gray400}
                />
              </View>
            </Button>

            <Button 
              variant="ghost" 
              className="flex-row justify-between items-center py-5 px-4" 
              onPress={handleLanguageSettings}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <SvgXml xml={Icons.global} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text style={styles.menuTitle}>Language</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>English</Text>
                <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
              </View>
            </Button>

            <Button 
              variant="ghost" 
              className="flex-row justify-between items-center py-5 px-4" 
              onPress={handleSecurity}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <SvgXml xml={Icons.lockBold} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text style={styles.menuTitle}>Security</Text>
              </View>
              <View style={styles.menuRight}>
                <Switch
                  value={biometricEnabled}
                  onValueChange={setBiometricEnabled}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary + '30' }}
                  thumbColor={biometricEnabled ? COLORS.primary : COLORS.gray400}
                />
              </View>
            </Button>
          </Card>
        </View>

        {/* Support */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>

          <Card style={styles.menuCard}>
            <Button
              variant="ghost"
              onPress={handleSupport}
              className="flex-row justify-between items-center py-4 px-4"
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <SvgXml xml={Icons.infoCircle} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text style={styles.menuTitle}>Help Center</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>

            <Button
              variant="ghost"
              className="flex-row justify-between items-center py-4 px-4"
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <SvgXml xml={Icons.note} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text style={styles.menuTitle}>Terms & Conditions</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>

            <Button
              variant="ghost"
              className="flex-row justify-between items-center py-4 px-4"
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <SvgXml xml={Icons.shieldTick} width={20} height={20} fill={COLORS.primary} />
                </View>
                <Text style={styles.menuTitle}>Privacy Policy</Text>
              </View>
              <SvgXml xml={Icons.arrowRight} width={20} height={20} fill={COLORS.textTertiary} />
            </Button>
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.appInfoContainer}>
          <Text style={styles.appInfoText}>CapiGrow v1.0.0</Text>
          <Text style={styles.appInfoText}>
            Member since {formatDate(userProfile.createdAt, 'short')}
          </Text>
        </View>

        {/* Logout Button */}
        <Button 
          variant="destructive" 
          onPress={handleLogout}
          className="flex-row items-center justify-center gap-4 bg-red-50 py-4 rounded-lg mb-8"
        >
          <SvgXml xml={Icons.logout} width={24} height={24} fill={COLORS.error} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Button>
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
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginBottom: SPACING.xxxl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileInfo: {
    flex: 1,
    gap: SPACING.sm,
  },
  userName: {
    ...TYPOGRAPHY.h5,
    color: COLORS.textPrimary,
  },
  userEmail: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  verificationText: {
    ...TYPOGRAPHY.labelSmall,
    fontWeight: '500',
  },
  editButton: {
    padding: SPACING.sm,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.xxxl,
  },
  quickStatCard: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  quickStatValue: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  quickStatLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: SPACING.xxxl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h5,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  menuCard: {
    paddingVertical: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.lg,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textPrimary,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  menuValue: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  verificationStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  verificationStatusText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
  },
  appInfoContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    gap: SPACING.sm,
  },
  appInfoText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    backgroundColor: COLORS.errorLight,
    paddingVertical: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xxxxxxl,
  },
  logoutButtonText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.error,
    fontWeight: '600',
  },
});

export default ProfileScreen;