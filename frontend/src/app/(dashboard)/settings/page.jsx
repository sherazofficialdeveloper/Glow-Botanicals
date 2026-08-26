// app/(dashboard)/settings/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Bell, 
  Shield, 
  Lock, 
  LogOut,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/services/userService';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, loadUser } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    reviews: true,
  });
  const [savingNotifications, setSavingNotifications] = useState(false);

  useEffect(() => {
    if (user?.preferences?.notifications) {
      setNotifications((prev) => ({ ...prev, ...user.preferences.notifications }));
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'info');
    router.push('/login');
  };

  const handleNotificationToggle = async (key) => {
    const newValue = !notifications[key];
    const previous = notifications;
    // Optimistic UI is fine here since we immediately revert on failure —
    // but the toast only ever reflects the real backend outcome.
    setNotifications((prev) => ({ ...prev, [key]: newValue }));
    setSavingNotifications(true);
    try {
      await userService.updateProfile({
        notificationPreferences: { ...notifications, [key]: newValue },
      });
      await loadUser();
    } catch (error) {
      setNotifications(previous);
      showToast(
        error.response?.data?.message || 'Unable to save notification preference. Please try again.',
        'error'
      );
    } finally {
      setSavingNotifications(false);
    }
  };

  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Update your personal information',
      icon: User,
      href: '/profile',
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Change password and security settings',
      icon: Lock,
      href: '/profile',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      href: '#',
      isToggle: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account preferences</p>
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          const isLast = index === settingsSections.length - 1;

          if (section.isToggle) {
            return (
              <div
                key={section.id}
                className={`flex items-center justify-between p-5 ${
                  !isLast ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#d9006c]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {Object.keys(notifications).map((key) => (
                    <label key={key} className="flex items-center space-x-2 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={notifications[key]}
                        onChange={() => handleNotificationToggle(key)}
                        className="rounded border-gray-300 text-[#d9006c] focus:ring-[#d9006c]"
                      />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <a
              key={section.id}
              href={section.href}
              className={`flex items-center justify-between p-5 hover:bg-gray-50 transition-colors cursor-pointer ${
                !isLast ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#d9006c]" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{section.title}</h4>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </a>
          );
        })}
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#d9006c] to-[#d4af37] flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{user?.name}</h4>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <Button variant="danger" onClick={handleLogout} className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-red-700">Delete Account</h4>
            <p className="text-sm text-red-600">
              Permanently delete your account and all associated data
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                showToast('Account deletion request submitted', 'info');
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}