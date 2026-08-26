// app/(auth)/forgot-password/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSubmitted(true);
        showToast('Password reset link sent to your email!', 'success');
      } else {
        setError(result.error || 'Failed to send reset link');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Check Your Email</h2>
        <p className="text-sm text-gray-600 mt-2">
          We've sent a password reset link to <br />
          <span className="font-bold text-[#d9006c]">{email}</span>
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Didn't receive the email? Check your spam folder or{' '}
          <button
            onClick={() => setSubmitted(false)}
            className="text-[#d9006c] font-bold hover:underline"
          >
            try again
          </button>
        </p>
        <Link
          href="/login"
          className="inline-block mt-6 text-sm text-[#d9006c] font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4 inline mr-1" />
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="hello@glowlybotanical.com"
          error={error}
          icon={<Mail className="w-4 h-4 text-gray-400" />}
          required
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-sm flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Send Reset Link</span>
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-gray-600 hover:text-[#d9006c] transition-colors flex items-center justify-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>
      </div>
    </>
  );
}