# Credentials Setup Guide

This guide will help you set up the necessary credentials for building and deploying the CapiGrow app.

## Prerequisites

1. **EAS CLI**: Make sure you have EAS CLI installed and are logged in
   ```bash
   npm install -g @expo/eas-cli
   eas login
   ```

2. **Expo Account**: Ensure you're logged into the correct Expo account

## Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual values:
   - `EXPO_PUBLIC_API_URL`: Your backend API URL
   - `EXPO_PUBLIC_ENVIRONMENT`: Current environment (development/staging/production)

## iOS Credentials

### Apple Developer Account Setup

1. **Apple Developer Account**: Ensure you have an active Apple Developer account
2. **App Store Connect**: Create your app in App Store Connect
3. **Bundle Identifier**: Use `com.capigrowapp` (already configured)

### Configure iOS Credentials

1. **Automatic (Recommended)**:
   ```bash
   eas credentials
   ```
   Follow the prompts to automatically generate certificates and provisioning profiles.

2. **Manual Setup**:
   - Update `eas.json` submit.production.ios section with your actual values:
     - `appleId`: Your Apple ID email
     - `ascAppId`: Your App Store Connect app ID
     - `appleTeamId`: Your Apple Developer Team ID

## Android Credentials

### Google Play Console Setup

1. **Google Play Console**: Create your app in Google Play Console
2. **Package Name**: Use `com.capigrowapp` (already configured)

### Configure Android Credentials

1. **Automatic (Recommended)**:
   ```bash
   eas credentials
   ```
   EAS will generate a keystore for you.

2. **Manual Setup**:
   - Create a service account in Google Cloud Console
   - Download the service account JSON file
   - Rename it to `google-service-account.json` and place it in the project root
   - Update `.gitignore` to exclude this file

## Build Commands

### Development Build
```bash
eas build --profile development --platform all
```

### Preview Build
```bash
eas build --profile preview --platform all
```

### Production Build
```bash
eas build --profile production --platform all
```

## Submission

### iOS App Store
```bash
eas submit --platform ios
```

### Google Play Store
```bash
eas submit --platform android
```

## Security Notes

- Never commit sensitive credentials to version control
- Use EAS Secrets for sensitive environment variables:
  ```bash
  eas secret:create --scope project --name SECRET_NAME --value secret_value
  ```
- Keep your `.env` file local and never commit it
- The `google-service-account.json` file should never be committed

## Troubleshooting

1. **Certificate Issues**: Run `eas credentials` to regenerate
2. **Build Failures**: Check the build logs in EAS dashboard
3. **Submission Issues**: Ensure all required metadata is filled in App Store Connect/Google Play Console

For more detailed information, visit the [EAS Documentation](https://docs.expo.dev/build/introduction/).