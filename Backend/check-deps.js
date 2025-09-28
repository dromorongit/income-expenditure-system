console.log('Checking dependencies...');

try {
  const express = require('express');
  console.log('✓ Express loaded successfully');
} catch (error) {
  console.error('✗ Failed to load Express:', error.message);
}

try {
  const mongoose = require('mongoose');
  console.log('✓ Mongoose loaded successfully');
} catch (error) {
  console.error('✗ Failed to load Mongoose:', error.message);
}

try {
  const bcrypt = require('bcryptjs');
  console.log('✓ Bcryptjs loaded successfully');
} catch (error) {
  console.error('✗ Failed to load Bcryptjs:', error.message);
}

try {
  const jwt = require('jsonwebtoken');
  console.log('✓ Jsonwebtoken loaded successfully');
} catch (error) {
  console.error('✗ Failed to load Jsonwebtoken:', error.message);
}

try {
  const cors = require('cors');
  console.log('✓ Cors loaded successfully');
} catch (error) {
  console.error('✗ Failed to load Cors:', error.message);
}

try {
  const helmet = require('helmet');
  console.log('✓ Helmet loaded successfully');
} catch (error) {
  console.error('✗ Failed to load Helmet:', error.message);
}

try {
  const morgan = require('morgan');
  console.log('✓ Morgan loaded successfully');
} catch (error) {
  console.error('✗ Failed to load Morgan:', error.message);
}

try {
  const dotenv = require('dotenv');
  console.log('✓ Dotenv loaded successfully');
} catch (error) {
  console.error('✗ Failed to load Dotenv:', error.message);
}

console.log('\nDependency check complete.');