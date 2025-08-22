import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters');

// Validation utilities
export const createValidator = <T>(schema: z.ZodSchema<T>) => 
  (data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
    try {
      const validData = schema.parse(data);
      return { success: true, data: validData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => err.message)
        };
      }
      return { success: false, errors: ['Validation failed'] };
    }
  };

export const validateAsync = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> => {
  try {
    const validData = await schema.parseAsync(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};