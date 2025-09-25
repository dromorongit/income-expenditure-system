#!/bin/bash
# Production startup script

echo "🚀 Starting Income & Expenditure Backend in production mode..."

# Check if MongoDB is running
if ! pgrep mongod > /dev/null; then
    echo "❌ MongoDB is not running. Please start MongoDB first."
    exit 1
fi

# Set production environment
export NODE_ENV=production

# Start with PM2
pm2 start ecosystem.prod.json

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup

echo "✅ Backend started successfully!"
echo "📊 Status: pm2 status"
echo "📝 Logs: pm2 logs"
echo "🔄 Restart: pm2 restart income-expenditure-backend"
