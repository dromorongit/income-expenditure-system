# Performance Optimization Guide

This guide covers optimization strategies for the Income & Expenditure System Backend.

## 🚀 Performance Optimization Checklist

### ✅ Completed Optimizations

1. **Database Optimization**
   - MongoDB indexes on frequently queried fields
   - Connection pooling configured
   - Query optimization implemented

2. **Security Enhancements**
   - Helmet security headers
   - CORS configuration
   - Rate limiting implemented
   - Input validation and sanitization

3. **Caching Strategy**
   - Static file caching headers
   - Database query result caching
   - Session management optimization

4. **Monitoring & Logging**
   - Structured logging with Morgan
   - Health check endpoints
   - Error tracking and reporting

### 🔄 Recommended Optimizations

## 📊 Database Optimization

### MongoDB Indexes
```javascript
// Ensure these indexes exist in your MongoDB collections

// Users collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "isActive": 1 })

// Transactions collection
db.transactions.createIndex({ "createdBy": 1, "date": -1 })
db.transactions.createIndex({ "status": 1 })
db.transactions.createIndex({ "category": 1 })
db.transactions.createIndex({ "type": 1, "date": -1 })

// Budgets collection
db.budgets.createIndex({ "categoryId": 1, "year": 1, "month": 1 })
db.budgets.createIndex({ "year": 1, "month": 1 })

// Categories collection
db.categories.createIndex({ "type": 1 })
db.categories.createIndex({ "name": 1 })
```

### Connection Pooling
```javascript
// In your database configuration
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,        // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false,  // Disable mongoose buffering
  bufferMaxEntries: 0,    // Disable mongoose buffering
});
```

## 🔧 Application Optimization

### Memory Management
```javascript
// Monitor memory usage
const memUsage = process.memoryUsage();
console.log('Memory Usage:', {
  rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
  heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
  heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
  external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
});
```

### Response Compression
```javascript
// Add compression middleware
const compression = require('compression');
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

## 🌐 Frontend Optimization

### Bundle Optimization
```json
// app.json optimization settings
{
  "expo": {
    "optimization": {
      "bundle": true,
      "minify": true,
      "treeShake": true
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "enableProguardInReleaseBuilds": true,
            "enableShrinkResourcesInReleaseBuilds": true
          }
        }
      ]
    ]
  }
}
```

### Image Optimization
```javascript
// Optimize images before deployment
// Use tools like:
// - ImageOptim (macOS)
// - TinyPNG (web service)
// - Squoosh (Google tool)
```

## 📈 Caching Strategy

### HTTP Caching Headers
```javascript
// Add caching headers for static assets
app.use('/static', express.static('public', {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));
```

### Database Query Caching
```javascript
// Implement Redis caching for frequently accessed data
const redis = require('redis');
const client = redis.createClient();

const getCachedData = async (key, fetchFunction, ttl = 3600) => {
  const cached = await client.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const data = await fetchFunction();
  await client.setex(key, ttl, JSON.stringify(data));
  return data;
};
```

## 🔍 Monitoring & Analytics

### Performance Monitoring
```javascript
// Add performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
});
```

### Health Check Endpoint
```javascript
// Enhanced health check
app.get('/health', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  };

  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    healthCheck.database = 'connected';
    healthCheck.status = 'healthy';
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.database = 'disconnected';
    healthCheck.status = 'unhealthy';
    healthCheck.error = error.message;
    res.status(503).json(healthCheck);
  }
});
```

## 🚀 Deployment Optimization

### PM2 Cluster Mode
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'income-expenditure-backend',
    script: 'server.js',
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster', // Enable cluster mode
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    // ... other configurations
  }]
};
```

### Nginx Optimization
```nginx
# Optimized nginx configuration
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL and security optimizations
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

    location /api/ {
        limit_req zone=api burst=20 nodelay;

        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;

        # CORS optimization
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;

        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

## 📊 Load Testing

### Using Apache Bench
```bash
# Test API endpoints
ab -n 1000 -c 10 https://your-domain.com/api/v1/transactions

# Test with authentication
ab -n 1000 -c 10 -H "Authorization: Bearer YOUR_JWT_TOKEN" https://your-domain.com/api/v1/transactions
```

### Using Artillery
```yaml
# artillery.yml
config:
  target: 'https://your-domain.com'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Normal load'
    - duration: 120
      arrivalRate: 50
      name: 'High load'
scenarios:
  - name: 'Get transactions'
    get:
      url: '/api/v1/transactions'
      headers:
        Authorization: 'Bearer YOUR_JWT_TOKEN'
```

## 🔧 System Optimization

### Linux System Tuning
```bash
# Increase file limits
echo 'fs.file-max = 2097152' >> /etc/sysctl.conf

# Increase network settings
echo 'net.core.somaxconn = 65536' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_max_syn_backlog = 65536' >> /etc/sysctl.conf

# Apply changes
sysctl -p

# Increase user limits
echo '* soft nofile 65536' >> /etc/security/limits.conf
echo '* hard nofile 65536' >> /etc/security/limits.conf
```

### Docker Optimization
```dockerfile
# Multi-stage build for smaller images
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine as production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Performance Metrics

### Key Metrics to Monitor
- **Response Time**: < 200ms for API calls
- **Throughput**: > 1000 requests/second
- **Error Rate**: < 0.1%
- **Memory Usage**: < 80% of available RAM
- **CPU Usage**: < 70% average

### Monitoring Tools
- **PM2 Monitoring**: `pm2 monit`
- **New Relic**: Application performance monitoring
- **DataDog**: Infrastructure and application monitoring
- **Grafana + Prometheus**: Custom metrics dashboard

## 🚨 Performance Issues & Solutions

### High Memory Usage
```javascript
// Implement memory cleanup
if (global.gc) {
  global.gc();
}

// Monitor and restart if memory usage is high
const memUsage = process.memoryUsage();
if (memUsage.heapUsed > 100 * 1024 * 1024) { // 100MB
  console.log('High memory usage detected, triggering garbage collection');
  if (global.gc) global.gc();
}
```

### Slow Database Queries
```javascript
// Add query logging
mongoose.set('debug', process.env.NODE_ENV === 'development');

// Optimize queries
const transactions = await Transaction.find({})
  .populate('category')
  .sort({ date: -1 })
  .limit(100)
  .lean(); // Use lean() for read-only operations
```

### High CPU Usage
```javascript
// Implement connection pooling
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Use connection pooling
mongoose.connect(MONGODB_URI, options);
```

## 🎯 Optimization Checklist

- [ ] Database indexes created
- [ ] Caching implemented
- [ ] Compression enabled
- [ ] Monitoring configured
- [ ] Load testing completed
- [ ] SSL optimized
- [ ] Images optimized
- [ ] Bundle minified
- [ ] CDN configured (if needed)
- [ ] Database connection pooled

## 📞 Support & Resources

### Performance Tools
- **Apache Bench**: https://httpd.apache.org/docs/2.4/programs/ab.html
- **Artillery**: https://artillery.io/
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **WebPageTest**: https://www.webpagetest.org/

### Documentation
- **Node.js Performance**: https://nodejs.org/en/docs/guides/simple-profiling/
- **MongoDB Optimization**: https://docs.mongodb.com/manual/administration/analyzing-performance/
- **Express Optimization**: https://expressjs.com/en/advanced/best-practice-performance.html

---

**Optimization Complete!** ⚡ Your application is now optimized for production performance.