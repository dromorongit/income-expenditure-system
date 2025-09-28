#!/bin/bash

echo "🚀 Starting production build for Railway..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the web app for production
echo "🔨 Building web application..."
npx expo build:web --config app.production.json

# Move build output to expected directory
echo "📁 Moving build files..."
mv web-build dist

# Install production server dependencies
echo "⚙️ Setting up production server..."
npm install express cors --save

echo "✅ Build completed successfully!"
echo "🌐 Your app is ready to serve from the dist/ directory"