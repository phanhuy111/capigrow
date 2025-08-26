import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import tokens from "../lib/tokens";

type Props = {
  children: React.ReactNode;
  containerClassName?: string;
  extendBackground?: Element;
} & Partial<BottomSheetProps>;

const BottomSheetView = forwardRef<BottomSheetModal, Props>((props, ref) => {
  const { children, containerClassName } = props;
  const snapPoints = useMemo(() => ["85%", "100%"], []);

  const styles = StyleSheet.create({
    headerIndicator: {
      height: 0,
    },
    absoluteFill: {
      ...StyleSheet.absoluteFillObject,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
  });

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        animatedIndex={{
          value: 1,
        }}
      />
    ),
    []
  );

  const renderBgComponent = () => {
    return (
      <View
        style={[
          styles.absoluteFill,
          { backgroundColor: tokens.colors.background.primary },
        ]}
      />
    );
  };

  return (
    <BottomSheetModal
      enablePanDownToClose
      detached
      backdropComponent={renderBackdrop}
      ref={ref as any}
      topInset={60}
      snapPoints={props.snapPoints || snapPoints}
      handleIndicatorStyle={[styles.headerIndicator]}
      backgroundComponent={renderBgComponent}
      {...props}
    >
      <BottomSheetScrollView
        contentContainerStyle={StyleSheet.flatten([
          {
            paddingBottom: 24,
            gap: 16,
          },
          containerClassName &&
            StyleSheet.create({ custom: containerClassName as any }).custom,
        ])}
        className="pt-2 pb-6 px-4 gap-4"
      >
        <View className="mt-5">{children}</View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default BottomSheetView;
