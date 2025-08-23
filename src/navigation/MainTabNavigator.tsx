import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg';

// Import screens
import HomeScreen from '@/screens/home/HomeScreen';
import InvestmentsScreen from '@/screens/investment/InvestmentsScreen';
import PortfolioScreen from '@/screens/portfolio/PortfolioScreen';
import TransactionsScreen from '@/screens/transaction/TransactionsScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';

import { MainTabParamList } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/utils/theme';
import { Icons } from '@/assets';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom tab bar icon component
const TabBarIcon: React.FC<{
  route: string;
  focused: boolean;
  color: string;
  size: number;
}> = ({ route, focused, color, size }) => {
  const getIconSource = () => {
    switch (route) {
      case 'Home':
        return focused ? Icons.home : Icons.homeOutline;
      case 'Investments':
        return Icons.explore;
      case 'Portfolio':
        return Icons.portfolio;
      case 'Transactions':
        return Icons.graph;
      case 'Profile':
        return Icons.profile;
      default:
        return Icons.home;
    }
  };

  return (
    <View style={styles.tabIconContainer}>
      <SvgXml
        xml={getIconSource()}
        width={size}
        height={size}
        fill={color}
      />
    </View>
  );
};

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon
            route={route.name}
            focused={focused}
            color={color}
            size={24}
          />
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Investments"
        component={InvestmentsScreen}
        options={{
          tabBarLabel: 'Explore',
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          tabBarLabel: 'Portfolio',
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarLabel: 'History',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarStyle: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.md,
    height: 80,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarLabelStyle: {
    ...TYPOGRAPHY.labelSmall,
    marginTop: SPACING.xs,
  },
  tabBarItemStyle: {
    paddingVertical: SPACING.sm,
  },
});

export default MainTabNavigator;
