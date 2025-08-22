import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TodoPriority, TodoCategory } from '../../domain/entities/Todo';
import { useTodoOperations } from '../hooks/useTodos';
import { useAuthStore } from '../store/authStore';

// Form validation schema
const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  priority: z.nativeEnum(TodoPriority),
  category: z.nativeEnum(TodoCategory),
  dueDate: z.date().optional(),
});

type CreateTodoFormData = z.infer<typeof createTodoSchema>;

interface CreateTodoFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateTodoForm: React.FC<CreateTodoFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const user = useAuthStore((state) => state.user);
  const { createTodo, isCreating } = useTodoOperations();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: TodoPriority.MEDIUM,
      category: TodoCategory.PERSONAL,
    },
  });

  const onSubmit = async (data: CreateTodoFormData) => {
    if (!user) return;

    createTodo(
      { userId: user.id, data },
      {
        onSuccess: (result) => {
          if (result.success) {
            reset();
            onSuccess?.();
          }
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Todo</Text>
      
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Title *</Text>
            {/* Note: Replace with NativeUI TextInput when implementing */}
            <Text style={styles.input}>{value || 'Todo title...'}</Text>
            {errors.title && (
              <Text style={styles.errorText}>{errors.title.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.input}>{value || 'Todo description...'}</Text>
            {errors.description && (
              <Text style={styles.errorText}>{errors.description.message}</Text>
            )}
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <Text style={styles.button} onPress={onCancel}>
          Cancel
        </Text>
        <Text 
          style={[styles.button, styles.primaryButton, !isValid && styles.disabledButton]}
          onPress={isValid ? handleSubmit(onSubmit) : undefined}
        >
          {isCreating ? 'Creating...' : 'Create Todo'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 4,
    backgroundColor: '#f3f4f6',
    color: '#374151',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    color: '#6b7280',
  },
});