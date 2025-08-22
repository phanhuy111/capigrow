import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateTodoForm } from '../../src/presentation/forms/CreateTodoForm';
import { ErrorBoundary } from '../../src/presentation/components/ErrorBoundary';
import { useTodoStore } from '../../src/presentation/store/todoStore';
import { router } from 'expo-router';

const CreateScreen: React.FC = () => {
  const setCreating = useTodoStore((state) => state.setCreating);

  const handleSuccess = () => {
    setCreating(false);
    router.push('/(tabs)');
  };

  const handleCancel = () => {
    setCreating(false);
    router.push('/(tabs)');
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <CreateTodoForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CreateScreen;