import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: Error & { status?: number }) => {
        // Don't retry on 4xx errors except 408, 429
        if (
          error?.status &&
          error.status >= 400 &&
          error.status < 500 &&
          ![408, 429].includes(error.status)
        ) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error: Error & { status?: number }) => {
        // Don't retry mutations on client errors
        if (error?.status && error.status >= 400 && error.status < 500) {
          return false;
        }
        // Retry up to 2 times for server errors
        return failureCount < 2;
      },
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export { queryClient };
