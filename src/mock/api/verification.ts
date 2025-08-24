import { mockApiResponse, mockDelay } from "./index";

// Mock verification documents
const mockDocuments = [
  {
    id: "doc_1",
    type: "id_card" as const,
    status: "approved" as const,
    fileName: "id_card_front.jpg",
    fileUrl: "https://example.com/documents/id_card_front.jpg",
    uploadedAt: "2024-01-15T10:30:00Z",
    reviewedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "doc_2",
    type: "utility_bill" as const,
    status: "under_review" as const,
    fileName: "utility_bill.pdf",
    fileUrl: "https://example.com/documents/utility_bill.pdf",
    uploadedAt: "2024-01-17T09:15:00Z",
  },
];

// Mock verification status
const mockVerificationStatus = {
  overall: "under_review" as const,
  identity: "approved" as const,
  address: "under_review" as const,
  selfie: "approved" as const,
  documents: mockDocuments,
  completedSteps: 3,
  totalSteps: 4,
  lastUpdated: "2024-01-17T09:15:00Z",
};

// Upload verification document
export const uploadDocument = async (_formData: FormData) => {
  await mockDelay();

  // Simulate file and document type from form data
  const fileName = "sample_document.jpg";
  const documentType = "id_card";

  const newDocument = {
    id: `doc_${Date.now()}`,
    type: documentType as
      | "id_card"
      | "passport"
      | "driver_license"
      | "utility_bill"
      | "bank_statement",
    status: "pending" as const,
    fileName: fileName,
    fileUrl: `https://example.com/documents/${fileName}`,
    uploadedAt: new Date().toISOString(),
  };

  return mockApiResponse({
    success: true,
    message: "Document uploaded successfully",
    document: newDocument,
  });
};

// Upload selfie for verification
export const uploadSelfie = async (_formData: FormData) => {
  await mockDelay();

  return mockApiResponse({
    success: true,
    message: "Selfie uploaded successfully",
    selfieId: `selfie_${Date.now()}`,
    status: "pending",
  });
};

// Get verification status
export const getVerificationStatus = async () => {
  await mockDelay();

  return mockApiResponse({
    success: true,
    message: "Verification status retrieved successfully",
    verification: mockVerificationStatus,
  });
};
