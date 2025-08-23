import { VALIDATION_PATTERNS, ERROR_MESSAGES } from '@/utils/constants';

// Validation rules for React Hook Form
export const validationRules = {
  required: {
    value: true,
    message: 'This field is required',
  },

  email: {
    pattern: {
      value: VALIDATION_PATTERNS.email,
      message: 'Please enter a valid email address',
    },
  },

  phone: {
    pattern: {
      value: VALIDATION_PATTERNS.phone,
      message: 'Please enter a valid phone number',
    },
    minLength: {
      value: 10,
      message: 'Phone number must be at least 10 digits',
    },
  },

  password: {
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
    pattern: {
      value: VALIDATION_PATTERNS.password,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    },
  },

  confirmPassword: (password: string) => ({
    validate: (value: string) => {
      if (value !== password) {
        return 'Passwords do not match';
      }
      return true;
    },
  }),
  
  fullName: {
    minLength: {
      value: 2,
      message: 'Full name must be at least 2 characters',
    },
    maxLength: {
      value: 50,
      message: 'Full name must not exceed 50 characters',
    },
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: 'Full name can only contain letters and spaces',
    },
  },
  
  otp: {
    pattern: {
      value: /^\d{6}$/,
      message: 'OTP must be 6 digits',
    },
  },
  
  referralCode: {
    pattern: {
      value: /^[A-Z0-9]{6,10}$/,
      message: 'Referral code must be 6-10 alphanumeric characters',
    },
  },
};

// Custom validation functions
export const customValidations = {
  isValidPhoneNumber: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  },
  
  isValidEmail: (email: string): boolean => {
    return VALIDATION_PATTERNS.email.test(email);
  },
  
  isStrongPassword: (password: string): boolean => {
    return VALIDATION_PATTERNS.password.test(password);
  },
  
  isValidOTP: (otp: string): boolean => {
    return /^\d{6}$/.test(otp);
  },
  
  isAdult: (dateOfBirth: string): boolean => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    
    return age >= 18;
  },
};

// Note: Form validation schemas have been migrated to Zod schemas in individual components
// The validationRules and customValidations above are kept for reference

// Utility functions for form handling
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const formatOTP = (otp: string): string => {
  return otp.replace(/\D/g, '').slice(0, 6);
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak';
  if (password.length < 8) return 'medium';
  if (customValidations.isStrongPassword(password)) return 'strong';
  return 'medium';
};