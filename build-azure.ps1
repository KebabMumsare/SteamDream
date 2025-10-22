# Build script for Azure deployment

Write-Host "Building SteamDream Frontend for Azure..." -ForegroundColor Cyan

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install

# Build the project
Write-Host "`nBuilding project..." -ForegroundColor Yellow
npm run build

Write-Host "`nBuild complete! Files are in the 'dist' folder." -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Deploy the 'dist' folder to Azure Static Web Apps or App Service"
Write-Host "  2. Set VITE_BACKEND_URL environment variable in Azure to your backend URL"
Write-Host "  3. Check AZURE_DEPLOYMENT.md for detailed instructions"

