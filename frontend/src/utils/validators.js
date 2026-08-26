// frontend/src/utils/validators.js

export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 7 && cleaned.length <= 15;
};

export const isValidPassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

export const isValidName = (name) => {
  if (!name) return false;
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const isValidUrl = (url) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidZipCode = (zip) => {
  if (!zip) return false;
  const cleaned = zip.replace(/\s/g, '');
  return /^[0-9]{5}(-[0-9]{4})?$/.test(cleaned);
};

export const isValidSlug = (slug) => {
  if (!slug) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null;
  if (!isValidPhone(phone)) return 'Please enter a valid phone number';
  return null;
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (name.trim().length > 50) return 'Name cannot exceed 50 characters';
  return null;
};

export default {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidName,
  isValidUrl,
  isValidZipCode,
  isValidSlug,
  validateRequired,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
  validateName,
};