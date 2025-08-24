import type React from "react";
import { useEffect, useState } from "react";
import { Animated, Keyboard, type KeyboardEvent, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tokens from "@/components/lib/tokens";

interface KeyboardSpacerProps {
  topSpacing?: number;
  animated?: boolean;
  animationDuration?: number;
}

const KeyboardSpacer: React.FC<KeyboardSpacerProps> = ({
  topSpacing = 0,
  animated = true,
  animationDuration = tokens.animations.normal,
}) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [animatedHeight] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event: KeyboardEvent) => {
        const height = event.endCoordinates.height - insets.bottom + topSpacing;
        setKeyboardHeight(height);

        if (animated) {
          Animated.timing(animatedHeight, {
            toValue: height,
            duration:
              Platform.OS === "ios" ? event.duration || animationDuration : animationDuration,
            useNativeDriver: false,
          }).start();
        }
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (event: KeyboardEvent) => {
        setKeyboardHeight(0);

        if (animated) {
          Animated.timing(animatedHeight, {
            toValue: 0,
            duration:
              Platform.OS === "ios" ? event.duration || animationDuration : animationDuration,
            useNativeDriver: false,
          }).start();
        }
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [animatedHeight, animated, animationDuration, insets.bottom, topSpacing]);

  if (animated) {
    return (
      <Animated.View
        style={{
          height: animatedHeight,
        }}
      />
    );
  }

  return (
    <View
      style={{
        height: keyboardHeight,
      }}
    />
  );
};

export default KeyboardSpacer;
