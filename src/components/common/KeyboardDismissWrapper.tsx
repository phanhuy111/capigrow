import type React from "react";
import { Keyboard, TouchableWithoutFeedback, View, type ViewStyle } from "react-native";

interface KeyboardDismissWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
  onDismiss?: () => void;
}

const KeyboardDismissWrapper: React.FC<KeyboardDismissWrapperProps> = ({
  children,
  style,
  disabled = false,
  onDismiss,
}) => {
  const handlePress = () => {
    if (!disabled) {
      Keyboard.dismiss();
      onDismiss?.();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

export default KeyboardDismissWrapper;
