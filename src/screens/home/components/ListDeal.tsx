import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  interpolate,
  Extrapolate,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FilterBar from "./FilterBar";
import CardDeal from "./CardDeal";

export default function ListDeal() {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FilterBar scrollY={scrollY} />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: 24,
          paddingHorizontal: 12,
          gap: 12,
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <CardDeal
            key={i}
            title="Deal"
            category="Category"
            raisedAmount={1000000}
            targetAmount={10000000}
            progress={0.5}
            expectedReturn={1000000}
            daysLeft={10}
            minInvestment={1000000}
            onPress={() => {}}
          />
        ))}
      </Animated.ScrollView>
    </GestureHandlerRootView>
  );
}
