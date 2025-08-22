import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore, selectUser } from '../../src/presentation/store/authStore';
import { ErrorBoundary } from '../../src/presentation/components/ErrorBoundary';
import { User, LogOut, Mail } from 'lucide-react-native';

const ProfileScreen: React.FC = () => {
  const user = useAuthStore(selectUser);
  const logout = useAuthStore((state) => state.logout);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.noUserText}>Please log in to view profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Text style={styles.avatarPlaceholder}>👤</Text>
              ) : (
                <User size={48} color="#6b7280" />
              )}
            </View>

            <Text style={styles.userName}>{user.name}</Text>
            
            <View style={styles.emailContainer}>
              <Mail size={16} color="#6b7280" />
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.preferencesCard}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Theme</Text>
              <Text style={styles.preferenceValue}>{user.preferences.theme}</Text>
            </View>
            
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Notifications</Text>
              <Text style={styles.preferenceValue}>
                {user.preferences.notifications ? 'On' : 'Off'}
              </Text>
            </View>
            
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Language</Text>
              <Text style={styles.preferenceValue}>{user.preferences.language}</Text>
            </View>
          </View>

          <Pressable style={styles.logoutButton} onPress={logout}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    fontSize: 32,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 8,
  },
  preferencesCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#374151',
  },
  preferenceValue: {
    fontSize: 16,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
  noUserText: {
    fontSize: 18,
    color: '#6b7280',
  },
});

export default ProfileScreen;