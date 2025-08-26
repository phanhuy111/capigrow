import { VALIDATION_PATTERNS } from "@/utils/constants";

// Format currency
export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

// Format percentage
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value?.toFixed(decimals)}%`;
};

export const formatPercentageValue = (value: number) => {
  return `${value >= 0 ? "+" : ""}${value?.toFixed(2)}%`;
};

// Format date
export const formatDate = (
  date: string | Date,
  format: "short" | "long" | "relative" = "short"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  switch (format) {
    case "short":
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    case "long":
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    case "relative":
      return getRelativeTime(dateObj);
    default:
      return dateObj.toLocaleDateString();
  }
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

// Validation functions
export const validateEmail = (email: string): boolean => {
  return VALIDATION_PATTERNS.email.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return VALIDATION_PATTERNS.phone.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return VALIDATION_PATTERNS.password.test(password);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

// Calculate investment returns
export const calculateReturns = (principal: number, rate: number, time: number): number => {
  return principal * (rate / 100) * (time / 12);
};

// Calculate compound returns
export const calculateCompoundReturns = (
  principal: number,
  rate: number,
  time: number,
  compoundFrequency: number = 12
): number => {
  const r = rate / 100;
  const n = compoundFrequency;
  const t = time / 12;
  return principal * (1 + r / n) ** (n * t) - principal;
};

// Calculate portfolio allocation percentage
export const calculateAllocationPercentage = (amount: number, total: number): number => {
  if (total === 0) return 0;
  return (amount / total) * 100;
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce function
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (typeof obj === "object") {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substr(0, maxLength)}...`;
};

// Check if object is empty
export const isEmpty = (obj: unknown): boolean => {
  if (obj === null || obj === undefined) {
    return true;
  }

  if (typeof obj === "string" || Array.isArray(obj)) {
    return obj.length === 0;
  }

  if (typeof obj === "object") {
    return Object.keys(obj).length === 0;
  }

  return false;
};

// Get file extension
export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

// Check if file is image
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
};

// Generate QR code data
export const generateQRData = (data: unknown): string => {
  return JSON.stringify(data);
};

// Parse QR code data
export const parseQRData = (qrString: string): unknown => {
  try {
    return JSON.parse(qrString);
  } catch (_error) {
    return null;
  }
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};
