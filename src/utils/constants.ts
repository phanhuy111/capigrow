// Colors - Updated to match Figma design
export const COLORS = {
  // Primary colors (Purple theme from Figma)
  primary: "#8B5CF6",
  primaryLight: "#A855F7",
  primaryDark: "#7C3AED",
  primarySurface: "#F3E8FF",

  // Secondary colors (Green for success/positive)
  secondary: "#4CAF50",
  secondaryLight: "#66BB6A",
  secondaryDark: "#388E3C",
  secondaryLight10: "rgba(76, 175, 80, 0.1)",

  // Accent colors
  accent: "#FF6B35",
  accentLight: "#FF8A65",
  accentDark: "#E64A19",

  // Neutral colors
  white: "#FFFFFF",
  black: "#000000",
  gray50: "#FAFAFA",
  gray100: "#F5F5F5",
  gray200: "#EEEEEE",
  gray300: "#E0E0E0",
  gray400: "#BDBDBD",
  gray500: "#9E9E9E",
  gray600: "#757575",
  gray700: "#616161",
  gray800: "#424242",
  gray900: "#212121",

  // Status colors
  success: "#4CAF50",
  successLight: "#C8E6C9",
  successDark: "#2E7D32",
  warning: "#FF9800",
  warningLight: "#FFE0B2",
  warningDark: "#F57C00",
  error: "#F44336",
  errorLight: "#FFCDD2",
  errorDark: "#D32F2F",
  info: "#2196F3",
  infoLight: "#BBDEFB",
  infoDark: "#1976D2",

  // Background colors
  background: "#FAFAFA",
  backgroundSecondary: "#F5F5F5",
  surface: "#FFFFFF",
  surfaceVariant: "#F8F9FA",
  overlay: "rgba(0, 0, 0, 0.5)",
  overlayLight: "rgba(0, 0, 0, 0.3)",

  // Text colors
  textPrimary: "#212121",
  textSecondary: "#757575",
  textTertiary: "#9E9E9E",
  textDisabled: "#BDBDBD",
  textOnPrimary: "#FFFFFF",
  textOnSecondary: "#FFFFFF",
  textOnSurface: "#212121",
  textOnBackground: "#212121",

  // Border colors
  border: "#E0E0E0",
  borderLight: "#F0F0F0",
  borderDark: "#BDBDBD",
  divider: "#E0E0E0",

  // Investment specific colors
  positive: "#4CAF50",
  negative: "#F44336",
  neutral: "#9E9E9E",
};

// Typography - Updated to match Figma design (SF Pro Text)
export const FONTS = {
  light: "SF Pro Text",
  regular: "SF Pro Text",
  medium: "SF Pro Text",
  semiBold: "SF Pro Text",
  bold: "SF Pro Text",
};

export const FONT_WEIGHTS = {
  light: "300" as const,
  regular: "400" as const,
  medium: "500" as const,
  semiBold: "600" as const,
  bold: "700" as const,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  xxxxl: 28,
  xxxxxl: 32,
  xxxxxxl: 36,
};

export const LINE_HEIGHTS = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 22,
  xl: 24,
  xxl: 28,
  xxxl: 32,
  xxxxl: 36,
  xxxxxl: 40,
  xxxxxxl: 44,
};

// Spacing - Updated to match Figma design system
export const SPACING = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  xxxxl: 32,
  xxxxxl: 40,
  xxxxxxl: 48,
  xxxxxxxl: 56,
  xxxxxxxxl: 64,
};

// Border radius - Updated to match Figma design
export const BORDER_RADIUS = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  round: 50,
  circle: 9999,
};

// Component specific spacing
export const COMPONENT_SPACING = {
  button: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxxl,
    marginVertical: SPACING.md,
  },
  input: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    marginVertical: SPACING.md,
  },
  card: {
    padding: SPACING.xl,
    margin: SPACING.md,
  },
  screen: {
    padding: SPACING.xl,
  },
};

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Screen dimensions
export const SCREEN_PADDING = SPACING.md;

// Investment risk levels
export const RISK_LEVELS = {
  low: {
    label: "Low Risk",
    color: COLORS.success,
    description: "Conservative investments with stable returns",
  },
  medium: {
    label: "Medium Risk",
    color: COLORS.warning,
    description: "Balanced investments with moderate returns",
  },
  high: {
    label: "High Risk",
    color: COLORS.error,
    description: "Aggressive investments with high potential returns",
  },
};

// Investment status
export const INVESTMENT_STATUS = {
  draft: {
    label: "Draft",
    color: COLORS.gray500,
  },
  active: {
    label: "Active",
    color: COLORS.success,
  },
  paused: {
    label: "Paused",
    color: COLORS.warning,
  },
  closed: {
    label: "Closed",
    color: COLORS.error,
  },
  completed: {
    label: "Completed",
    color: COLORS.info,
  },
};

// Transaction status
export const TRANSACTION_STATUS = {
  pending: {
    label: "Pending",
    color: COLORS.warning,
  },
  processing: {
    label: "Processing",
    color: COLORS.info,
  },
  completed: {
    label: "Completed",
    color: COLORS.success,
  },
  failed: {
    label: "Failed",
    color: COLORS.error,
  },
  cancelled: {
    label: "Cancelled",
    color: COLORS.gray500,
  },
};

// Verification status
export const VERIFICATION_STATUS = {
  pending: {
    label: "Pending",
    color: COLORS.warning,
    description: "Your verification is being processed",
  },
  under_review: {
    label: "Under Review",
    color: COLORS.info,
    description: "Our team is reviewing your documents",
  },
  approved: {
    label: "Approved",
    color: COLORS.success,
    description: "Your identity has been verified",
  },
  rejected: {
    label: "Rejected",
    color: COLORS.error,
    description: "Verification failed. Please try again",
  },
};

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: "http://localhost:8080/api/v1",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  PHONE_VERIFICATION: "/auth/phone/verify",
  OTP_VERIFICATION: "/auth/otp/verify",
  USER_REGISTRATION: "/auth/user/register",
  RESEND_OTP: "/auth/otp/resend",
  CREATE_ACCOUNT: "/auth/account/create",
  USER: {
    PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
  },
  INVESTMENTS: {
    LIST: "/investments",
    DETAILS: "/investments/:id",
    REGISTER: "/investments/:id/register",
    CATEGORIES: "/investments/categories",
  },
  PORTFOLIO: {
    OVERVIEW: "/portfolio",
    PERFORMANCE: "/portfolio/performance",
  },
  TRANSACTIONS: {
    LIST: "/transactions",
    DETAILS: "/transactions/:id",
    PAYMENT: "/transactions/payment",
  },
  VERIFICATION: {
    DOCUMENTS: "/verification/documents",
    SELFIE: "/verification/selfie",
    STATUS: "/verification/status",
  },
  FILES: {
    UPLOAD: "/files/upload",
    GET: "/files/:id",
    DELETE: "/files/:id",
  },
};

// Form validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-()]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Session expired. Please login again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
  FILE_UPLOAD_ERROR: "Failed to upload file. Please try again.",
  CAMERA_PERMISSION: "Camera permission is required to take photos.",
  STORAGE_PERMISSION: "Storage permission is required to select files.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back!",
  REGISTER_SUCCESS: "Account created successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
  DOCUMENT_UPLOADED: "Document uploaded successfully!",
  INVESTMENT_REGISTERED: "Investment registered successfully!",
  PAYMENT_PROCESSED: "Payment processed successfully!",
};
