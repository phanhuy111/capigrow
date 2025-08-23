import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../utils/theme';
import { Icons } from '../../assets';
import Screen from '../../components/common/Screen';
import { Card } from '@/components/ui';
import { mockNotificationApi } from '../../mock/api/notifications';
import { formatDate } from '../../utils/helpers';

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await mockNotificationApi.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await mockNotificationApi.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await mockNotificationApi.markAllAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'investment_update':
        return Icons.trendUp;
      case 'transaction_completed':
        return Icons.tick;
      case 'verification_approved':
        return Icons.shieldTick;
      case 'new_investment':
        return Icons.cup;
      case 'dividend_received':
        return Icons.moneyReceive;
      default:
        return Icons.notification;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return COLORS.error;
      case 'medium':
        return COLORS.warning;
      case 'low':
        return COLORS.info;
      default:
        return COLORS.textTertiary;
    }
  };

  const renderNotificationItem = (item: any) => {
    const priorityColor = getPriorityColor(item.priority);

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleMarkAsRead(item.id)}
      >
        <Card style={{
          ...styles.notificationCard,
          ...(!item.isRead && styles.unreadCard),
        }}>
          <View style={styles.notificationHeader}>
            <View style={styles.notificationLeft}>
              <View style={[styles.iconContainer, { backgroundColor: priorityColor + '20' }]}>
                <SvgXml
                  xml={getNotificationIcon(item.type)}
                  width={20}
                  height={20}
                  fill={priorityColor}
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, !item.isRead && styles.unreadTitle]}>
                  {item.title}
                </Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {item.message}
                </Text>
                <Text style={styles.notificationTime}>
                  {formatDate(item.createdAt, 'relative')}
                </Text>
              </View>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Screen paddingHorizontal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <SvgXml xml={Icons.arrowLeft} width={24} height={24} fill={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notification Stats */}
        {unreadCount > 0 && (
          <Card style={styles.statsCard}>
            <View style={styles.statsContent}>
              <SvgXml xml={Icons.notification} width={24} height={24} fill={COLORS.primary} />
              <Text style={styles.statsText}>
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </Text>
            </View>
          </Card>
        )}

        {/* Notifications List */}
        <View style={styles.notificationsList}>
          {notifications.length > 0 ? (
            notifications.map(renderNotificationItem)
          ) : (
            <View style={styles.emptyContainer}>
              <SvgXml xml={Icons.notificationSlash} width={60} height={60} fill={COLORS.textTertiary} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptyText}>
                You're all caught up! Check back later for updates.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
    paddingTop: SPACING.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  markAllText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.primary,
  },
  statsCard: {
    marginBottom: SPACING.xxxl,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  statsText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  notificationsList: {
    marginBottom: SPACING.xxxxxxl,
  },
  notificationCard: {
    marginBottom: SPACING.lg,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: SPACING.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    gap: SPACING.sm,
  },
  notificationTitle: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textPrimary,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  notificationMessage: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  notificationTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: SPACING.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxxxxl,
    gap: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h5,
    color: COLORS.textPrimary,
  },
  emptyText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});

export default NotificationScreen;
