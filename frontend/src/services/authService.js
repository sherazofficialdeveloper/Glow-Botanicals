// frontend/src/services/authService.js
import { api } from './api';

export const authService = {
  // ✅ Register - Returns full response
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data.data; // { user, token }
    } catch (error) {
      // ✅ Throw error with message from backend
      const message = error.response?.data?.message || error.message || 'Registration failed';
      const status = error.response?.status;
      const code = error.response?.data?.code;
      
      const err = new Error(message);
      err.status = status;
      err.code = code;
      throw err;
    }
  },

  // ✅ Login
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      const status = error.response?.status;
      
      const err = new Error(message);
      err.status = status;
      throw err;
    }
  },

  // Get current user
  async getMe() {
    try {
      const response = await api.get('/users/me');
      return response.data.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to send reset link';
      throw new Error(message);
    }
  },

  // Reset password
  async resetPassword(token, password) {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reset password';
      throw new Error(message);
    }
  },

  // Send OTP
  async sendOTP(email) {
    try {
      const response = await api.post('/auth/forgot-password-otp', { email });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to send OTP';
      throw new Error(message);
    }
  },

  // Verify OTP and reset password
  async verifyOTPAndReset(email, otp, newPassword) {
    try {
      const response = await api.post('/auth/reset-password-otp', { email, otp, newPassword });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reset password';
      throw new Error(message);
    }
  },

  // Resend OTP
  async resendOTP(email) {
    try {
      const response = await api.post('/auth/resend-otp', { email });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to resend OTP';
      throw new Error(message);
    }
  },

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to verify email';
      throw new Error(message);
    }
  },

  // Update profile
  async updateProfile(data) {
    try {
      const response = await api.put('/users/profile', data);
      return response.data.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update profile';
      throw new Error(message);
    }
  },
};

export default authService;