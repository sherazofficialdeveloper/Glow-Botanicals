// app/(admin)/loading.jsx
'use client';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" text="Loading admin panel..." />
    </div>
  );
}