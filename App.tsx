import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './src/providers/QueryProvider';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/constants';

const App: React.FC = () => {
  return (
    <QueryProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryProvider>
  );
};

export default App;
