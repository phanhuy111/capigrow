import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IdentityVerification } from '../types';
import apiService from '../services/api';

// Query keys
export const verificationKeys = {
  all: ['verification'] as const,
  status: () => [...verificationKeys.all, 'status'] as const,
};

// Get verification status query
export const useVerificationStatusQuery = () => {
  return useQuery({
    queryKey: verificationKeys.status(),
    queryFn: async () => {
      const response = await apiService.getVerificationStatus();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as IdentityVerification;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Upload document mutation
export const useUploadDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiService.uploadDocument(formData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate verification status to refetch updated status
      queryClient.invalidateQueries({ queryKey: verificationKeys.status() });
    },
  });
};

// Upload selfie mutation
export const useUploadSelfieMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiService.uploadSelfie(formData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate verification status to refetch updated status
      queryClient.invalidateQueries({ queryKey: verificationKeys.status() });
    },
  });
};