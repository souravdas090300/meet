# 🧪 Testing Your Serverless Function Using Static Site

## ✅ Current Setup Status

Your testing environment is perfectly set up according to the instructions:

- ✅ **HTTP Server**: Running on `http://127.0.0.1:8082` 
- ✅ **test-auth-server.html**: Located in `auth-server` directory
- ✅ **API Endpoints**: Configured with your AWS Lambda URLs
- ✅ **CORS Headers**: Already configured in your `handler.js`

## 🚀 Step-by-Step Testing Process

### **Step 1: Test Get Authorization URL**

1. **Open your browser** and go to: `http://127.0.0.1:8082/test-auth-server.html`
2. **Click the "Get OAuth URL" button**
3. **Expected Result**: You should see:
   - JSON response with `authUrl` property in the result area
   - A clickable "Click to authorize" link appears

**✅ What Should Happen:**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&response_type=code&client_id=..."
}
```

### **Step 2: Get Authorization Code**

1. **Click the "Click to authorize" link** (opens in new tab)
2. **Log in with your Google account**
3. **Grant permissions** to your Meet app
4. **You'll be redirected** to: `https://souravdas090300.github.io/meet/`
5. **Copy the authorization code** from the URL:
   ```
   https://souravdas090300.github.io/meet/?code=4/0AfJohXli...&scope=https://www.googleapis.com/auth/calendar.readonly
   ```
   ⚠️ **Important**: Copy ONLY the code part (after `code=` and before `&`)

### **Step 3: Exchange Code for Access Token**

1. **Paste the authorization code** in the "Code input" field
2. **Click "Exchange Code for Token"**
3. **Expected Result**: JSON response with access token
4. **The access token will auto-populate** in Step 3 field

**✅ What Should Happen:**
```json
{
  "access_token": "ya29.a0AfH6SMB...",
  "expires_in": 3599,
  "refresh_token": "1//04Yg...",
  "scope": "https://www.googleapis.com/auth/calendar.readonly",
  "token_type": "Bearer"
}
```

### **Step 4: Get Calendar Events**

1. **The access token should be automatically filled** from Step 2
2. **Click "Get Calendar Events"**
3. **Expected Result**: JSON response with calendar events

**✅ What Should Happen:**
```json
{
  "events": [
    {
      "id": "event_id",
      "summary": "Meeting Title",
      "start": {"dateTime": "2025-07-24T10:00:00Z"},
      "end": {"dateTime": "2025-07-24T11:00:00Z"}
    }
  ]
}
```

## 🔍 Your Current API Endpoints

Your `test-auth-server.html` is configured with:

- **Base URL**: `https://pkpsfh72t5.execute-api.eu-central-1.amazonaws.com/dev/api`
- **Get Auth URL**: `GET /get-auth-url`
- **Get Token**: `GET /token/{code}`
- **Get Events**: `GET /get-events/{access_token}`

## ✅ CORS Configuration Verified

Your `handler.js` already includes proper CORS headers:
```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}
```

## 🎯 Testing Checklist

- [ ] **Step 1 Complete**: Get OAuth URL button returns valid Google auth URL
- [ ] **Step 2 Complete**: Can complete Google authorization and get auth code
- [ ] **Step 3 Complete**: Can exchange auth code for access token
- [ ] **Step 4 Complete**: Can fetch calendar events with access token
- [ ] **No CORS Errors**: All requests work without cross-origin issues
- [ ] **All Steps Flow Smoothly**: Each step enables the next automatically

## 🚨 Important Notes

1. **Authorization codes can only be used ONCE**
2. **If Step 2 fails, get a new auth code from Step 1**
3. **Access tokens expire** (usually in 1 hour)
4. **Copy the complete auth code** (no extra characters)
5. **Don't include the & symbol** at the end of the code

## 🔧 Troubleshooting

### **If Get OAuth URL fails:**
- Check your AWS Lambda deployment
- Verify the API endpoint URL is correct
- Check browser console for errors

### **If Token Exchange fails:**
- Make sure you copied the complete authorization code
- Authorization codes can only be used once
- Get a fresh code if previous attempt failed

### **If Calendar Events fails:**
- Verify the access token is complete
- Check that your Google Calendar has events
- Ensure the calendar ID is correct in your config

## 🏆 Success Criteria

**Your serverless OAuth2 flow is working correctly when:**

✅ All three steps complete successfully  
✅ You receive valid JSON responses at each step  
✅ No CORS or network errors occur  
✅ Calendar events are retrieved successfully  

**🎉 Once all steps work, your serverless authentication is ready for integration with your React Meet app!**
