import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type React from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { Icons } from "@/assets";
import tokens from "@/components/lib/tokens";
// Import screens
import HomeScreen from "@/screens/home/HomeScreen";
import InvestmentsScreen from "@/screens/investment/InvestmentsScreen";
import PortfolioScreen from "@/screens/portfolio/PortfolioScreen";
import ProfileScreen from "@/screens/profile/ProfileScreen";
import TransactionsScreen from "@/screens/transaction/TransactionsScreen";
import type { MainTabParamList } from "@/types";

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
      case "Home":
        return focused ? Icons.home : Icons.homeOutline;
      case "Investments":
        return Icons.explore;
      case "Portfolio":
        return Icons.portfolio;
      case "Transactions":
        return Icons.graph;
      case "Profile":
        return Icons.profile;
      default:
        return Icons.home;
    }
  };

  return (
    <View className="items-center justify-center">
      <SvgXml xml={getIconSource()} width={size} height={size} fill={color} />
    </View>
  );
};

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => (
          <TabBarIcon route={route.name} focused={focused} color={color} size={24} />
        ),
        tabBarActiveTintColor: tokens.colors.primary[500],
        tabBarInactiveTintColor: tokens.colors.neutral[400],
        tabBarStyle: {
          backgroundColor: tokens.colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: tokens.colors.border.primary,
          paddingBottom: tokens.spacing[4],
          paddingTop: tokens.spacing[4],
          height: 80,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: tokens.typography.fontSize.xs,
          fontWeight: tokens.typography.fontWeight.medium as "500",
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
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Investments"
        component={InvestmentsScreen}
        options={{
          tabBarLabel: "Explore",
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          tabBarLabel: "Portfolio",
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarLabel: "History",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
