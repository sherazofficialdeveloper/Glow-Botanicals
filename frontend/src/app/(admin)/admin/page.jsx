// app/(admin)/admin/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// The parent (admin) layout already redirects unauthenticated users to
// /login and authenticated non-admins to /dashboard before this page's
// content ever renders. By the time this component actually shows
// anything, the user is confirmed authenticated + admin, so all that's
// left to do is send them on to the Admin Dashboard.
export default function AdminIndexPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAdmin) {
      router.replace('/admin/dashboard');
    }
  }, [loading, isAdmin, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner text="Loading Admin Panel..." />
    </div>
  );
}
