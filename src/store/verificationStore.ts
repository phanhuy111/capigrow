import { create } from 'zustand';
import { VerificationState, IdentityVerification } from '../types';
import apiService from '../services/api';

interface VerificationStore extends VerificationState {
  // Actions
  uploadDocument: (formData: FormData) => Promise<void>;
  uploadSelfie: (formData: FormData) => Promise<void>;
  fetchVerificationStatus: () => Promise<void>;
  clearError: () => void;
  clearVerification: () => void;
}

export const useVerificationStore = create<VerificationStore>((set, get) => ({
  // Initial state
  verification: null,
  isLoading: false,
  error: null,

  // Actions
  uploadDocument: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.uploadDocument(formData);
      if (response.error) {
        throw new Error(response.error);
      }
      set({
        isLoading: false,
        verification: response.data,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to upload document',
      });
      throw error;
    }
  },

  uploadSelfie: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.uploadSelfie(formData);
      if (response.error) {
        throw new Error(response.error);
      }
      set({
        isLoading: false,
        verification: response.data,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to upload selfie',
      });
      throw error;
    }
  },

  fetchVerificationStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.getVerificationStatus();
      if (response.error) {
        throw new Error(response.error);
      }
      set({
        isLoading: false,
        verification: response.data,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch verification status',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearVerification: () => {
    set({ verification: null });
  },
}));