# Google Play Console Service Account Setup

To submit your app to Google Play Store using EAS Submit, you need to set up a Google Cloud service account.

## Steps to Create Service Account:

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Play Android Developer API

### 2. Create a Service Account

1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Give it a name like "EAS Submit Service Account"
4. Click **Create and Continue**

### 3. Generate Service Account Key

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Select **JSON** format
5. Download the file and save it as `google-service-account.json` in your project root
6. **Important**: Add this file to your `.gitignore`

### 4. Link Service Account to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console/)
2. Go to **Setup** > **API access**
3. Click **Link a Google Cloud project**
4. Select your Google Cloud project
5. Click **Link project**

### 5. Grant Permissions

1. In Google Play Console > **Setup** > **API access**
2. Find your service account in the list
3. Click **Grant access**
4. Grant the following permissions:
   - **Releases**: View and edit app information and download bulk reports
   - **App access**: View app information
   - **Financial data**: View financial reports

## Security Notes:

- Never commit the `google-service-account.json` file to version control
- Store it securely and limit access
- Consider using environment variables for CI/CD pipelines
