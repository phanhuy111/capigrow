import { mockUserProfile } from "@/mock/data/user";
import { mockApiResponse, mockDelay } from "./index";

// Types
interface DocumentFile {
  uri: string;
  type: string;
  name: string;
  size?: number;
}

interface BankAccountData {
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  branch?: string;
}

export const mockUserApi = {
  getProfile: async () => {
    await mockDelay(1000);

    const userData = {
      user: {
        id: "1",
        phoneNumber: "+84123456789",
        fullName: "Nguyen Van A",
        firstName: "Van A",
        lastName: "Nguyen",
        email: "user@example.com",
        dateOfBirth: "1990-01-15",
        gender: "male" as const,
        avatar: "/images/avatar.jpg",
        isVerified: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-12-20T00:00:00Z",
      },
    };

    return mockApiResponse(userData, true, "Profile retrieved successfully");
  },

  updateProfile: async (profileData: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    dateOfBirth?: string;
    gender?: "male" | "female" | "other";
    avatar?: string;
  }) => {
    await mockDelay(1500);

    const updatedUser = {
      id: "1",
      phoneNumber: "+84123456789",
      fullName: profileData.fullName || "Nguyen Van A",
      firstName: profileData.firstName || "Van A",
      lastName: profileData.lastName || "Nguyen",
      email: profileData.email || "user@example.com",
      dateOfBirth: profileData.dateOfBirth || "1990-01-15",
      gender: profileData.gender || ("male" as const),
      avatar: profileData.avatar || "/images/avatar.jpg",
      isVerified: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    };

    const responseData = {
      user: updatedUser,
    };

    return mockApiResponse(responseData, true, "Profile updated successfully");
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    await mockDelay(1000);

    if (passwordData.currentPassword === "password123") {
      return mockApiResponse({ success: true }, true, "Password changed successfully");
    }

    return mockApiResponse(null, false, "Current password is incorrect");
  },

  uploadDocument: async (documentType: string, _file: DocumentFile) => {
    await mockDelay(2000);

    return mockApiResponse(
      {
        documentId: `doc_${Date.now()}`,
        url: `https://example.com/documents/${documentType}_${Date.now()}.jpg`,
        status: "uploaded",
      },
      true,
      "Document uploaded successfully"
    );
  },

  updateBankAccount: async (bankData: BankAccountData) => {
    await mockDelay(1500);

    return mockApiResponse(
      {
        ...mockUserProfile.bankAccount,
        ...bankData,
      },
      true,
      "Bank account updated successfully"
    );
  },
};
