export default ({ config }) => {
  return {
    ...config,
    name: 'Capigrow',
    slug: 'capigrow-app',
    version: '1.0.1',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash-logo.png',
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
      "expo-font",
      "expo-router",
      "expo-web-browser",
    ],
    extra: {
      eas: {
        projectId: '654acd6d-830a-4f40-bb94-6e4966dfa313',
      },
      // Environment variables
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.capigrow.com',
      environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
    },
    // updates: {
    //   url: 'will be configured after project creation'
    // },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
  };
};