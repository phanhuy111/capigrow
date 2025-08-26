import React, { useState, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Search, Check } from "lucide-react-native";
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import BottomSheetView from "@/components/common/BottomSheetView";
import { Separator } from "@/components/ui/separator";

interface FilterItem {
  id: string;
  name: string;
  selected: boolean;
}

interface FilterListProps {
  onClose?: () => void;
}

const defaultFilterItems: FilterItem[] = [
  { id: "all", name: "Tất cả", selected: true },
  { id: "fb", name: "F&B", selected: false },
  { id: "tech", name: "Công nghệ", selected: false },
  { id: "realestate", name: "Bất động sản", selected: false },
  { id: "family", name: "Mẹ và bé", selected: false },
  { id: "finance", name: "Tài chính", selected: false },
  { id: "media", name: "Báo mật", selected: false },
];

export const FilterList = forwardRef<BottomSheetModal, FilterListProps>(
  ({ onClose }, ref) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterItems, setFilterItems] =
      useState<FilterItem[]>(defaultFilterItems);

    const filteredItems = filterItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleItemToggle = (id: string) => {
      setFilterItems((prev) =>
        prev.map((item) => {
          if (id === "all") {
            return { ...item, selected: item.id === "all" };
          } else {
            if (item.id === "all") {
              return { ...item, selected: false };
            }
            return item.id === id
              ? { ...item, selected: !item.selected }
              : item;
          }
        })
      );
    };

    const renderFilterItem = ({ item }: { item: FilterItem }) => (
      <TouchableOpacity
        className="flex-row items-center justify-between py-4 border-gray-200"
        onPress={() => handleItemToggle(item.id)}
      >
        <Text className="text-base text-gray-900 flex-1">{item.name}</Text>
        <View>
          {item.selected && (
            <Check size={16} className="bg-emerald-500 rounded-full" />
          )}
        </View>
      </TouchableOpacity>
    );

    const handleApply = () => {
      onClose?.();
    };

    return (
      <BottomSheetView
        onChange={(index) => {
          if (index === -1) {
            onClose?.();
          }
        }}
        onClose={onClose}
        ref={ref}
        snapPoints={["90%"]}
      >
        <View className="flex-1 gap-2">
          {/* Header */}
          <View className="items-start">
            <Text className="text-2xl font-bold text-gray-900">Lĩnh vực</Text>
          </View>

          {/* Search Input */}
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4">
            <BottomSheetTextInput
              className="flex-1 text-base text-gray-900"
              placeholder="Tìm kiếm"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <Separator />

          {/* Filter Items */}
          <View className="flex-1">
            <BottomSheetFlatList
              data={filteredItems}
              keyExtractor={(item) => item.id}
              renderItem={renderFilterItem}
              showsVerticalScrollIndicator={false}
              contentContainerClassName="pb-4"
            />
          </View>

          <TouchableOpacity
            className="bg-violet-600 rounded-xl py-4"
            onPress={handleApply}
          >
            <Text className="text-white text-center text-base font-semibold">
              Áp dụng
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    );
  }
);
