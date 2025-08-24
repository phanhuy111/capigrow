# EAS Submit Setup Guide - CapigrowApp

✅ **EAS Submit has been configured for your project!**

## Configuration Summary

Your `eas.json` file now includes submit configurations for both iOS and Android platforms:

### iOS Configuration
- **Apple ID**: `your-apple-id@example.com` (needs to be updated)
- **ASC App ID**: `your-app-store-connect-app-id` (needs to be updated)
- **Apple Team ID**: `your-apple-team-id` (needs to be updated)
- **Bundle ID**: `com.capigrowapp` ✅ (configured in app.config.js)

### Android Configuration
- **Package Name**: `com.capigrowapp` ✅ (configured in app.config.js)
- **Service Account**: `./google-service-account.json` (needs to be created)
- **Tracks**: Internal (preview), Production (production)

## Next Steps to Complete Setup

### 1. iOS App Store Connect Setup
1. **Create App in App Store Connect**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com/)
   - Create a new app with bundle ID: `com.capigrowapp`
   - Note down the **ASC App ID** (numeric ID from the app URL)

2. **Get Your Apple Team ID**:
   - Go to [Apple Developer Account](https://developer.apple.com/account/)
   - Your Team ID is shown in the top-right corner

3. **Update eas.json**:
   ```bash
   # Edit eas.json and replace placeholder values:
   # - \"appleId\": \"your-actual-apple-id@email.com\"
   # - \"ascAppId\": \"1234567890\" (your actual ASC App ID)
   # - \"appleTeamId\": \"ABCD123456\" (your actual Team ID)
   ```

### 2. Google Play Console Setup
1. **Follow the Google Play Setup Guide**: See `GOOGLE_PLAY_SETUP.md`
2. **Create service account key** and save as `google-service-account.json`
3. **Create app in Google Play Console** with package name: `com.capigrowapp`

### 3. Building and Submitting

Once you've completed the setup, you can build and submit:

```bash
# Build for production
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit to app stores (after builds complete)
eas submit --platform ios --profile production
eas submit --platform android --profile production

# Or submit both at once
eas submit --platform all --profile production
```

### 4. Environment-Specific Submissions

```bash
# Preview/TestFlight submission
eas submit --platform ios --profile preview

# Internal testing on Google Play
eas submit --platform android --profile preview
```

## Additional Configuration Options

### Using EAS Secrets for Credentials
Instead of storing sensitive files locally, you can use EAS Secrets:

```bash
# For Google service account
eas secret:create --scope project --name GOOGLE_SERVICE_ACCOUNT_KEY --value $(base64 -i google-service-account.json)

# Update eas.json to use environment variable
# \"serviceAccountKeyPath\": \"$GOOGLE_SERVICE_ACCOUNT_KEY\"
```

### Automatic Version Incrementing
Your production builds are configured to auto-increment versions:
- iOS: `\"autoIncrement\": true`
- Android: `\"autoIncrement\": true`

## Commands Reference

```bash
# Check configuration
eas config --platform ios
eas config --platform android

# List builds
eas build:list

# List submissions
eas submit:list

# Check project status
eas project:info
```

## Troubleshooting

### Common Issues:
1. **Invalid credentials**: Ensure Apple ID, Team ID, and ASC App ID are correct
2. **Google service account**: Verify permissions in Google Play Console
3. **Bundle ID mismatch**: Ensure App Store Connect app uses `com.capigrowapp`
4. **Package name mismatch**: Ensure Google Play Console app uses `com.capigrowapp`

### Getting Help:
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Expo Discord Community](https://discord.gg/4gtbPAdpaE)
- Run `eas submit --help` for command options

---

**Status**: ✅ Configuration Complete | ❌ Credentials Needed | ❌ Store Apps Needed
