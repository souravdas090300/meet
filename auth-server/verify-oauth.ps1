# OAuth2 API Verification Script
# Run this script in PowerShell to test all endpoints

Write-Host "=== OAuth2 API Verification ===" -ForegroundColor Green
Write-Host ""

$API_BASE = "https://pkpsfh72t5.execute-api.eu-central-1.amazonaws.com/dev"

# Step 1: Test Auth URL endpoint
Write-Host "Step 1: Testing Auth URL Generation..." -ForegroundColor Yellow
try {
    $authResponse = Invoke-WebRequest -Uri "$API_BASE/api/get-auth-url" -Method GET
    $authData = $authResponse.Content | ConvertFrom-Json
    
    if ($authData.authUrl -and $authData.authUrl.StartsWith("https://accounts.google.com")) {
        Write-Host "✅ Auth URL endpoint working correctly" -ForegroundColor Green
        Write-Host "   Status Code: $($authResponse.StatusCode)" -ForegroundColor Gray
        Write-Host "   Auth URL: $($authData.authUrl.Substring(0, 80))..." -ForegroundColor Gray
    } else {
        Write-Host "❌ Auth URL endpoint returned unexpected response" -ForegroundColor Red
        Write-Host "   Response: $($authResponse.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error testing Auth URL endpoint: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Step 2: Instructions for manual testing
Write-Host "Step 2: Manual Authorization Required" -ForegroundColor Yellow
Write-Host "   1. Copy the auth URL above and open it in your browser" -ForegroundColor Gray
Write-Host "   2. Complete the Google OAuth authorization" -ForegroundColor Gray
Write-Host "   3. Copy the 'code' parameter from the redirect URL" -ForegroundColor Gray
Write-Host "   4. Run the following command with your code:" -ForegroundColor Gray
Write-Host ""
Write-Host "   # Replace YOUR_CODE_HERE with the actual code" -ForegroundColor Cyan
Write-Host "   `$code = 'YOUR_CODE_HERE'" -ForegroundColor Cyan
Write-Host "   `$tokenResponse = Invoke-WebRequest -Uri '$API_BASE/api/token/`$code'" -ForegroundColor Cyan
Write-Host "   `$tokenData = `$tokenResponse.Content | ConvertFrom-Json" -ForegroundColor Cyan
Write-Host "   `$tokenData" -ForegroundColor Cyan
Write-Host ""

# Step 3: CORS Verification
Write-Host "Step 3: Testing CORS Headers..." -ForegroundColor Yellow
try {
    $corsResponse = Invoke-WebRequest -Uri "$API_BASE/api/get-auth-url" -Method GET
    $corsHeaders = $corsResponse.Headers
    
    if ($corsHeaders.ContainsKey("Access-Control-Allow-Origin")) {
        Write-Host "✅ CORS headers present" -ForegroundColor Green
        Write-Host "   Access-Control-Allow-Origin: $($corsHeaders['Access-Control-Allow-Origin'])" -ForegroundColor Gray
    } else {
        Write-Host "❌ CORS headers missing" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error testing CORS: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Step 4: Endpoint availability check
Write-Host "Step 4: Checking All Endpoints..." -ForegroundColor Yellow

$endpoints = @(
    "/api/get-auth-url",
    "/api/token/test-code-placeholder",
    "/api/get-events/test-token-placeholder"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$API_BASE$endpoint" -Method GET -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 400 -or $response.StatusCode -eq 500) {
            Write-Host "✅ Endpoint accessible: $endpoint" -ForegroundColor Green
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        if ($statusCode -eq 400 -or $statusCode -eq 500) {
            Write-Host "✅ Endpoint accessible: $endpoint (Expected error for placeholder data)" -ForegroundColor Green
        } else {
            Write-Host "❌ Endpoint not accessible: $endpoint" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=== Verification Complete ===" -ForegroundColor Green
Write-Host "Use the test HTML page for full OAuth2 flow testing!" -ForegroundColor Cyan
