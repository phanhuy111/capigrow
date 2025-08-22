import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTodos } from '../../src/presentation/hooks/useTodos';
import { useTodoStore, selectFilters } from '../../src/presentation/store/todoStore';
import { useAuthStore } from '../../src/presentation/store/authStore';
import { TodoCard } from '../../src/presentation/components/TodoCard';
import { LoadingSpinner } from '../../src/presentation/components/LoadingSpinner';
import { ErrorBoundary } from '../../src/presentation/components/ErrorBoundary';
import { useTodoOperations } from '../../src/presentation/hooks/useTodos';

const HomeScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const filters = useTodoStore(selectFilters);
  const { toggleTodoCompletion } = useTodoOperations();

  const { data: todosResult, isLoading, error } = useTodos(
    user ? { userId: user.id, ...filters } : {}
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner size={48} />
        <Text style={styles.loadingText}>Loading todos...</Text>
      </View>
    );
  }

  if (error || !todosResult?.success) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load todos</Text>
      </View>
    );
  }

  const todos = todosResult.data?.data || [];

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Todos</Text>
          <Text style={styles.subtitle}>
            {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
          </Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {todos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No todos yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the Create tab to add your first todo
              </Text>
            </View>
          ) : (
            todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggleComplete={toggleTodoCompletion}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    paddingTop: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default HomeScreen;