import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { interpolate, Extrapolate, useAnimatedStyle } from "react-native-reanimated";
import { Grid } from "lucide-react-native";
import { ScrollView } from "react-native-gesture-handler";

type FilterKey = "newest" | "invested" | "profit";

interface FilterbarProps {
  scrollY: Animated.SharedValue<number>;
}

const AnimatedScroll = Animated.createAnimatedComponent(ScrollView);

export default function FilterBar({ scrollY }: FilterbarProps) {
  const [selected, setSelected] = useState<FilterKey>("newest");

  const containerAnimStyle = useAnimatedStyle(() => {
    const paddingRight = interpolate(scrollY.value, [0, 50], [140, 42], Extrapolate.CLAMP);
    return {
      paddingRight,
    };
  });

  return (
    <View className="relative px-4 mb-6">
      <AnimatedScroll
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* 🔥 Animate paddingRight ở đây */}
        <Animated.View style={containerAnimStyle} className="flex-row">
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg mr-3 ${
              selected === "newest" ? "bg-purple-100" : "bg-gray-100"
            }`}
            onPress={() => setSelected("newest")}
          >
            <Text
              className={`text-sm font-medium ${
                selected === "newest" ? "text-purple-800" : "text-gray-600"
              }`}
            >
              Mới đến cũ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-lg mr-3 ${
              selected === "invested" ? "bg-purple-100" : "bg-gray-100"
            }`}
            onPress={() => setSelected("invested")}
          >
            <Text
              className={`text-sm font-medium ${
                selected === "invested" ? "text-purple-800" : "text-gray-600"
              }`}
            >
              Đầu tư nhiều
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-lg mr-3 ${
              selected === "profit" ? "bg-purple-100" : "bg-gray-100"
            }`}
            onPress={() => setSelected("profit")}
          >
            <Text
              className={`text-sm font-medium ${
                selected === "profit" ? "text-purple-800" : "text-gray-600"
              }`}
            >
              Lợi nhuận cao
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </AnimatedScroll>

      <View className="absolute right-4 top-0 bottom-0 justify-center">
        <CategoryButton scrollY={scrollY} />
      </View>
    </View>
  );
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CategoryButtonProps {
  scrollY: Animated.SharedValue<number>;
}

function CategoryButton({ scrollY }: CategoryButtonProps) {
  const textAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 50], [1, 0], Extrapolate.CLAMP);
    const translateX = interpolate(scrollY.value, [0, 50], [0, -8], Extrapolate.CLAMP);

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  const containerAnimStyle = useAnimatedStyle(() => {
    const width = interpolate(scrollY.value, [0, 50], [150, 50], Extrapolate.CLAMP);
    const borderRadius = interpolate(scrollY.value, [0, 50], [22, 22], Extrapolate.CLAMP);
    return {
      width,
      borderRadius,
    };
  });

  return (
    <AnimatedTouchable
      activeOpacity={0.8}
      onPress={() => console.log("Open category")}
      className="flex-row items-center px-4 py-2 bg-purple-600"
      style={containerAnimStyle}
    >
      <Grid color="white" size={18} />
      <Animated.View style={[{ marginLeft: 6 }, textAnimStyle]}>
        <Text
          style={{
            color: "white",
            fontWeight: "600",
          }}
          numberOfLines={1}
        >
          Chọn danh mục
        </Text>
      </Animated.View>
    </AnimatedTouchable>
  );
}
