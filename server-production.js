const express = require('express');
const path = require('path');
const cors = require('cors');

// Create express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from web-build directory
app.use(express.static(path.join(__dirname, 'web-build')));

// Handle React Router - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  res.sendFile(path.join(__dirname, 'web-build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Frontend server running on port ${PORT}`);
  console.log(`📱 Serving Income & Expenditure System`);
  console.log(`🌐 Access your app at: http://localhost:${PORT}`);
});

module.exports = app;