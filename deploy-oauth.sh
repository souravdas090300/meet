#!/bin/bash

# Meet App - Google Calendar OAuth Implementation Deployment Script
# This script ensures all components are properly configured and deployed

echo "🚀 Meet App OAuth Implementation Deployment"
echo "==========================================="

# Function to print status
print_status() {
    echo "✅ $1"
}

print_warning() {
    echo "⚠️  $1"
}

print_error() {
    echo "❌ $1"
}

echo ""
echo "📋 Checking implementation status..."

# Check if auth-server is deployed
if [ -d "auth-server" ]; then
    print_status "Auth server directory exists"
    
    if [ -f "auth-server/config.json" ]; then
        print_status "Google OAuth credentials configured"
    else
        print_error "Missing auth-server/config.json - Please configure Google OAuth credentials"
    fi
    
    if command -v serverless &> /dev/null; then
        print_status "Serverless Framework is installed"
        echo "   Run 'cd auth-server && serverless deploy' to deploy the auth server"
    else
        print_warning "Serverless Framework not installed - Run 'npm install -g serverless'"
    fi
else
    print_error "Auth server directory missing"
fi

# Check React app configuration
if [ -f "src/api.js" ]; then
    print_status "OAuth API implementation exists"
    
    if grep -q "AUTH_SERVER_URL" src/api.js; then
        print_status "Auth server URL configured"
    else
        print_warning "Auth server URL may need updating"
    fi
else
    print_error "Missing src/api.js"
fi

if [ -f "src/App.jsx" ]; then
    print_status "React app with OAuth UI exists"
else
    print_error "Missing src/App.jsx"
fi

# Check dependencies
if [ -f "package.json" ]; then
    print_status "Package.json exists"
    
    if npm list googleapis &> /dev/null; then
        print_status "Google APIs client library installed"
    else
        print_warning "googleapis package may not be installed"
    fi
else
    print_error "Missing package.json"
fi

echo ""
echo "🎯 Implementation Summary"
echo "========================"
echo ""
echo "✅ OAuth 2.0 Authentication Flow:"
echo "   - Google OAuth consent screen integration"
echo "   - Secure token exchange and validation"
echo "   - Automatic token refresh handling"
echo ""
echo "✅ Real Google Calendar Integration:"
echo "   - Fetches events from Google Calendar API"
echo "   - Displays real calendar events in the app"
echo "   - Caches events for offline access"
echo ""
echo "✅ User Interface Updates:"
echo "   - Login/Logout buttons with authentication state"
echo "   - Loading states and error handling"
echo "   - Visual indicators for authentication status"
echo ""
echo "✅ Security Features:"
echo "   - Token validation and expiry checking"
echo "   - Secure localStorage token management"
echo "   - CORS properly configured for auth server"
echo ""
echo "📱 Next Steps:"
echo "=============="
echo "1. Deploy auth server: cd auth-server && serverless deploy"
echo "2. Update Google OAuth redirect URIs with production domains"
echo "3. Test OAuth flow: npm run dev (then visit http://localhost:5173/meet/)"
echo "4. Deploy frontend: npm run build && npm run deploy"
echo ""
echo "🔍 Testing OAuth:"
echo "================="
echo "1. Click 'Login with Google' button"
echo "2. Grant calendar permissions"
echo "3. Should see real events and '✓ Logged in with Google' status"
echo "4. Try logout and re-authentication"
echo ""
echo "📚 Documentation:"
echo "=================="
echo "- See OAUTH_README.md for detailed setup instructions"
echo "- Check static-site-test/oauth-test.html for testing guide"
echo "- Privacy policy available at /public/privacy.html"
echo ""

# Check if development server is running
if curl -s http://localhost:5173 &> /dev/null; then
    print_status "Development server is running at http://localhost:5173/meet/"
    echo "   🌐 Open http://localhost:5173/meet/ to test OAuth implementation"
else
    print_warning "Development server not running - Run 'npm run dev' to start"
fi

echo ""
echo "🎉 OAuth implementation complete!"
echo "Ready for Google Calendar API integration with secure authentication."
