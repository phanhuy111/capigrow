import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  lastName: z.string().min(2, 'Họ phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
  phoneNumber: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP phải có 6 số'),
});

// Investment validation schemas
export const investmentAmountSchema = z.object({
  amount: z.number().min(100000, 'Số tiền đầu tư tối thiểu là 100,000 VND'),
  duration: z.number().min(1, 'Thời gian đầu tư tối thiểu là 1 tháng'),
  riskLevel: z.enum(['low', 'medium', 'high'], {
    message: 'Vui lòng chọn mức độ rủi ro',
  }),
});

// Profile validation schemas
export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  lastName: z.string().min(2, 'Họ phải có ít nhất 2 ký tự'),
  phoneNumber: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Mật khẩu hiện tại phải có ít nhất 6 ký tự'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmNewPassword'],
});

// Verification validation schemas
export const verificationDocumentSchema = z.object({
  documentType: z.enum(['id_card', 'passport', 'driver_license'], {
    message: 'Vui lòng chọn loại giấy tờ',
  }),
  documentNumber: z.string().min(8, 'Số giấy tờ phải có ít nhất 8 ký tự'),
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  dateOfBirth: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  placeOfIssue: z.string().min(2, 'Nơi cấp phải có ít nhất 2 ký tự'),
  dateOfIssue: z.string().min(1, 'Vui lòng chọn ngày cấp'),
  dateOfExpiry: z.string().min(1, 'Vui lòng chọn ngày hết hạn'),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type InvestmentAmountFormData = z.infer<typeof investmentAmountSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type VerificationDocumentFormData = z.infer<typeof verificationDocumentSchema>;