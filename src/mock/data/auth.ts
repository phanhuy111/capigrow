export const mockAuthData = {
  user: {
    id: '1',
    email: 'user@example.com',
    phone: '+84123456789',
    firstName: 'Nguyen',
    lastName: 'Van A',
    avatar: null,
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  tokens: {
    accessToken: 'mock_access_token',
    refreshToken: 'mock_refresh_token',
    expiresIn: 3600,
  },
};

export const mockLoginResponse = {
  success: true,
  data: mockAuthData,
  message: 'Login successful',
};

export const mockRegisterResponse = {
  success: true,
  data: mockAuthData,
  message: 'Registration successful',
};
