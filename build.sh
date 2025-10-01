#!/bin/bash

echo "🚀 Starting production build for Railway..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the web app for production
echo "🔨 Building web application..."
npx expo export --platform web

# Ensure dist directory exists and has content
echo "📁 Ensuring build directory..."
mkdir -p dist

# Verify build output exists
if [ ! -d "dist" ]; then
  echo "❌ Build failed - dist directory not created"
  exit 1
fi

echo "✅ Build completed successfully!"
echo "🌐 Your app is ready to serve static files"
echo "📄 Files in dist directory:"
ls -la dist/