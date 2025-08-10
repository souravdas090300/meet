# Deploy to GitHub Pages (PowerShell)
Write-Host "Deploying Meet App to GitHub Pages..." -ForegroundColor Green

# Check if gh-pages is installed
$ghPagesInstalled = npm list -g gh-pages 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing gh-pages..." -ForegroundColor Yellow
    npm install -g gh-pages
}

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    
    # Verify service worker exists
    if (Test-Path "dist\sw.js") {
        Write-Host "Service worker generated successfully" -ForegroundColor Green
    } else {
        Write-Host "Service worker not found!" -ForegroundColor Red
        exit 1
    }
    
    # Deploy to GitHub Pages
    Write-Host "Deploying to GitHub Pages..." -ForegroundColor Yellow
    npx gh-pages -d dist
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployment successful!" -ForegroundColor Green
        Write-Host "App should be available at: https://souravdas090300.github.io/meet/" -ForegroundColor Cyan
        Write-Host "Service worker will be available at: https://souravdas090300.github.io/meet/sw.js" -ForegroundColor Cyan
    } else {
        Write-Host "Deployment failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
