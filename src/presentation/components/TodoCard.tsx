import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { Todo } from '../../domain/entities/Todo';

interface TodoCardProps {
  todo: Todo;
  onToggleComplete: (todo: Todo) => void;
  onPress?: (todo: Todo) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onToggleComplete,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleToggleComplete = () => {
    opacity.value = withSpring(0.7, {}, () => {
      runOnJS(onToggleComplete)(todo);
      opacity.value = withSpring(1);
    });
  };

  const getPriorityColor = () => {
    switch (todo.priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = () => {
    switch (todo.category) {
      case 'work': return '💼';
      case 'personal': return '👤';
      case 'shopping': return '🛒';
      case 'health': return '🏥';
      default: return '📝';
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        style={styles.card}
        onPress={() => onPress?.(todo)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.category}>{getCategoryIcon()}</Text>
            <Text style={[styles.title, todo.completed && styles.completedTitle]}>
              {todo.title}
            </Text>
          </View>
          
          <Pressable
            style={[styles.checkbox, todo.completed && styles.checkedBox]}
            onPress={handleToggleComplete}
          >
            {todo.completed && <Check size={16} color="white" />}
          </Pressable>
        </View>

        {todo.description && (
          <Text style={[styles.description, todo.completed && styles.completedText]}>
            {todo.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={[styles.priorityTag, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.priorityText}>{todo.priority}</Text>
          </View>
          
          {todo.dueDate && (
            <Text style={styles.dueDate}>
              Due: {todo.dueDate.toLocaleDateString()}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 18,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  completedText: {
    color: '#9ca3af',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dueDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
});