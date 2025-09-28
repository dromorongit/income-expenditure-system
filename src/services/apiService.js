import API_CONFIG from '../config/apiConfig';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Set the authentication token for requests
  setAuthToken(token) {
    this.authToken = token;
  }

  // Remove the authentication token
  removeAuthToken() {
    this.authToken = null;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.authToken) {
      config.headers.Authorization = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle different response status codes
      if (response.status === 401) {
        // Unauthorized - token might be expired
        this.removeAuthToken();
        throw new Error('Unauthorized access. Please log in again.');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  }

  // GET request
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;