import Constants from 'expo-constants';
import { getEnvironmentConfig, getCurrentEnvironment } from './environments';

// Environment-based API configuration
const getApiBaseUrl = () => {
  const currentEnv = getCurrentEnvironment();
  const envConfig = getEnvironmentConfig(currentEnv);

  // Check for environment variable override
  const envUrl = Constants.expoConfig?.extra?.apiUrl;
  if (envUrl) {
    return envUrl;
  }

  // Return environment-specific URL
  return envConfig.apiUrl;
};

const getEnvironmentSettings = () => {
  const currentEnv = getCurrentEnvironment();
  return getEnvironmentConfig(currentEnv);
};

const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: getEnvironmentSettings().timeout,
  RETRY_ATTEMPTS: getEnvironmentSettings().retryAttempts,
  ENABLE_LOGGING: getEnvironmentSettings().enableLogging,
  ENABLE_ERROR_REPORTING: getEnvironmentSettings().enableErrorReporting,
  ENVIRONMENT: getCurrentEnvironment(),
};

export default API_CONFIG;