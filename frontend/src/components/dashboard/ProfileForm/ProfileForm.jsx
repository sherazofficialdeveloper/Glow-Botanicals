// components/dashboard/ProfileForm/ProfileForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Camera, Save } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/services/userService';

export const ProfileForm = ({ className = '' }) => {
  const { user, loadUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await userService.updateProfile(formData);
      await loadUser();
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic client-side validation — real validation happens server-side too.
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Please select a JPG, PNG, GIF, or WebP image.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image must be 2MB or smaller.', 'error');
      return;
    }

    setUploadingAvatar(true);
    try {
      await userService.uploadAvatar(file);
      await loadUser();
      showToast('Profile image updated successfully.', 'success');
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Unable to upload profile image. Please try again.',
        'error'
      );
    } finally {
      setUploadingAvatar(false);
      // allow re-selecting the same file again if needed
      e.target.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Avatar */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#d9006c] to-[#d4af37] flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
            {uploadingAvatar ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              formData.name?.charAt(0) || 'U'
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
            <Camera className="w-4 h-4 text-gray-600" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Profile Photo</p>
          <p className="text-xs text-gray-500">JPG, PNG or GIF (Max 2MB)</p>
        </div>
      </div>

      {/* Name */}
      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        error={errors.name}
        icon={<User className="w-4 h-4 text-gray-400" />}
      />

      {/* Email */}
      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        error={errors.email}
        icon={<Mail className="w-4 h-4 text-gray-400" />}
        disabled
      />
      <p className="text-xs text-gray-400 -mt-3">Email cannot be changed</p>

      {/* Phone */}
      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Enter your phone number"
        icon={<Phone className="w-4 h-4 text-gray-400" />}
      />

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="flex items-center space-x-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </>
        )}
      </Button>
    </form>
  );
};