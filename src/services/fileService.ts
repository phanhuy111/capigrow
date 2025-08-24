import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/utils/constants";

// Types for file operations
export interface FileInfo {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  isPublic: boolean;
  category?: string;
  tags?: string[];
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  file: FileInfo;
}

export interface FileResponse {
  success: boolean;
  message: string;
  file: FileInfo;
}

export interface FileDeleteResponse {
  success: boolean;
  message: string;
}

// File service API functions
const fileService = {
  // Upload file
  uploadFile: async (formData: FormData): Promise<FileUploadResponse> => {
    return apiClient.post(API_ENDPOINTS.FILES.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Get file details
  getFile: async (id: string): Promise<FileResponse> => {
    const url = API_ENDPOINTS.FILES.GET.replace(":id", id);
    return apiClient.get(url);
  },

  // Delete file
  deleteFile: async (id: string): Promise<FileDeleteResponse> => {
    const url = API_ENDPOINTS.FILES.DELETE.replace(":id", id);
    return apiClient.delete(url);
  },
};

export default fileService;
