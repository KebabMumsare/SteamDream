#!/bin/bash
# Azure App Service startup script for Node.js

echo "Starting SteamDream Frontend..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

# Check if dist folder exists
if [ -d "dist" ]; then
    echo "✅ dist folder found"
    ls -la dist/
else
    echo "❌ dist folder not found!"
fi

# Start the server
echo "Starting Node.js server..."
node server.js
