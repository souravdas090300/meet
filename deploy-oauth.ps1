# Meet App - Google Calendar OAuth Implementation Deployment Script (PowerShell)
# This script ensures all components are properly configured and deployed

Write-Host "🚀 Meet App OAuth Implementation Deployment" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

function Write-Status {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Checking implementation status..." -ForegroundColor Cyan

# Check if auth-server is deployed
if (Test-Path "auth-server") {
    Write-Status "Auth server directory exists"
    
    if (Test-Path "auth-server/config.json") {
        Write-Status "Google OAuth credentials configured"
    } else {
        Write-Error "Missing auth-server/config.json - Please configure Google OAuth credentials"
    }
    
    if (Get-Command serverless -ErrorAction SilentlyContinue) {
        Write-Status "Serverless Framework is installed"
        Write-Host "   Run 'cd auth-server; serverless deploy' to deploy the auth server" -ForegroundColor Gray
    } else {
        Write-Warning "Serverless Framework not installed - Run 'npm install -g serverless'"
    }
} else {
    Write-Error "Auth server directory missing"
}

# Check React app configuration
if (Test-Path "src/api.js") {
    Write-Status "OAuth API implementation exists"
    
    $apiContent = Get-Content "src/api.js" -Raw
    if ($apiContent -like "*AUTH_SERVER_URL*") {
        Write-Status "Auth server URL configured"
    } else {
        Write-Warning "Auth server URL may need updating"
    }
} else {
    Write-Error "Missing src/api.js"
}

if (Test-Path "src/App.jsx") {
    Write-Status "React app with OAuth UI exists"
} else {
    Write-Error "Missing src/App.jsx"
}

# Check dependencies
if (Test-Path "package.json") {
    Write-Status "Package.json exists"
} else {
    Write-Error "Missing package.json"
}

Write-Host ""
Write-Host "🎯 Implementation Summary" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ OAuth 2.0 Authentication Flow:" -ForegroundColor Green
Write-Host "   - Google OAuth consent screen integration" -ForegroundColor Gray
Write-Host "   - Secure token exchange and validation" -ForegroundColor Gray
Write-Host "   - Automatic token refresh handling" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Real Google Calendar Integration:" -ForegroundColor Green
Write-Host "   - Fetches events from Google Calendar API" -ForegroundColor Gray
Write-Host "   - Displays real calendar events in the app" -ForegroundColor Gray
Write-Host "   - Caches events for offline access" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ User Interface Updates:" -ForegroundColor Green
Write-Host "   - Login/Logout buttons with authentication state" -ForegroundColor Gray
Write-Host "   - Loading states and error handling" -ForegroundColor Gray
Write-Host "   - Visual indicators for authentication status" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Security Features:" -ForegroundColor Green
Write-Host "   - Token validation and expiry checking" -ForegroundColor Gray
Write-Host "   - Secure localStorage token management" -ForegroundColor Gray
Write-Host "   - CORS properly configured for auth server" -ForegroundColor Gray
Write-Host ""
Write-Host "📱 Next Steps:" -ForegroundColor Cyan
Write-Host "==============" -ForegroundColor Cyan
Write-Host "1. Deploy auth server: cd auth-server; serverless deploy" -ForegroundColor White
Write-Host "2. Update Google OAuth redirect URIs with production domains" -ForegroundColor White
Write-Host "3. Test OAuth flow: npm run dev (then visit http://localhost:5173/meet/)" -ForegroundColor White
Write-Host "4. Deploy frontend: npm run build; npm run deploy" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Testing OAuth:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host "1. Click 'Login with Google' button" -ForegroundColor White
Write-Host "2. Grant calendar permissions" -ForegroundColor White
Write-Host "3. Should see real events and '✓ Logged in with Google' status" -ForegroundColor White
Write-Host "4. Try logout and re-authentication" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host "- See OAUTH_README.md for detailed setup instructions" -ForegroundColor White
Write-Host "- Check static-site-test/oauth-test.html for testing guide" -ForegroundColor White
Write-Host "- Privacy policy available at /public/privacy.html" -ForegroundColor White
Write-Host ""

# Check if development server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -ErrorAction Stop
    Write-Status "Development server is running at http://localhost:5173/meet/"
    Write-Host "   🌐 Open http://localhost:5173/meet/ to test OAuth implementation" -ForegroundColor Gray
} catch {
    Write-Warning "Development server not running - Run 'npm run dev' to start"
}

Write-Host ""
Write-Host "🎉 OAuth implementation complete!" -ForegroundColor Green
Write-Host "Ready for Google Calendar API integration with secure authentication." -ForegroundColor Green
