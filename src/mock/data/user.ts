export const mockUserProfile = {
  id: '1',
  email: 'user@example.com',
  phone: '+84123456789',
  firstName: 'Nguyen',
  lastName: 'Van A',
  dateOfBirth: '1990-01-01',
  avatar: null,
  address: {
    street: '123 Nguyen Hue',
    city: 'Ho Chi Minh City',
    district: 'District 1',
    country: 'Vietnam',
    zipCode: '70000',
  },
  bankAccount: {
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountHolder: 'NGUYEN VAN A',
    branch: 'Ho Chi Minh City Branch',
  },
  verification: {
    identity: {
      status: 'approved',
      documents: ['id_front.jpg', 'id_back.jpg'],
      verifiedAt: '2024-01-15T00:00:00Z',
    },
    bank: {
      status: 'approved',
      verifiedAt: '2024-01-15T00:00:00Z',
    },
    selfie: {
      status: 'approved',
      verifiedAt: '2024-01-15T00:00:00Z',
    },
  },
  settings: {
    notifications: {
      push: true,
      email: true,
      sms: false,
    },
    language: 'vi',
    currency: 'VND',
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};
