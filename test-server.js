const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Simple middleware
app.use(express.json());

// Simple route
app.get('/', (req, res) => {
  res.json({ message: 'Income & Expenditure System API - Test Server' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
});

module.exports = app;