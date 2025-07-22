# Deployment Guide for Auth Server

## What was completed:

1. ✅ **getAuthURL function** - Already implemented and working
2. ✅ **getAccessToken function** - Already implemented and working  
3. ✅ **getCalendarEvents function** - Code implemented but needs deployment
4. ✅ **test-auth-server.html** - Enhanced with complete testing functionality

## What you need to do:

### 1. Deploy the updated serverless configuration
Since I added the `getCalendarEvents` function to your `serverless.yml`, you need to redeploy:

```bash
cd auth-server
serverless deploy
```

### 2. Update the API endpoints in test-auth-server.html
After deployment, you'll get new endpoint URLs. Update these lines in `test-auth-server.html`:

```javascript
// Replace with your actual deployed endpoints
const getAuthURL = "https://YOUR_API_ID.execute-api.eu-central-1.amazonaws.com/api/get-auth-url";
const getToken = "https://YOUR_API_ID.execute-api.eu-central-1.amazonaws.com/api/token";
const getCalendarEvents = "https://YOUR_API_ID.execute-api.eu-central-1.amazonaws.com/api/get-events";
```

### 3. Test all three functions
Open `test-auth-server.html` in your browser and:

1. **Step 1**: Click "Get OAuth URL" - should return an authorization URL
2. **Step 2**: Follow the auth link, get the code, paste it, click "Get Token" 
3. **Step 3**: Click "Get Events" - should fetch your calendar events

## New Features Added:

- ✅ Complete serverless configuration for all 3 functions
- ✅ Enhanced error handling and user feedback
- ✅ Better formatting for calendar events display
- ✅ Improved UI with better styling
- ✅ Step-by-step validation and instructions

## Endpoints:
- `GET /api/get-auth-url` - Returns Google OAuth URL
- `GET /api/token/{code}` - Exchanges auth code for access token  
- `GET /api/get-events/{access_token}` - Fetches calendar events

Your tutor should now see that all three serverless functions are properly implemented and testable!
