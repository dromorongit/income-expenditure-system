# Backend Deployment Guide

This guide provides comprehensive instructions for deploying the Income & Expenditure System Backend to production.

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Prerequisites**
   - Docker and Docker Compose installed
   - Domain name pointing to your server

2. **Setup**
   ```bash
   # Clone the repository
   git clone <your-repo-url>
   cd income-expenditure-backend

   # Copy environment template
   cp .env.example .env

   # Edit .env with your production values
   nano .env
   ```

3. **Deploy**
   ```bash
   # Run deployment script
   ./deploy.sh

   # Or manually
   docker-compose up -d --build
   ```

4. **Verify**
   ```bash
   # Check service status
   docker-compose ps

   # View logs
   docker-compose logs -f backend

   # Health check
   curl https://your-domain.com/health
   ```

## 📋 Deployment Options

### Option 1: Docker Compose (Recommended)
- **Pros**: Easy setup, includes MongoDB, nginx, SSL
- **Cons**: Resource intensive for small servers

### Option 2: PM2 + Reverse Proxy
- **Pros**: Lightweight, direct control
- **Cons**: Requires manual setup of reverse proxy

### Option 3: Cloud Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **DigitalOcean App Platform**: Simple container deployment
- **AWS/Railway**: Full cloud infrastructure

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Required
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-super-secure-jwt-secret-here
CORS_ORIGIN=https://your-frontend-domain.com

# Optional
PORT=5000
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SSL_CERT_PATH=/path/to/certificate.pem
SSL_KEY_PATH=/path/to/private-key.pem
```

### SSL Configuration

#### Option A: Let's Encrypt (Free)
```bash
# Install certbot
sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Update .env
SSL_CERT_PATH=/etc/letsencrypt/live/your-domain.com/fullchain.pem
SSL_KEY_PATH=/etc/letsencrypt/live/your-domain.com/privkey.pem
```

#### Option B: Self-Signed (Development)
```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Update .env
SSL_CERT_PATH=./ssl/cert.pem
SSL_KEY_PATH=./ssl/key.pem
```

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale the backend
docker-compose up -d --scale backend=3

# Update and redeploy
docker-compose down
docker-compose pull
docker-compose up -d --build
```

### Manual Docker Commands

```bash
# Build image
docker build -t income-expenditure-backend .

# Run container
docker run -d \
  --name backend \
  -p 5000:5000 \
  -e MONGODB_URI="your-mongo-uri" \
  -e JWT_SECRET="your-jwt-secret" \
  income-expenditure-backend
```

## ⚙️ PM2 Deployment

### Installation
```bash
npm install -g pm2
```

### Usage
```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit

# Logs
pm2 logs

# Restart
pm2 restart income-expenditure-backend

# Stop
pm2 stop income-expenditure-backend
```

## 🌐 Reverse Proxy Setup

### Nginx Configuration

1. **Install Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name your-domain.com;

       ssl_certificate /etc/ssl/certs/certificate.pem;
       ssl_certificate_key /etc/ssl/certs/private-key.pem;

       location /api/ {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Enable and restart**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 📊 Monitoring & Logging

### Health Checks
```bash
# Local health check
curl http://localhost:5000/health

# Production health check
curl https://your-domain.com/health
```

### Log Files
- **Application logs**: `./logs/`
- **Nginx logs**: `/var/log/nginx/`
- **PM2 logs**: `pm2 logs`

### Monitoring Tools
- **PM2 Monitoring**: `pm2 monit`
- **Docker Monitoring**: `docker stats`
- **System Monitoring**: `htop`, `top`

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong JWT secrets (32+ characters)
   - Rotate secrets regularly

2. **Firewall**
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

3. **Fail2Ban** (for SSH protection)
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

4. **Updates**
   ```bash
   sudo apt update && sudo apt upgrade -y
   npm audit fix
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 5000
   lsof -i :5000

   # Kill process
   kill -9 <PID>
   ```

2. **MongoDB Connection Issues**
   ```bash
   # Test connection
   docker-compose exec mongo mongo --eval "db.stats()"

   # Check MongoDB logs
   docker-compose logs mongo
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate validity
   openssl x509 -in certificate.pem -text -noout

   # Test SSL connection
   curl -vI https://your-domain.com
   ```

4. **High Memory Usage**
   ```bash
   # Check memory usage
   docker stats

   # Restart containers
   docker-compose restart
   ```

### Debug Commands

```bash
# Check all running processes
docker-compose ps

# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend

# Enter container shell
docker-compose exec backend sh

# Check environment variables
docker-compose exec backend env
```

## 📞 Support

For issues and questions:
1. Check the logs: `docker-compose logs`
2. Verify configuration in `.env`
3. Test health endpoint: `curl https://your-domain.com/health`
4. Check system resources: `docker stats`

## 🎯 Production Checklist

- [ ] Domain name configured
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] MongoDB connection tested
- [ ] Health check working
- [ ] Firewall configured
- [ ] Backups configured
- [ ] Monitoring in place
- [ ] Load testing completed

---

**Congratulations!** 🎉 Your backend is now deployed and ready for production use.