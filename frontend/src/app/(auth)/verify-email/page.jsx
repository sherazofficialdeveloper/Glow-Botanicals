// app/(auth)/verify-email/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { authService } from '@/services/authService';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const { user } = useAuth();
  const { showToast } = useToast();

  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  // Verify email if token exists
  useEffect(() => {
    if (token) {
      handleVerify(token);
    }
  }, [token]);

  const handleVerify = async (token) => {
    setVerifying(true);
    setError('');
    try {
      await authService.verifyEmail(token);
      setVerified(true);
      showToast('Email verified successfully!', 'success');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to verify email');
      showToast('Failed to verify email', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!user?.email) {
      showToast('Please login to resend verification email', 'error');
      router.push('/login');
      return;
    }

    setResending(true);
    try {
      await authService.resendVerification(user.email);
      showToast('Verification email sent!', 'success');
    } catch (err) {
      showToast('Failed to resend verification email', 'error');
    } finally {
      setResending(false);
    }
  };

  // If verified, show success
  if (verified) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Email Verified!</h2>
        <p className="text-sm text-gray-600 mt-2">
          Your email has been verified successfully.
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

  // If error, show error
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Verification Failed</h2>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
        <div className="mt-6 space-y-3">
          <Button
            onClick={handleResend}
            disabled={resending}
            className="w-full flex items-center justify-center space-x-2"
          >
            {resending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Resend Verification Email</span>
              </>
            )}
          </Button>
          <Link
            href="/login"
            className="block text-sm text-gray-600 hover:text-[#d9006c] transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // Default: Waiting for verification
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-rose-100 text-[#d9006c] flex items-center justify-center mx-auto mb-4">
        <Mail className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
      <p className="text-sm text-gray-600 mt-2">
        We've sent a verification link to your email address.
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Please check your inbox and click the link to verify your account.
      </p>

      <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 text-left">
            Didn't receive the email? Check your spam folder or click the button below to resend.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          onClick={handleResend}
          disabled={resending}
          className="w-full flex items-center justify-center space-x-2"
        >
          {resending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Resend Verification Email</span>
            </>
          )}
        </Button>
        <Link
          href="/login"
          className="block text-sm text-gray-600 hover:text-[#d9006c] transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}