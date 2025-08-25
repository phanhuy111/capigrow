import React from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { PortalHost } from "@rn-primitives/portal";
import { QueryProvider } from "./src/providers/QueryProvider";
import AppNavigator from "./src/navigation/AppNavigator";
import "./global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const App: React.FC = () => {
  return (
    <KeyboardProvider>
      <QueryProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <SafeAreaProvider>
              <StatusBar style="dark" />
              <AppNavigator />
              <PortalHost />
            </SafeAreaProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryProvider>
    </KeyboardProvider>
  );
};

export default App;
