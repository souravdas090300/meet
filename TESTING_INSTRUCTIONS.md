# Testing Guide for Serverless OAuth2 Functions

## Current Status
✅ HTTP server is running on http://127.0.0.1:8080
✅ Test HTML file is ready with both Step 1 and Step 2
✅ Serverless functions are configured
✅ CORS headers are properly set

## Testing Steps

### Step 1: Test the getAuthURL Function
1. Open your browser and go to: http://127.0.0.1:8080
2. Click on `test-auth-server.html`
3. On the OAuth2 Test page, click the "Get OAuth URL" button
4. You should see a JSON response with an authUrl
5. Click the "Click to authorize" link
6. This will redirect you to Google's authorization page

### Step 2: Test the getAccessToken Function
1. After authorizing in Google, you'll be redirected back to your GitHub Pages site
2. Copy the authorization code from the URL (the part after `code=` and before `&` if present)
3. Go back to your test page (http://127.0.0.1:8080/test-auth-server.html)
4. Paste the code into the "Code input" field
5. Click "Get Token"
6. You should receive an access token in the response

## Endpoints Being Tested
- GET Auth URL: https://ym392rf9u2.execute-api.eu-central-1.amazonaws.com/api/get-auth-url
- Get Token: https://ym392rf9u2.execute-api.eu-central-1.amazonaws.com/api/token/{code}

## Troubleshooting
- If you get CORS errors, check the browser console
- If the authorization code doesn't work, make sure to copy only the code part (no & or other parameters)
- Authorization codes can only be used once - get a new one if needed
- Make sure you're testing from the correct localhost URL

## What This Tests
- OAuth2 authorization flow
- Serverless function deployment
- CORS configuration
- Token exchange process
- Error handling
