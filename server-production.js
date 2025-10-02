const express = require('express');
const path = require('path');
const cors = require('cors');

// Create express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from dist directory (React app)
app.use(express.static(path.join(__dirname, 'dist')));

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'API endpoints available',
    backend: 'https://income-expenditure-system-production.up.railway.app/api/v1',
    documentation: 'See backend API documentation'
  });
});

// Default route - serve React app index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Simple 404 handler - serve React app for SPA routing
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Frontend server running on port ${PORT}`);
  console.log(`📱 Serving Income & Expenditure System`);
  console.log(`🌐 Access your app at: http://localhost:${PORT}`);
  console.log(`🔗 Backend API: https://income-expenditure-system-production.up.railway.app/api/v1`);
});

module.exports = app;