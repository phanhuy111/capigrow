import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/presentation/store/authStore';
import { useUpdateUser } from '../../src/presentation/hooks/useUsers';
import { ErrorBoundary } from '../../src/presentation/components/ErrorBoundary';
import { Moon, Sun, Bell, BellOff, Globe } from 'lucide-react-native';

const SettingsScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const updateUserMutation = useUpdateUser();

  const updatePreference = <K extends keyof typeof user.preferences>(
    key: K,
    value: typeof user.preferences[K]
  ) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, [key]: value },
    };

    setUser(updatedUser);
    updateUserMutation.mutate({
      id: user.id,
      userData: { preferences: updatedUser.preferences },
    });
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.noUserText}>Please log in to access settings</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                {user.preferences.theme === 'dark' ? (
                  <Moon size={20} color="#6b7280" />
                ) : (
                  <Sun size={20} color="#6b7280" />
                )}
                <Text style={styles.settingLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={user.preferences.theme === 'dark'}
                onValueChange={(value) => 
                  updatePreference('theme', value ? 'dark' : 'light')
                }
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={user.preferences.theme === 'dark' ? '#ffffff' : '#f3f4f6'}
              />
            </View>
          </View>

          <View style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                {user.preferences.notifications ? (
                  <Bell size={20} color="#6b7280" />
                ) : (
                  <BellOff size={20} color="#6b7280" />
                )}
                <Text style={styles.settingLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={user.preferences.notifications}
                onValueChange={(value) => updatePreference('notifications', value)}
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={user.preferences.notifications ? '#ffffff' : '#f3f4f6'}
              />
            </View>
          </View>

          <View style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Language & Region</Text>
            
            <Pressable style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Globe size={20} color="#6b7280" />
                <Text style={styles.settingLabel}>Language</Text>
              </View>
              <Text style={styles.settingValue}>
                {user.preferences.language.toUpperCase()}
              </Text>
            </Pressable>
          </View>
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
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  noUserText: {
    fontSize: 18,
    color: '#6b7280',
  },
});

export default SettingsScreen;