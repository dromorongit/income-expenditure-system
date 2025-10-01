#!/bin/bash

echo "🚀 Starting production setup for Railway..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the web app for production
echo "🔨 Building web application..."
npx expo export --platform web --config app.production.json

# Ensure dist directory exists
echo "📁 Ensuring build directory..."
mkdir -p dist

echo "✅ Setup completed successfully!"
echo "🌐 Your app is ready to serve static files"
echo "📄 Serving index.html as main page"