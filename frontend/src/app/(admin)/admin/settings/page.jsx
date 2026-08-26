// app/(admin)/admin/settings/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, CreditCard, Truck, Globe, Mail, Shield } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminService.getSettings();
        setSettings(data);
      } catch (error) {
        showToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [showToast]);

  const settingsSections = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Store name, description, contact information',
      icon: Globe,
      path: '/admin/settings/general',
    },
    {
      id: 'payment',
      title: 'Payment Settings',
      description: 'Configure payment methods and gateways',
      icon: CreditCard,
      path: '/admin/settings/payment',
    },
    {
      id: 'shipping',
      title: 'Shipping Settings',
      description: 'Shipping rates, zones, and methods',
      icon: Truck,
      path: '/admin/settings/shipping',
    },
    {
      id: 'email',
      title: 'Email Settings',
      description: 'SMTP configuration and email templates',
      icon: Mail,
      path: '/admin/settings/email',
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Authentication, SSL, and security preferences',
      icon: Shield,
      path: '/admin/settings/security',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#d9006c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your store settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.id}
              href={section.path}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#d9006c]/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4 group-hover:bg-[#d9006c]/10 transition-colors">
                <Icon className="w-6 h-6 text-[#d9006c]" />
              </div>
              <h3 className="font-bold text-gray-900">{section.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{section.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}