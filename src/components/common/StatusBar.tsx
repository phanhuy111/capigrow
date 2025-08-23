import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/theme';

interface StatusBarProps {
  backgroundColor?: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
  showTime?: boolean;
  showBattery?: boolean;
  showSignal?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({
  backgroundColor = COLORS.surface,
  barStyle = 'dark-content',
  showTime = true,
  showBattery = true,
  showSignal = true,
}) => {
  const insets = useSafeAreaInsets();

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <>
      <ExpoStatusBar style={barStyle === 'dark-content' ? 'dark' : 'light'} />
      <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
        <View style={styles.statusContent}>
          {/* Left side - Time */}
          {showTime && (
            <View style={styles.leftSection}>
              <Text style={styles.timeText}>{getCurrentTime()}</Text>
            </View>
          )}

          {/* Right side - Signal, WiFi, Battery */}
          {(showSignal || showBattery) && (
            <View style={styles.rightSection}>
              {showSignal && (
                <View style={styles.signalContainer}>
                  {/* Signal bars */}
                  <View style={[styles.signalBar, styles.signalBar1]} />
                  <View style={[styles.signalBar, styles.signalBar2]} />
                  <View style={[styles.signalBar, styles.signalBar3]} />
                  <View style={[styles.signalBar, styles.signalBar4]} />
                </View>
              )}

              {showSignal && (
                <View style={styles.wifiContainer}>
                  {/* WiFi icon representation */}
                  <View style={styles.wifiIcon} />
                </View>
              )}

              {showBattery && (
                <View style={styles.batteryContainer}>
                  <Text style={styles.batteryText}>100%</Text>
                  <View style={styles.batteryIcon}>
                    <View style={styles.batteryLevel} />
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.sm,
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 20,
  },
  leftSection: {
    flex: 1,
  },
  timeText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  signalBar: {
    backgroundColor: COLORS.textPrimary,
    width: 3,
    borderRadius: 1,
  },
  signalBar1: {
    height: 4,
  },
  signalBar2: {
    height: 6,
  },
  signalBar3: {
    height: 8,
  },
  signalBar4: {
    height: 10,
  },
  wifiContainer: {
    width: 15,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wifiIcon: {
    width: 12,
    height: 8,
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  batteryText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  batteryIcon: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: COLORS.textPrimary,
    borderRadius: 2,
    padding: 1,
    position: 'relative',
  },
  batteryLevel: {
    flex: 1,
    backgroundColor: COLORS.success,
    borderRadius: 1,
  },
});

export default StatusBar;
