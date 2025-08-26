import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, X } from "lucide-react-native";
import { Icon } from "../../components/ui/icon";

interface SearchItem {
  id: string;
  text: string;
}

interface SearchHistoryScreenProps {
  onBack?: () => void;
  onClearAll?: () => void;
  onDeleteItem?: (id: string) => void;
  onSelectItem?: (item: SearchItem) => void;
  searchHistory?: SearchItem[];
}

const defaultSearchHistory: SearchItem[] = [
  { id: "1", text: "Bánh mỳ" },
  { id: "2", text: "Nhà" },
];

export const SearchHistoryScreen: React.FC<SearchHistoryScreenProps> = ({
  onBack,
  onClearAll,
  onDeleteItem,
  onSelectItem,
  searchHistory = defaultSearchHistory,
}) => {
  const renderSearchItem = ({ item }: { item: SearchItem }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between py-4 px-4 border-b border-gray-100"
      onPress={() => onSelectItem?.(item)}
    >
      <Text className="text-base text-gray-900 flex-1">{item.text}</Text>
      <TouchableOpacity className="p-2 -mr-2" onPress={() => onDeleteItem?.(item.id)}>
        <Icon as={X} className="w-5 h-5 text-gray-400" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity className="p-2 -ml-2" onPress={onBack}>
          <Icon as={ArrowLeft} className="w-6 h-6 text-gray-900" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-gray-900">Tìm kiếm gần đây</Text>

        <TouchableOpacity className="p-2 -mr-2" onPress={onClearAll}>
          <Text className="text-sm text-blue-600 font-medium">Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* Search History List */}
      <View className="flex-1">
        {searchHistory.length > 0 ? (
          <FlatList
            data={searchHistory}
            renderItem={renderSearchItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-gray-500 text-center">Không có lịch sử tìm kiếm</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchHistoryScreen;
