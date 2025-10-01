// Environment-specific configurations
export const ENVIRONMENTS = {
  development: {
    apiUrl: 'http://192.168.56.1:5000/api/v1',
    enableLogging: true,
    enableErrorReporting: false,
    timeout: 15000,
    retryAttempts: 0,
  },
  staging: {
    apiUrl: 'https://your-staging-api.herokuapp.com/api/v1',
    enableLogging: true,
    enableErrorReporting: true,
    timeout: 10000,
    retryAttempts: 2,
  },
  production: {
    apiUrl: 'https://income-expenditure-system-production.up.railway.app/api/v1',
    enableLogging: false,
    enableErrorReporting: true,
    timeout: 10000,
    retryAttempts: 3,
  }
};

// Get current environment
export const getCurrentEnvironment = () => {
  if (__DEV__) {
    return 'development';
  }

  // Check environment variable or default to production
  const env = process.env.NODE_ENV || 'production';
  return env;
};

// Get environment-specific configuration
export const getEnvironmentConfig = (environment = getCurrentEnvironment()) => {
  return ENVIRONMENTS[environment] || ENVIRONMENTS.production;
};