import apiService from './apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  // Login user
  async login(email, password) {
    try {
      const response = await apiService.post('/auth/login', { email, password });
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Store token and user data
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        
        // Set token in api service
        apiService.setAuthToken(token);
        
        return { success: true, user, token };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Store token and user data
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        
        // Set token in api service
        apiService.setAuthToken(token);
        
        return { success: true, user, token };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  // Logout user
  async logout() {
    try {
      // Clear stored data
      await AsyncStorage.multiRemove(['auth_token', 'user_data']);
      
      // Remove token from api service
      apiService.removeAuthToken();
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  // Get stored user data
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(updatedData) {
    try {
      const response = await apiService.put('/auth/updatedetails', updatedData);
      
      if (response.success && response.data) {
        // Update stored user data
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
        return { success: true, user: response.data };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user password
  async updatePassword(passwordData) {
    try {
      const response = await apiService.put('/auth/updatepassword', passwordData);
      
      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Password update failed');
      }
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error: error.message };
    }
  }

  // Initialize auth service with stored token
  async initialize() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        apiService.setAuthToken(token);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;