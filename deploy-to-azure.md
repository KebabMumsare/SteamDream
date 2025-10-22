# Deploy SteamDream to Azure App Service

## Current Setup:
- **Frontend (React/Vite)**: `main` branch
- **Backend (Express/TypeScript)**: `Backend` branch
- **Azure**: App Service at `https://steamdream-htceeybjh5aac8b8.swedencentral-01.azurewebsites.net/`

## ✅ Recommended Deployment Strategy:

### **Option 1: Backend Serves Frontend (Monorepo Approach)**

The backend is already configured to serve the frontend from `../Frontend/dist`.

#### Steps:

1. **Build the frontend on `main` branch:**
   ```powershell
   git checkout main
   npm install
   npm run build
   ```

2. **Switch to Backend branch and copy frontend build:**
   ```powershell
   git checkout Backend
   mkdir -p Frontend/dist
   # Copy contents from main branch's dist folder
   ```

3. **Deploy backend to Azure**

### **Option 2: Separate Deployments (Better for Production)**

Deploy frontend and backend to **separate** Azure services:

- **Frontend**: Azure Static Web Apps (free tier)
- **Backend**: Azure App Service (current one)

#### Frontend Setup:
1. Set backend URL in frontend environment:
   ```typescript
   // In frontend code:
   const API_URL = 'https://steamdream-htceeybjh5aac8b8.swedencentral-01.azurewebsites.net';
   ```

2. Deploy via GitHub Actions (already configured)

#### Backend Setup:
1. Update CORS to allow frontend domain
2. Set BASE_URL environment variable in Azure Portal
3. Deploy backend only

## 🔧 Quick Fix for Current Setup:

Your current issue is that the **frontend** is being deployed to Azure App Service, but it needs a **backend server**.

### Solution:
Use the `server.js` I created earlier (on main branch) to serve the built React app.

---

## Environment Variables Needed in Azure:

Go to Azure Portal → Your App Service → Configuration → Application Settings:

```
STEAM_API_KEY=your_steam_api_key
SESSION_SECRET=your_secret_key
BASE_URL=https://steamdream-htceeybjh5aac8b8.swedencentral-01.azurewebsites.net
NODE_ENV=production
PORT=8080
```

---

## Current GitHub Actions Issue:

The workflow `main_steamdream.yml` is deploying the **frontend** code, but Azure App Service expects a Node.js server.

### Fix:
Either:
1. Deploy backend code instead
2. Use the `server.js` approach (frontend + simple Express server)
