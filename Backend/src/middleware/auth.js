const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token' 
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'User role is not authorized to access this route'
      });
    }
    next();
  };
};

// Check if user has specific permission
const hasPermission = (...permissions) => {
  return (req, res, next) => {
    // Check if user has 'all' permission (super admin)
    if (req.user.permissions.includes('all')) {
      return next();
    }
    
    // Check if user has any of the required permissions
    const hasPerm = permissions.some(permission => 
      req.user.permissions.includes(permission)
    );
    
    if (!hasPerm) {
      return res.status(403).json({
        success: false,
        message: 'User does not have required permissions'
      });
    }
    
    next();
  };
};

module.exports = {
  protect,
  authorize,
  hasPermission
};
