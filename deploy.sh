#!/bin/bash

# Income & Expenditure System Backend Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="income-expenditure-backend"

echo "🚀 Starting deployment for $PROJECT_NAME in $ENVIRONMENT environment..."

# Check if required tools are installed
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required but not installed. Aborting."; exit 1; }

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p ssl
mkdir -p mongo-init

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your production values before continuing."
    echo "🔧 Required variables: MONGODB_URI, JWT_SECRET, CORS_ORIGIN"
    read -p "Press enter when you've configured the .env file..."
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Pull latest images
echo "⬇️  Pulling latest images..."
docker-compose pull

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Services are running:"
    docker-compose ps
    echo ""
    echo "📊 Service URLs:"
    echo "🔗 API: https://your-domain.com/api/v1"
    echo "🔗 Health Check: https://your-domain.com/health"
    echo ""
    echo "📝 Useful commands:"
    echo "🐳 View logs: docker-compose logs -f"
    echo "🛑 Stop services: docker-compose down"
    echo "🔄 Restart services: docker-compose restart"
    echo "🧹 Clean up: docker system prune -f"
else
    echo "❌ Deployment failed. Check logs with: docker-compose logs"
    exit 1
fi

# Run health check
echo "🔍 Running health check..."
if curl -f -k https://localhost/health >/dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "⚠️  Health check failed. The service might still be starting up."
    echo "🔍 Check logs with: docker-compose logs backend"
fi

echo "🎉 Deployment completed successfully!"