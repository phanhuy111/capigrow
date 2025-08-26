import type React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tokens from "@/components/lib/tokens";

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <View className="mb-6">
      <View className="flex-row bg-gray-100 rounded-xl p-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              className={`flex-1 py-3 px-4 rounded-lg items-center justify-center ${
                isActive ? "bg-white shadow-sm" : "bg-transparent"
              }`}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-medium ${isActive ? "text-gray-900" : "text-gray-600"}`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TabNavigation;
