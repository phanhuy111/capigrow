// Mock API functions
export * from './auth';
export * from './user';
export * from './investments';
export * from './portfolio';
export * from './transactions';
export * from './notifications';
export * from './verification';
export * from './files';

// Mock API delay function
export const mockDelay = (ms: number = 1000) => 
  new Promise<void>(resolve => setTimeout(resolve, ms));

// Mock API response wrapper
export const mockApiResponse = <T>(data: T, success: boolean = true, message?: string) => ({
  success,
  data,
  message: message || (success ? 'Success' : 'Error'),
  timestamp: new Date().toISOString(),
});
