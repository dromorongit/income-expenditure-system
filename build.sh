#!/bin/bash

echo "🚀 Starting production setup for Railway..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Copy necessary files for production
echo "📁 Setting up production files..."
mkdir -p public
cp index.html public/ 2>/dev/null || true
cp -r assets public/ 2>/dev/null || true

echo "✅ Setup completed successfully!"
echo "🌐 Your app is ready to serve static files"
echo "📄 Serving index.html as main page"