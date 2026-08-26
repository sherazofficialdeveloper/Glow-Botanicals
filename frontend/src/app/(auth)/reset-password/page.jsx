// app/(auth)/reset-password/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const { resetPassword } = useAuth();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      showToast('Invalid or missing reset token', 'error');
      router.push('/forgot-password');
    }
  }, [token, router, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await resetPassword(token, formData.password);
      if (result.success) {
        setSubmitted(true);
        showToast('Password reset successfully!', 'success');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        showToast(result.error || 'Failed to reset password', 'error');
      }
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Password Reset Successful!</h2>
        <p className="text-sm text-gray-600 mt-2">
          Your password has been reset successfully.
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Redirecting to login...
        </p>
        <Link
          href="/login"
          className="inline-block mt-6 text-sm text-[#d9006c] font-bold hover:underline"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            label="New Password"
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
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your new password"
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

        {/* Password Requirements */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Password Requirements
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              <span>At least 8 characters</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              <span>Contains lowercase letter</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              <span>Contains uppercase letter</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              <span>Contains number</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-sm flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Resetting...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Reset Password</span>
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-gray-600 hover:text-[#d9006c] transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </>
  );
}