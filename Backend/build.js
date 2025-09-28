// Production build optimization script
const fs = require('fs');
const path = require('path');

console.log('🔨 Starting production build optimization...');

// Create logs directory
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('📁 Created logs directory');
}

// Create SSL directory
const sslDir = path.join(__dirname, 'ssl');
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
  console.log('🔒 Created SSL directory');
}

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📤 Created uploads directory');
}

// Optimize package.json for production
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

if (packageJson.scripts) {
  // Remove development scripts from production
  delete packageJson.scripts.dev;
  delete packageJson.scripts['test-connection'];
  delete packageJson.scripts['check-deps'];

  // Update scripts for production
  packageJson.scripts['start'] = 'node server.js';
  packageJson.scripts['build'] = 'echo "Build completed successfully"';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('⚙️  Optimized package.json for production');
}

// Create production-ready .env template
const envExamplePath = path.join(__dirname, '.env.example');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('📋 Created .env file from template');
  console.log('⚠️  Please update .env with your production values');
}

// Create nginx configuration
const nginxConf = `events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    upstream backend {
        server 127.0.0.1:5000;
    }

    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name localhost;

        ssl_certificate /etc/ssl/certs/localhost.pem;
        ssl_certificate_key /etc/ssl/certs/localhost-key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;

        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # CORS headers
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;

            if ($request_method = 'OPTIONS') {
                return 204;
            }
        }

        location /health {
            access_log off;
            return 200 "healthy\\n";
            add_header Content-Type text/plain;
        }
    }
}`;

fs.writeFileSync(path.join(__dirname, 'nginx.prod.conf'), nginxConf);
console.log('🌐 Created production nginx configuration');

// Create PM2 production configuration
const pm2Config = {
  apps: [{
    name: 'income-expenditure-backend',
    script: 'server.js',
    instances: 'max',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};

fs.writeFileSync(path.join(__dirname, 'ecosystem.prod.json'), JSON.stringify(pm2Config, null, 2));
console.log('⚙️  Created PM2 production configuration');

// Create startup script
const startupScript = `#!/bin/bash
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
`;

fs.writeFileSync(path.join(__dirname, 'start.sh'), startupScript);
fs.chmodSync(path.join(__dirname, 'start.sh'), '755');
console.log('🚀 Created production startup script');

console.log('🎉 Production build optimization completed!');
console.log('');
console.log('📋 Next steps:');
console.log('1. Update .env with your production values');
console.log('2. Configure SSL certificates');
console.log('3. Update nginx.prod.conf with your domain');
console.log('4. Run ./start.sh to start the production server');
console.log('');
console.log('⚠️  Remember to:');
console.log('- Update JWT_SECRET with a secure random string');
console.log('- Configure MONGODB_URI for your production database');
console.log('- Set up SSL certificates for HTTPS');
console.log('- Configure firewall rules');
console.log('- Set up monitoring and logging');