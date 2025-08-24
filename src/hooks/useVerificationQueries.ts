import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IdentityVerification } from '@/types';
import verificationService from '@/services/verificationService';

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
      const response = await verificationService.getVerificationStatus();
      if (!response.success) {
        throw new Error(response.message || 'Failed to get verification status');
      }
      return response.verification;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Upload document mutation
export const useUploadDocumentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await verificationService.uploadDocument(formData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to upload document');
      }
      return response.document;
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
      const response = await verificationService.uploadSelfie(formData);
      if (!response.success) {
        throw new Error(response.message || 'Failed to upload selfie');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate verification status to refetch updated status
      queryClient.invalidateQueries({ queryKey: verificationKeys.status() });
    },
  });
};