import { mockDelay, mockApiResponse } from './index';
import { mockUserProfile } from '@/mock/data/user';

export const mockUserApi = {
  getProfile: async () => {
    await mockDelay(1000);
    return mockApiResponse(mockUserProfile, true, 'Profile retrieved successfully');
  },

  updateProfile: async (profileData: Partial<typeof mockUserProfile>) => {
    await mockDelay(1500);
    
    const updatedProfile = { ...mockUserProfile, ...profileData };
    return mockApiResponse(updatedProfile, true, 'Profile updated successfully');
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    await mockDelay(1000);
    
    if (currentPassword === 'password123') {
      return mockApiResponse({ success: true }, true, 'Password changed successfully');
    }
    
    return mockApiResponse(null, false, 'Current password is incorrect');
  },

  uploadDocument: async (documentType: string, file: any) => {
    await mockDelay(2000);
    
    return mockApiResponse({
      documentId: `doc_${Date.now()}`,
      url: `https://example.com/documents/${documentType}_${Date.now()}.jpg`,
      status: 'uploaded',
    }, true, 'Document uploaded successfully');
  },

  updateBankAccount: async (bankData: any) => {
    await mockDelay(1500);
    
    return mockApiResponse({
      ...mockUserProfile.bankAccount,
      ...bankData,
    }, true, 'Bank account updated successfully');
  },
};
