import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Demo users for testing
  const mockUsers = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@finance.com',
      role: 'admin'
    },
    {
      id: 2,
      name: 'Lois Osei-Bonsu',
      email: 'lois.osei-bonsu@techmaven.com',
      role: 'finance_manager'
    },
    {
      id: 3,
      name: 'Stephen Sayor',
      email: 'stephen.sayor@techmaven.com',
      role: 'viewer'
    }
  ];

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Initialize auth service with stored token
      await authService.initialize();
      
      const userData = await authService.getUserData();
      const authStatus = await authService.isAuthenticated();
      
      if (userData && authStatus) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      const result = await authService.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      const result = await authService.logout();
      
      if (result.success) {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      return result;
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const result = await authService.updateProfile(updatedData);
      
      if (result.success) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      return await authService.updatePassword(passwordData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes('all') || user.permissions.includes(permission);
  };

  const isRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateProfile,
    updatePassword,
    hasPermission,
    isRole,
    mockUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};