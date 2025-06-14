import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});


  const url = "http://localhost:4000";

  // Clear all errors
  const clearErrors = () => {
    setError(null);
    setValidationErrors({});
  };

  // Handle API errors
  const handleApiError = (err) => {
    if (err.response) {
      // Backend validation errors
      if (err.response.status === 400 && err.response.data.errors) {
        setValidationErrors(err.response.data.errors);
        return;
      }
      // Backend error message
      setError(err.response.data.message || 'An error occurred');
    } else if (err.request) {
      // Network error
      setError('Network error. Please check your connection.');
    } else {
      // Other errors
      setError('An unexpected error occurred');
    }
    throw err;
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      clearErrors();
      const response = await axios.post(`${url}/api/auth/register-rapper`, userData);
      const { rapper, accessToken } = response.data;
      
      // Store auth data
      localStorage.setItem('token', accessToken);
      setUser(rapper);
      
      return rapper;
    } catch (err) {
      handleApiError(err);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      clearErrors();
      const response = await axios.post(`${url}/api/auth/login-rapper`, { email, password });
      const { rapper, token } = response.data;
      
      // Store auth data
      localStorage.setItem('token', token);
      setUser(rapper);
      
      return rapper;
    } catch (err) {
      handleApiError(err);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      clearErrors();
      await axios.post(`${url}/api/auth/logout-rapper`);
      
      // Clear auth data
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      handleApiError(err);
    }
  };

  // Get current user
  const getCurrentUser = async () => {
    try {
      clearErrors();
      const response = await axios.get(`${url}/api/auth/current-rapper`);
      const { rapper } = response.data;
      setUser(rapper);
      return rapper;
    } catch (err) {
      handleApiError(err);
    }
  };

  // Configure axios defaults
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser();
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    validationErrors,
    clearErrors,
    register,
    login,
    logout,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
