# Azure Deployment Guide - Frontend Only

## Prerequisites
1. Azure account
2. GitHub repository connected to Azure
3. Backend deployed separately (or running on ngrok/local)

## Deployment Steps

### Option 1: Azure Static Web Apps (Recommended)

1. **Build the frontend locally first:**
   ```bash
   npm install
   npm run build
   ```

2. **In Azure Portal:**
   - Create a new "Static Web App"
   - Connect to your GitHub repository
   - Set build configuration:
     - **App location:** `/`
     - **Api location:** `` (leave empty)
     - **Output location:** `dist`

3. **Configure environment variables in Azure:**
   - Go to your Static Web App → Configuration
   - Add new application setting:
     - **Name:** `VITE_BACKEND_URL`
     - **Value:** `https://your-backend-url.com` (your ngrok or Azure backend URL)

4. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Azure deployment config"
   git push
   ```
   
   The GitHub Action will automatically build and deploy!

### Option 2: Azure App Service (Static Site)

1. **Build the frontend:**
   ```bash
   npm install
   npm run build
   ```

2. **In Azure Portal:**
   - Create a new "App Service" (Linux or Windows)
   - Set Runtime: Node.js (latest LTS)
   - Enable "Static website"

3. **Deploy via VS Code or Azure CLI:**
   ```bash
   az webapp up --name your-app-name --resource-group your-rg --runtime "NODE:18-lts"
   ```

4. **Configure environment variables:**
   - Go to App Service → Configuration → Application settings
   - Add: `VITE_BACKEND_URL` = `https://your-backend-url.com`

## Troubleshooting 404 Errors

### If you get 404 on refresh:
- **Azure Static Web Apps:** Check `staticwebapp.config.json` is present
- **Azure App Service:** Check `web.config` is in the `dist` folder after build

### If API calls fail:
1. Set `VITE_BACKEND_URL` environment variable in Azure
2. Check CORS settings on your backend
3. Verify backend URL is accessible from Azure

### Build not working:
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Files Created for Azure

- `.github/workflows/azure-static-web-apps.yml` - GitHub Actions workflow
- `staticwebapp.config.json` - SPA routing config for Static Web Apps
- `web.config` - IIS config for App Service
- `.deployment` - Build command for Azure
- `.env.example` - Environment variable template

## Important Notes

1. **Frontend talks to separate backend** - Make sure to set `VITE_BACKEND_URL`
2. **Build before deploy** - Always run `npm run build` before deploying
3. **Environment variables** - Must be set in Azure, not just in `.env` file
4. **CORS** - Backend must allow requests from Azure frontend URL

## Next Steps

1. Deploy backend separately (Azure App Service, VM, or keep using ngrok)
2. Update `VITE_BACKEND_URL` to point to backend
3. Test all API endpoints from Azure frontend
4. Set up custom domain (optional)
