import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type React from "react";
import { View } from "react-native";
import tokens from "@/components/lib/tokens";
import HomeScreen from "@/screens/home/HomeScreen";
import InvestmentsScreen from "@/screens/investment/InvestmentsScreen";
import PortfolioScreen from "@/screens/portfolio/PortfolioScreen";
import ProfileScreen from "@/screens/profile/ProfileScreen";
import type { MainTabParamList } from "@/types";
import { Icon } from "@/components/common";

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabBarIcon: React.FC<{
  route: string;
  focused: boolean;
  color: string;
  size: number;
}> = ({ route, focused, color, size }) => {
  const getIconSource = () => {
    switch (route) {
      case "Home":
        return focused ? "house" : "house";
      case "Investments":
        return focused ? "chart-pie" : "chart-pie";
      case "Portfolio":
        return focused ? "square-play" : "square-play";
      case "Profile":
        return focused ? "user" : "user";
      default:
        return "house";
    }
  };

  return (
    <View className="items-center justify-center">
      <Icon name={getIconSource()} size={size} color={color} />
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
          paddingBottom: tokens.spacing[4],
          paddingTop: tokens.spacing[4],
          height: 80,
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
        },
        tabBarItemStyle: {},
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
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          tabBarLabel: "Portfolio",
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
