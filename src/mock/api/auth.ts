import { mockApiResponse, mockDelay } from "./index";

export const mockAuthApi = {
  login: async (email: string, password: string) => {
    await mockDelay(1500);

    // Simulate login validation
    if (email === "user@example.com" && password === "password123") {
      return mockApiResponse(
        {
          access_token: "mock_access_token_123",
          refresh_token: "mock_refresh_token_123",
          user: {
            id: "1",
            email: "user@example.com",
            fullName: "Nguyen Van A",
            phoneNumber: "+84123456789",
          },
        },
        true,
        "Login successful"
      );
    }

    return mockApiResponse(null, false, "Invalid credentials");
  },

  register: async (userData: {
    phoneNumber: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other";
    referralCode?: string;
  }) => {
    await mockDelay(2000);

    console.log('Mock Auth API Register called with:', userData);

    // Simulate registration validation
    if (!userData.phoneNumber || !userData.fullName || !userData.email || !userData.password) {
      return mockApiResponse(
        null,
        false,
        "Missing required fields"
      );
    }

    // Simulate successful registration
    const response = {
      access_token: "mock_access_token_456",
      refresh_token: "mock_refresh_token_456",
      user: {
        id: "user_" + Date.now().toString(),
        phoneNumber: userData.phoneNumber,
        fullName: userData.fullName,
        email: userData.email,
      },
    };

    if (__DEV__) {
      console.log('Mock Auth API Register response:', response);
    }
    
    return mockApiResponse(
      response,
      true,
      "Registration successful"
    );
  },

  verifyPhone: async (_phone: string, otp: string) => {
    await mockDelay(1000);

    // Simulate OTP verification - accept common test OTPs
    if (otp === "0000" || otp === "1234" || otp === "1111") {
      return mockApiResponse({ verified: true }, true, "Phone verified successfully");
    }

    return mockApiResponse(null, false, "Invalid OTP");
  },

  sendOtp: async (_phone: string) => {
    await mockDelay(500);

    // Simulate OTP sending
    return mockApiResponse({ sent: true }, true, "OTP sent successfully");
  },

  refreshToken: async (_refreshToken?: string) => {
    await mockDelay(500);

    return mockApiResponse(
      {
        access_token: "new_mock_access_token",
        refresh_token: "new_mock_refresh_token",
        user: {
          id: "1",
          email: "user@example.com",
          fullName: "Nguyen Van A",
          phoneNumber: "+84123456789",
        },
      },
      true,
      "Token refreshed"
    );
  },

  logout: async () => {
    await mockDelay(500);

    return mockApiResponse({ success: true }, true, "Logged out successfully");
  },

  forgotPassword: async (_email: string) => {
    await mockDelay(1000);

    return mockApiResponse({ sent: true }, true, "Password reset email sent");
  },

  resetPassword: async (_token: string, _newPassword: string) => {
    await mockDelay(1000);

    return mockApiResponse({ success: true }, true, "Password reset successfully");
  },

  createAccount: async (userData: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
  }) => {
    await mockDelay(2000);

    // Simulate account creation
    return mockApiResponse(
      {
        access_token: "mock_access_token_789",
        refresh_token: "mock_refresh_token_789",
        user: {
          id: "3",
          phoneNumber: userData.phoneNumber,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        },
      },
      true,
      "Account created successfully"
    );
  },

  sendPhoneVerification: async (_data: { phoneNumber: string; countryCode: string }) => {
    await mockDelay(1000);

    return mockApiResponse(
      {
        sessionId: "mock_session_id_123",
      },
      true,
      "OTP sent successfully"
    );
  },

  verifyOTP: async (data: { sessionId: string; otp: string }) => {
    await mockDelay(1000);

    // Simulate OTP verification - accept common test OTPs
    if (data.otp === "000000" || data.otp === "123456" || data.otp === "111111") {
      return mockApiResponse(
        {
          access_token: "mock_access_token_otp",
          refresh_token: "mock_refresh_token_otp",
          user: {
            id: "4",
            phoneNumber: "+84123456789",
            fullName: "User OTP",
            email: "user.otp@example.com",
          },
          isNewUser: false,
        },
        true,
        "OTP verified successfully"
      );
    }

    return mockApiResponse(null, false, "Invalid OTP");
  },

  resendOTP: async (sessionId: string) => {
    await mockDelay(500);

    return mockApiResponse(
      {
        sessionId: sessionId,
      },
      true,
      "OTP resent successfully"
    );
  },
};
