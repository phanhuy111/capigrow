import { mockDelay, mockApiResponse } from './index';

// Mock file data
const mockFiles = [
  {
    id: 'file_1',
    fileName: 'document_123.pdf',
    originalName: 'my_document.pdf',
    mimeType: 'application/pdf',
    size: 1024000,
    url: 'https://example.com/files/document_123.pdf',
    uploadedBy: 'user_123',
    uploadedAt: '2024-01-15T10:30:00Z',
    isPublic: false,
    category: 'documents',
    tags: ['important', 'verification']
  },
  {
    id: 'file_2',
    fileName: 'profile_image_456.jpg',
    originalName: 'profile.jpg',
    mimeType: 'image/jpeg',
    size: 512000,
    url: 'https://example.com/files/profile_image_456.jpg',
    uploadedBy: 'user_123',
    uploadedAt: '2024-01-16T14:20:00Z',
    isPublic: true,
    category: 'images'
  }
];

// Upload file
export const uploadFile = async (formData: any) => {
  await mockDelay();
  
  // Simulate file upload
  const fileName = 'uploaded_file.pdf';
  const fileSize = Math.floor(Math.random() * 2000000) + 100000; // Random size between 100KB and 2MB
  
  const newFile = {
    id: `file_${Date.now()}`,
    fileName: `file_${Date.now()}.pdf`,
    originalName: fileName,
    mimeType: 'application/pdf',
    size: fileSize,
    url: `https://example.com/files/file_${Date.now()}.pdf`,
    uploadedBy: 'user_123',
    uploadedAt: new Date().toISOString(),
    isPublic: false,
    category: 'documents',
    tags: ['uploaded']
  };
  
  return mockApiResponse({
    success: true,
    message: 'File uploaded successfully',
    file: newFile
  });
};

// Get file details
export const getFile = async (id: string) => {
  await mockDelay();
  
  const file = mockFiles.find(f => f.id === id);
  
  if (!file) {
    return mockApiResponse({
      success: false,
      message: 'File not found',
      file: null
    }, false);
  }
  
  return mockApiResponse({
    success: true,
    message: 'File retrieved successfully',
    file: file
  });
};

// Delete file
export const deleteFile = async (id: string) => {
  await mockDelay();
  
  const fileIndex = mockFiles.findIndex(f => f.id === id);
  
  if (fileIndex === -1) {
    return mockApiResponse({
      success: false,
      message: 'File not found'
    }, false);
  }
  
  // Remove file from mock data
  mockFiles.splice(fileIndex, 1);
  
  return mockApiResponse({
    success: true,
    message: 'File deleted successfully'
  });
};