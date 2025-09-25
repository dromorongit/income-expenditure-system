const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database configuration
const connectDB = require('./src/config/db');

// Import User model for seeding
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const transactionRoutes = require('./src/routes/transactions');
const budgetRoutes = require('./src/routes/budgets');
const categoryRoutes = require('./src/routes/categories');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Seed demo users
const seedDemoUsers = async () => {
  try {
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@finance.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'Lois Osei-Bonsu',
        email: 'lois.osei-bonsu@techmaven.com',
        password: 'finance123',
        role: 'finance_manager'
      },
      {
        name: 'Stephen Sayor',
        email: 'stephen.sayor@techmaven.com',
        password: 'viewer123',
        role: 'viewer'
      }
    ];

    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        await User.create({
          ...userData,
          password: hashedPassword
        });
        console.log(`Demo user ${userData.email} created`);
      }
    }
  } catch (error) {
    console.error('Error seeding demo users:', error);
  }
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
})); // Security headers

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.CORS_ORIGIN ?
      process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000', 'http://localhost:19006'];

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions)); // Enable CORS with options

// Logging middleware (only in development or with log level)
if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
  app.use(morgan('combined')); // Detailed logging
} else {
  app.use(morgan('tiny')); // Minimal logging for production
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies with size limit

// Rate limiting (basic implementation)
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter); // Apply rate limiting to API routes

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Income & Expenditure System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  try {
    await seedDemoUsers();

    // Check if SSL certificates are provided for HTTPS
    const sslCertPath = process.env.SSL_CERT_PATH;
    const sslKeyPath = process.env.SSL_KEY_PATH;

    if (sslCertPath && sslKeyPath && process.env.NODE_ENV === 'production') {
      // HTTPS server
      try {
        const privateKey = fs.readFileSync(path.resolve(sslKeyPath), 'utf8');
        const certificate = fs.readFileSync(path.resolve(sslCertPath), 'utf8');
        const credentials = { key: privateKey, cert: certificate };

        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(PORT, () => {
          console.log(`🔒 HTTPS Server is running on port ${PORT}`);
          console.log(`🌐 Server URL: https://localhost:${PORT}`);
        });

        // Redirect HTTP to HTTPS
        const httpApp = express();
        httpApp.use('*', (req, res) => {
          res.redirect(`https://${req.headers.host}${req.url}`);
        });

        const httpServer = http.createServer(httpApp);
        httpServer.listen(80, () => {
          console.log('🔄 HTTP to HTTPS redirect is active on port 80');
        });

      } catch (sslError) {
        console.error('SSL certificate error:', sslError.message);
        console.log('⚠️  Falling back to HTTP server...');

        // Fallback to HTTP
        app.listen(PORT, () => {
          console.log(`🔓 HTTP Server is running on port ${PORT}`);
          console.log(`🌐 Server URL: http://localhost:${PORT}`);
        });
      }
    } else {
      // HTTP server (development or no SSL)
      app.listen(PORT, () => {
        const protocol = process.env.NODE_ENV === 'production' ? '🔓 HTTP' : '🔧 Development HTTP';
        console.log(`${protocol} Server is running on port ${PORT}`);
        console.log(`🌐 Server URL: http://localhost:${PORT}`);
      });
    }

    // Log environment info
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 SSL Enabled: ${!!(sslCertPath && sslKeyPath)}`);
    console.log(`📝 Logging Level: ${process.env.LOG_LEVEL || 'info'}`);

  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;