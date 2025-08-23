import React from 'react';
import { View, Text } from 'react-native';
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
    <View className="items-center justify-center">
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
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          paddingBottom: 16,
          paddingTop: 16,
          height: 80,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
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



export default MainTabNavigator;
