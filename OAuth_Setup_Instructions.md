# Google OAuth Setup Instructions for Meet App

## Step-by-Step Google OAuth Consumer Setup

### 1. Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### 2. Create a New Project (if needed)
1. Click on the project dropdown at the top
2. Click "New Project"
3. Name your project "Meet App" or similar
4. Click "Create"

### 3. Enable Google Calendar API
1. In the left sidebar, go to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click on it and click "Enable"

### 4. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields:
     - App name: "Meet App"
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue" through all steps

### 5. Configure OAuth Client ID
1. Back in Credentials, click "Create Credentials" > "OAuth client ID"
2. Application type: "Web application"
3. Name: "Meet App OAuth Client"
4. Authorized redirect URIs:
   - Add: `https://meet-pi-weld.vercel.app/`
   - Add: `http://localhost:3000/` (for development)
5. Click "Create"

### 6. Save Your Credentials
1. Copy the Client ID and Client Secret
2. Create `config.json` in the `auth-server` directory:

```json
{
  "CLIENT_ID": "your-actual-client-id.apps.googleusercontent.com",
  "CLIENT_SECRET": "your-actual-client-secret",
  "CALENDAR_ID": "fullstackwebdev@careerfoundry.com"
}
```

### 7. Test Calendar Access
1. Go to "APIs & Services" > "Credentials"
2. Your OAuth 2.0 Client should be listed
3. Take a screenshot of this page showing your OAuth client

**IMPORTANT**: Never commit the `config.json` file to version control. It's already in `.gitignore`.

---

## Next Steps After OAuth Setup

Once you have your OAuth credentials, you can proceed with AWS Lambda setup and testing the authentication flow.
