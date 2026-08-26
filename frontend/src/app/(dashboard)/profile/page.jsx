// app/(dashboard)/profile/page.jsx
'use client';

import { ProfileForm } from '@/components/dashboard/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500">Manage your account information</p>
      </div>

      <div className="max-w-2xl">
        <ProfileForm />
      </div>
    </div>
  );
}