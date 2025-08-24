import { create } from "zustand";

interface VerificationClientState {
  // UI state
  selectedDocumentType: string;
  frontImage: string | null;
  backImage: string | null;
  selfieImage: string | null;
  isUploading: boolean;
  uploadProgress: number;

  // Actions
  setSelectedDocumentType: (type: string) => void;
  setFrontImage: (image: string | null) => void;
  setBackImage: (image: string | null) => void;
  setSelfieImage: (image: string | null) => void;
  setIsUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  clearImages: () => void;
  reset: () => void;
}

export const useVerificationClientStore = create<VerificationClientState>((set) => ({
  // Initial state
  selectedDocumentType: "",
  frontImage: null,
  backImage: null,
  selfieImage: null,
  isUploading: false,
  uploadProgress: 0,

  // Actions
  setSelectedDocumentType: (type: string) => set({ selectedDocumentType: type }),
  setFrontImage: (image: string | null) => set({ frontImage: image }),
  setBackImage: (image: string | null) => set({ backImage: image }),
  setSelfieImage: (image: string | null) => set({ selfieImage: image }),
  setIsUploading: (uploading: boolean) => set({ isUploading: uploading }),
  setUploadProgress: (progress: number) => set({ uploadProgress: progress }),

  clearImages: () =>
    set({
      frontImage: null,
      backImage: null,
      selfieImage: null,
    }),

  reset: () =>
    set({
      selectedDocumentType: "",
      frontImage: null,
      backImage: null,
      selfieImage: null,
      isUploading: false,
      uploadProgress: 0,
    }),
}));
