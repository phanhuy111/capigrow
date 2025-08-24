import apiClient from '@/services/apiClient';
import { API_ENDPOINTS } from '@/utils/constants';
import { ApiResponse } from '@/types';

// Types for verification operations
export interface VerificationDocument {
  id: string;
  type: 'id_card' | 'passport' | 'driver_license' | 'utility_bill' | 'bank_statement';
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface VerificationStatus {
  overall: 'pending' | 'under_review' | 'approved' | 'rejected';
  identity: 'pending' | 'under_review' | 'approved' | 'rejected';
  address: 'pending' | 'under_review' | 'approved' | 'rejected';
  selfie: 'pending' | 'under_review' | 'approved' | 'rejected';
  documents: VerificationDocument[];
  completedSteps: number;
  totalSteps: number;
  lastUpdated: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  document: VerificationDocument;
}

export interface SelfieUploadResponse {
  success: boolean;
  message: string;
  selfieId: string;
  status: string;
}

export interface VerificationStatusResponse {
  success: boolean;
  message: string;
  verification: VerificationStatus;
}

// Verification service API functions
const verificationService = {
  // Upload verification document
  uploadDocument: async (formData: FormData): Promise<DocumentUploadResponse> => {
    return apiClient.post(API_ENDPOINTS.VERIFICATION.DOCUMENTS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload selfie for verification
  uploadSelfie: async (formData: FormData): Promise<SelfieUploadResponse> => {
    return apiClient.post(API_ENDPOINTS.VERIFICATION.SELFIE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get verification status
  getVerificationStatus: async (): Promise<VerificationStatusResponse> => {
    return apiClient.get(API_ENDPOINTS.VERIFICATION.STATUS);
  },
};

export default verificationService;