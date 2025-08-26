// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  date_of_birth?: string;
  profile_image_url?: string;
  is_active: boolean;
  is_verified: boolean;
  verification_status: "pending" | "verified" | "rejected";
  investor_type?: "retail" | "accredited" | "institutional";
  risk_tolerance?: "low" | "medium" | "high";
  investment_goals?: string[];
  annual_income?: number;
  net_worth?: number;
  liquid_assets?: number;
  two_factor_enabled: boolean;
  last_login_at?: string;
  timezone: string;
  language: string;
  created_at: string;
  updated_at: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at?: string;
}

// Investment Types
export interface Investment {
  id: string;
  title: string;
  description: string;
  category: string;
  min_amount: number;
  max_amount: number;
  target_amount: number;
  current_amount: number;
  expected_return: number;
  risk_level: "low" | "medium" | "high";
  duration: number;
  status: "draft" | "active" | "paused" | "closed" | "completed";
  start_date?: string;
  end_date?: string;
  maturity_date?: string;
  image_url?: string;
  document_urls?: string[];
  tags?: string[];
  terms?: string;
  conditions?: string;
  actual_return: number;
  created_at: string;
  updated_at: string;
}

export interface UserInvestment {
  id: string;
  user_id: string;
  investment_id: string;
  investment: Investment;
  amount: number;
  shares: number;
  price_per_share: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  investment_date: string;
  maturity_date?: string;
  current_value: number;
  total_returns: number;
  return_rate: number;
  created_at: string;
  updated_at: string;
}

// Portfolio Types
export interface Portfolio {
  id: string;
  user_id: string;
  total_invested: number;
  current_value: number;
  total_returns: number;
  return_percentage: number;
  investments: UserInvestment[];
  created_at: string;
  updated_at: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  user_id: string;
  investment_id?: string;
  type: "investment" | "withdrawal" | "dividend" | "fee";
  amount: number;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  payment_method?: string;
  reference_number?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Verification Types
export interface IdentityVerification {
  id: string;
  user_id: string;
  document_type: "passport" | "national_id" | "drivers_license";
  document_number?: string;
  document_front_url?: string;
  document_back_url?: string;
  selfie_url?: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  rejection_reason?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Welcome: { phoneNumber?: string };
  PhoneEntry: undefined;
  OTPVerification: { phoneNumber: string; isLogin?: boolean };
  CreatePassword: {
    phoneNumber: string;
    userInfo: { firstName: string; lastName: string; email: string; dateOfBirth: string };
  };
  MainTabs: undefined;
  Notifications: undefined;
  NotificationDetail: {
    notificationId: string;
    title: string;
    message: string;
    createdAt: string;
    type: string;
  };
  IdentityVerification: undefined;
  VerificationDocument: undefined;
  VerificationSelfie: undefined;
  VerificationStatus: undefined;
  InvestmentDetails: { investmentId: string };
  InvestmentAmount: { investmentId: string };
  InvestmentReview: { investmentId: string; amount: number };
  PaymentConfirmation: { transactionId: string };
  PaymentProcessing: { transactionId: string };
  BankTransferQR: { transactionId: string };
  ComponentsDemo: undefined;
  Profile: undefined;
  BottomSheetDemo: undefined;
  CommonSuccessScreen: {
    title: string;
    description: string;
    buttonText: string;
    onButtonPress?: () => void;
    navigateToScreen?: string;
    navigateParams?: any;
  };
};

export type AuthStackParamList = RootStackParamList;

export type MainTabParamList = {
  Home: undefined;
  Investments: undefined;
  Portfolio: undefined;
  Transactions: undefined;
  Profile: undefined;
};

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "phone" | "date" | "select";
  placeholder?: string;
  required?: boolean;
  validation?: Record<string, unknown>;
  options?: { label: string; value: string }[];
}

// Component Props Types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

// Store Types
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface InvestmentState {
  investments: Investment[];
  userInvestments: UserInvestment[];
  selectedInvestment: Investment | null;
  isLoading: boolean;
  error: string | null;
}

export interface PerformanceData {
  totalReturn: number;
  returnPercentage: number;
  periodReturns: { period: string; return: number }[];
  riskMetrics?: Record<string, number>;
}

export interface PortfolioState {
  portfolio: Portfolio | null;
  performance: PerformanceData | null;
  isLoading: boolean;
  error: string | null;
}

export interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export interface VerificationState {
  verification: IdentityVerification | null;
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  investment: InvestmentState;
  portfolio: PortfolioState;
  transaction: TransactionState;
  verification: VerificationState;
}
