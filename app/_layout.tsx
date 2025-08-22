import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryProvider } from '../src/presentation/providers/QueryProvider';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// Initialize mock user for demo
import { useAuthStore } from '../src/presentation/store/authStore';

export default function RootLayout() {
  useFrameworkReady();
  
  const setUser = useAuthStore((state) => state.setUser);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    // Mock authentication for demo purposes
    const mockUser = {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      preferences: {
        theme: 'system' as const,
        notifications: true,
        language: 'en',
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };
    
    login(mockUser, 'mock-token-123');
  }, []);

  return (
    <QueryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </QueryProvider>
  );
}