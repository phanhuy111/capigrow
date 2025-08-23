export default ({ config }) => {
  return {
    ...config,
    name: 'CapigrowApp',
    slug: 'capigrow-app',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#8B5CF6',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.capigrowapp',
      // Add iOS specific configurations
      infoPlist: {
        NSCameraUsageDescription: 'This app uses the camera to capture identity documents for verification.',
        NSPhotoLibraryUsageDescription: 'This app accesses your photo library to upload identity documents.',
        NSMicrophoneUsageDescription: 'This app uses the microphone for voice verification features.',
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.capigrowapp',
      permissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.CAMERA',
        'android.permission.READ_EXTERNAL_STORAGE',
      ],
    },
    plugins: [
      'expo-secure-store',
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to let you upload identity documents.',
          cameraPermission: 'The app accesses your camera to let you take photos for identity verification.',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: '92a503ce-ae2f-4278-84a4-a0693ef189fc',
      },
      // Environment variables
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.capigrow.com',
      environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
    },
    updates: {
      url: 'https://u.expo.dev/92a503ce-ae2f-4278-84a4-a0693ef189fc',
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
  };
};