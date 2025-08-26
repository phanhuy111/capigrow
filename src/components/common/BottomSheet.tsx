import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";
import tokens from "../lib/tokens";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface BottomSheetProps {
  /** Whether the bottom sheet is visible */
  visible: boolean;
  /** Callback when the bottom sheet should be closed */
  onClose: () => void;
  /** Title of the bottom sheet */
  title?: string;
  /** Subtitle of the bottom sheet */
  subtitle?: string;
  /** Children content */
  children: React.ReactNode;
  /** Height of the bottom sheet */
  height?: number | "auto" | "full";
  /** Whether to show the drag handle */
  showHandle?: boolean;
  /** Whether the bottom sheet can be dismissed by tapping backdrop */
  dismissOnBackdrop?: boolean;
  /** Whether the bottom sheet can be dismissed by swiping down */
  dismissOnSwipe?: boolean;
  /** Custom backdrop color */
  backdropColor?: string;
  /** Custom backdrop opacity */
  backdropOpacity?: number;
  /** Animation duration */
  animationDuration?: number;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom content style */
  contentStyle?: ViewStyle;
  /** Custom header style */
  headerStyle?: ViewStyle;
  /** Custom title style */
  titleStyle?: TextStyle;
  /** Custom subtitle style */
  subtitleStyle?: TextStyle;
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
  /** Snap points for the bottom sheet */
  snapPoints?: number[];
  /** Initial snap point index */
  initialSnapIndex?: number;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  height = "auto",
  showHandle = true,
  dismissOnBackdrop = true,
  dismissOnSwipe = true,
  backdropColor = tokens.colors.neutral[900],
  backdropOpacity = 0.5,
  animationDuration = tokens.animations.normal,
  containerStyle,
  contentStyle,
  headerStyle,
  titleStyle,
  subtitleStyle,
  onAnimationComplete,
}) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacityAnim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  const getSheetHeight = () => {
    if (height === "full") return SCREEN_HEIGHT;
    if (height === "auto") return Math.min(contentHeight + 100, SCREEN_HEIGHT * 0.9);
    if (typeof height === "number") return Math.min(height, SCREEN_HEIGHT * 0.9);
    return SCREEN_HEIGHT * 0.5;
  };

  const sheetHeight = getSheetHeight();

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacityAnim, {
          toValue: backdropOpacity,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start(onAnimationComplete);
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: sheetHeight,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacityAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start(onAnimationComplete);
    }
  }, [
    visible,
    sheetHeight,
    animationDuration,
    backdropOpacity,
    onAnimationComplete,
    backdropOpacityAnim,
    translateY,
  ]);

  const handleBackdropPress = () => {
    if (dismissOnBackdrop) {
      onClose();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        return dismissOnSwipe && gestureState.dy > 0;
      },
      onPanResponderMove: (_evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const shouldClose = gestureState.dy > sheetHeight * 0.3 || gestureState.vy > 0.5;

        if (shouldClose) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const renderHandle = () => {
    if (!showHandle) return null;

    return (
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
    );
  };

  const renderHeader = () => {
    if (!title && !subtitle) return null;

    return (
      <View style={[styles.header, headerStyle]}>
        {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
        {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              backgroundColor: backdropColor,
              opacity: backdropOpacityAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={handleBackdropPress}
          />
        </Animated.View>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.container,
            {
              height: sheetHeight,
              transform: [{ translateY }],
            },
            containerStyle,
          ]}
          {...panResponder.panHandlers}
        >
          {renderHandle()}
          {renderHeader()}
          <View
            style={[styles.content, contentStyle]}
            onLayout={(event) => {
              if (height === "auto") {
                setContentHeight(event.nativeEvent.layout.height);
              }
            }}
          >
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropTouchable: {
    flex: 1,
  },
  container: {
    backgroundColor: tokens.colors.background.primary,
    borderTopLeftRadius: tokens.borderRadius["2xl"],
    borderTopRightRadius: tokens.borderRadius["2xl"],
    ...tokens.shadows.lg,
    paddingBottom: Platform.OS === "ios" ? tokens.spacing[6] : tokens.spacing[4],
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: tokens.spacing[3],
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: tokens.colors.neutral[300],
    borderRadius: tokens.borderRadius.full,
  },
  header: {
    paddingHorizontal: tokens.spacing[4],
    paddingBottom: tokens.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.primary,
  },
  title: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: tokens.typography.fontWeight.semibold as "600",
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing[1],
  },
  subtitle: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: tokens.typography.fontWeight.normal as "400",
    color: tokens.colors.text.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: tokens.spacing[4],
    paddingTop: tokens.spacing[3],
  },
});

export default BottomSheet;