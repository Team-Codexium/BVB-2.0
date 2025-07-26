import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const API_URL = 'http://localhost:4000';

  // Keep token in sync with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Helper to clear errors
  const clearErrors = () => {
    setError(null);
    setValidationErrors({});
  };

  // Helper to handle API errors
  const handleApiError = (err) => {
    if (err.response) {
      if (err.response.status === 400 && err.response.data.errors) {
        setValidationErrors(err.response.data.errors);
        return;
      }
      setError(err.response.data.message || 'An error occurred');
    } else if (err.request) {
      setError('Network error. Please check your connection.');
    } else {
      setError('An unexpected error occurred');
    }
    throw err;
  };

  // Email verification methods
  const sendOTP = async (email) => {
    try {
      clearErrors();
      const res = await axios.post(`${API_URL}/api/email-verification/send-otp`, { email });
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      clearErrors();
      const res = await axios.post(`${API_URL}/api/email-verification/verify-otp`, { email, otp });
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  const resendOTP = async (email) => {
    try {
      clearErrors();
      const res = await axios.post(`${API_URL}/api/email-verification/resend-otp`, { email });
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  const checkEmailVerification = async (email) => {
    try {
      clearErrors();
      const res = await axios.get(`${API_URL}/api/email-verification/check/${email}`);
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  };

  // Register
  const register = async (userData) => {
    setLoading(true);
    try {
      clearErrors();
      const res = await axios.post(`${API_URL}/api/auth/register-rapper`, userData);
      const { rapper, accessToken } = res.data;
      setToken(accessToken);
      setUser(rapper);
      return rapper;
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      clearErrors();
      const res = await axios.post(`${API_URL}/api/auth/login-rapper`, { email, password });
      const { rapper, token: loginToken } = res.data;
      setToken(loginToken);
      setUser(rapper);
      return rapper;
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      clearErrors();
      await axios.post(`${API_URL}/api/auth/logout-rapper`);
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Get current user from backend
  const getCurrentUser = async () => {
    setLoading(true);
    try {
      clearErrors();
      if (!token) return null;
      const res = await axios.get(`${API_URL}/api/auth/current-rapper`);
      const { rapper } = res.data;
      setUser(rapper);
      return rapper;
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // On mount, if token exists, fetch user
  useEffect(() => {
    if (token) {
      getCurrentUser();
    }
    // eslint-disable-next-line
  }, []);

  // When token changes (after login/register), fetch user
  useEffect(() => {
    if (token && !user) {
      getCurrentUser();
    }
    // eslint-disable-next-line
  }, [token]);

  const updateUser = async(formData) => {
    setLoading(true);
    try {
      const response = await axios.patch(`${API_URL}/api/rappers/update`, formData, {headers: { Authorization: `Bearer ${token}` } });
      console.log(response)
      setUser(response.data.rapper);
      setLoading(false);
      return response.data.rapper;
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const value = {
    API_URL,
    user, setUser,
    token,
    loading,
    error,
    validationErrors,
    clearErrors,
    register,
    login,
    logout,
    getCurrentUser,
    // Email verification methods
    sendOTP,
    verifyOTP,
    resendOTP,
    checkEmailVerification,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
