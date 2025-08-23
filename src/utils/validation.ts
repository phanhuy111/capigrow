import { VALIDATION_PATTERNS, ERROR_MESSAGES } from './constants';

// Validation rules for React Hook Form
export const validationRules = {
  required: {
    value: true,
    message: ERROR_MESSAGES.REQUIRED_FIELD,
  },
  
  email: {
    pattern: {
      value: VALIDATION_PATTERNS.EMAIL,
      message: ERROR_MESSAGES.INVALID_EMAIL,
    },
  },
  
  phone: {
    pattern: {
      value: VALIDATION_PATTERNS.PHONE,
      message: ERROR_MESSAGES.INVALID_PHONE,
    },
    minLength: {
      value: 10,
      message: 'Phone number must be at least 10 digits',
    },
  },
  
  password: {
    minLength: {
      value: 8,
      message: ERROR_MESSAGES.PASSWORD_TOO_SHORT,
    },
    pattern: {
      value: VALIDATION_PATTERNS.PASSWORD,
      message: ERROR_MESSAGES.INVALID_PASSWORD,
    },
  },
  
  confirmPassword: (password: string) => ({
    validate: (value: string) => {
      if (value !== password) {
        return ERROR_MESSAGES.PASSWORD_MISMATCH;
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
    return VALIDATION_PATTERNS.EMAIL.test(email);
  },
  
  isStrongPassword: (password: string): boolean => {
    return VALIDATION_PATTERNS.PASSWORD.test(password);
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

// Form validation schemas
export const formSchemas = {
  phoneEntry: {
    phoneNumber: {
      ...validationRules.required,
      ...validationRules.phone,
    },
  },
  
  otpVerification: {
    otp: {
      ...validationRules.required,
      ...validationRules.otp,
    },
  },
  
  register: {
    firstName: {
      ...validationRules.required,
      minLength: {
        value: 2,
        message: 'First name must be at least 2 characters',
      },
      pattern: {
        value: /^[a-zA-Z\s]+$/,
        message: 'First name can only contain letters and spaces',
      },
    },
    lastName: {
      ...validationRules.required,
      minLength: {
        value: 2,
        message: 'Last name must be at least 2 characters',
      },
      pattern: {
        value: /^[a-zA-Z\s]+$/,
        message: 'Last name can only contain letters and spaces',
      },
    },
    email: {
      ...validationRules.required,
      ...validationRules.email,
    },
    password: {
      ...validationRules.required,
      ...validationRules.password,
    },
    confirmPassword: {
      ...validationRules.required,
    },
    phoneNumber: {
      ...validationRules.phone,
    },
  },
  
  userRegistration: {
    fullName: {
      ...validationRules.required,
      ...validationRules.fullName,
    },
    email: {
      ...validationRules.required,
      ...validationRules.email,
    },
    password: {
      ...validationRules.required,
      ...validationRules.password,
    },
    confirmPassword: {
      ...validationRules.required,
    },
    dateOfBirth: {
      ...validationRules.required,
      validate: {
        isAdult: (value: string) => customValidations.isAdult(value) || 'You must be at least 18 years old',
      },
    },
    referralCode: {
      ...validationRules.referralCode,
    },
  },
  
  investmentAmount: {
    amount: {
      ...validationRules.required,
      pattern: {
        value: /^\d+(\.\d{1,2})?$/,
        message: 'Please enter a valid amount',
      },
      validate: {
        positive: (value: string) => parseFloat(value) > 0 || 'Amount must be greater than 0',
      },
    },
  },

  createAccount: {
    firstName: {
      ...validationRules.required,
      minLength: {
        value: 2,
        message: 'First name must be at least 2 characters',
      },
      pattern: {
        value: /^[a-zA-Z\s]+$/,
        message: 'First name can only contain letters and spaces',
      },
    },
    lastName: {
      ...validationRules.required,
      minLength: {
        value: 2,
        message: 'Last name must be at least 2 characters',
      },
      pattern: {
        value: /^[a-zA-Z\s]+$/,
        message: 'Last name can only contain letters and spaces',
      },
    },
    email: {
      ...validationRules.required,
      ...validationRules.email,
    },
    dateOfBirth: {
      ...validationRules.required,
      pattern: {
        value: /^\d{2}\/\d{2}\/\d{4}$/,
        message: 'Please enter date in DD/MM/YYYY format',
      },
      validate: {
        isAdult: (value: string) => {
           const [day, month, year] = value.split('/').map(Number);
           const birthDate = new Date(year, month - 1, day);
           const today = new Date();
           let age = today.getFullYear() - birthDate.getFullYear();
           const monthDiff = today.getMonth() - birthDate.getMonth();
           if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
             age--;
           }
           return age >= 18 || 'You must be at least 18 years old';
         },
      },
    },
  },

  createPassword: {
    password: {
      ...validationRules.required,
      ...validationRules.password,
    },
    confirmPassword: {
      ...validationRules.required,
      validate: {
        matchesPassword: (value: string, { password }: any) => {
          return value === password || 'Passwords do not match';
        },
      },
    },
  },
};

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