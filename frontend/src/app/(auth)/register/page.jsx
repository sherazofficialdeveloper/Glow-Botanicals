// frontend/src/app/(auth)/register/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');

    if (name === 'password') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ Prevent page refresh
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (result.success) {
        showToast('Account created successfully! 🎉', 'success');
        router.push('/dashboard');
      } else {
        setServerError(result.error || 'Registration failed. Please try again.');
        showToast(result.error || 'Registration failed', 'error');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
      setServerError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordStrong = Object.values(passwordStrength).every(v => v === true);

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-sm text-gray-500 mt-1">
          Join Glowly Botanical and start your glow journey
        </p>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          error={errors.name}
          icon={<User className="w-4 h-4 text-gray-400" />}
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="hello@glowlybotanical.com"
          error={errors.email}
          icon={<Mail className="w-4 h-4 text-gray-400" />}
          required
        />

        <Input
          label="Phone Number (Optional)"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          icon={<Phone className="w-4 h-4 text-gray-400" />}
        />

        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 8 characters"
            error={errors.password}
            icon={<Lock className="w-4 h-4 text-gray-400" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {formData.password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-1/4 h-1 rounded-full ${passwordStrength.length ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                <div className={`w-1/4 h-1 rounded-full ${passwordStrength.uppercase ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                <div className={`w-1/4 h-1 rounded-full ${passwordStrength.lowercase ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                <div className={`w-1/4 h-1 rounded-full ${passwordStrength.number ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              </div>
              <p className={`text-xs ${isPasswordStrong ? 'text-emerald-600' : 'text-gray-400'}`}>
                {isPasswordStrong ? '✓ Strong password' : 'Password must contain: 8+ chars, uppercase, lowercase, number'}
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            icon={<CheckCircle className="w-4 h-4 text-gray-400" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div>
          <label className="flex items-start space-x-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-0.5 rounded border-gray-300 text-[#d9006c] focus:ring-[#d9006c]"
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" className="text-[#d9006c] font-medium hover:underline" target="_blank">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy-policy" className="text-[#d9006c] font-medium hover:underline" target="_blank">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600 mt-1">{errors.acceptTerms}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-sm flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Create Account</span>
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-[#d9006c] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}