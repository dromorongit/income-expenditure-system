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
if [ ! -d "dist" ]; then
  echo "❌ Build failed - dist directory not created"
  exit 1
fi

# Verify the React app was built (check for index.html in dist)
if [ ! -f "dist/index.html" ]; then
  echo "❌ Build failed - React app not found in dist/index.html"
  exit 1
fi

echo "✅ Build completed successfully!"
echo "🌐 React app built and ready to serve"
echo "📄 Built files:"
ls -la dist/