import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserUseCase, updateUserUseCase } from '../../infrastructure/di/container';
import { User } from '../../domain/entities/User';

// Query keys factory
export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

// Custom hooks using functional approach
export const useUser = (id: string) =>
  useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserUseCase(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) =>
      updateUserUseCase(id, userData),
    onSuccess: (result, variables) => {
      if (result.success) {
        // Invalidate user queries
        queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
        queryClient.setQueryData(userKeys.detail(variables.id), result);
      }
    },
  });
};