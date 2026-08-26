// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor.
//
// IMPORTANT: this backend does not implement a refresh-token endpoint
// (there is no POST /auth/refresh route), so this interceptor does NOT
// attempt to silently renew an expired access token — doing so would
// just be a dead call to a route that doesn't exist. Instead:
//
// - A 401 on a login/register/password-reset request is a normal
//   invalid-credentials/validation error. It's exempted here and just
//   rejects with the real backend message intact, so the calling page
//   can show it (e.g. "Invalid email or password").
// - A 401 on any other (already-authenticated) request means the
//   session has genuinely expired or is otherwise no longer valid.
//   We clear local auth state and send the user back to login with a
//   clear, honest message, rather than pretending we can silently fix
//   it or showing a confusing technical error.
const AUTH_ENDPOINTS_EXEMPT_FROM_SESSION_HANDLING = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/forgot-password-otp',
  '/auth/reset-password',
  '/auth/reset-password-otp',
  '/auth/resend-otp',
  '/auth/verify-email',
];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const isExemptAuthEndpoint = AUTH_ENDPOINTS_EXEMPT_FROM_SESSION_HANDLING.some(
      (path) => originalRequest?.url?.includes(path)
    );

    if (error.response?.status === 401 && !isExemptAuthEndpoint && typeof window !== 'undefined') {
      const hadToken = !!localStorage.getItem('accessToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Only force a redirect (with a session-expired message) if the
      // user actually had a session — if there was never a token, this
      // 401 is just an anonymous request hitting a protected route,
      // not an expired session, so no need to redirect/interrupt them.
      if (hadToken && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?sessionExpired=true';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
