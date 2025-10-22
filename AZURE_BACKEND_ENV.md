# Azure Backend Environment Variables

## Go to Azure Portal:
**Backend App Service**: `steamdream-server-ffcxf5g6c9crdzgv`
→ Configuration → Application Settings → New application setting

## Required Environment Variables:

```
STEAM_API_KEY=YOUR_STEAM_API_KEY_HERE
SESSION_SECRET=your-random-secret-key-here
BASE_URL=https://steamdream-server-ffcxf5g6c9crdzgv.swedencentral-01.azurewebsites.net
NODE_ENV=production
PORT=8080
```

## Important Notes:

1. **STEAM_API_KEY**: Get from https://steamcommunity.com/dev/apikey
2. **SESSION_SECRET**: Generate a random string (e.g., use a password generator)
3. **BASE_URL**: Your backend URL (for Steam OAuth redirects)
4. **PORT**: Azure automatically sets this to 8080
5. **NODE_ENV**: Set to `production` for production environment

## After Setting These:
1. Restart your Backend App Service
2. Check the logs to verify it starts correctly

## CORS Configuration:
✅ Already updated in `server.ts` to allow:
- Frontend: https://steamdream-htceeybjh5aac8b8.swedencentral-01.azurewebsites.net
- Local dev: http://localhost:5173
- ngrok domains
