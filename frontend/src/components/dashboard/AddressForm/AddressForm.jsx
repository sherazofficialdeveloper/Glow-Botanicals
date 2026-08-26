// components/dashboard/AddressForm/AddressForm.jsx
'use client';

import { useState } from 'react';
import { MapPin, Home, User, Phone, Save, X } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/services/userService';

export const AddressForm = ({
  address = null,
  onSuccess,
  onCancel,
  className = '',
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const isEdit = !!address;

  const [formData, setFormData] = useState({
    fullName: address?.fullName || '',
    address: address?.address || '',
    city: address?.city || '',
    state: address?.state || '',
    zipCode: address?.zipCode || '',
    country: address?.country || 'US',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit) {
        await userService.updateAddress(address._id, formData);
        showToast('Address updated successfully!', 'success');
      } else {
        await userService.addAddress(formData);
        showToast('Address added successfully!', 'success');
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      showToast(error.message || 'Failed to save address', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-gray-900">
          {isEdit ? 'Edit Address' : 'Add New Address'}
        </h4>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.fullName}
            icon={<User className="w-4 h-4 text-gray-400" />}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main Street"
            error={errors.address}
            icon={<Home className="w-4 h-4 text-gray-400" />}
          />
        </div>

        <div>
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="New York"
            error={errors.city}
          />
        </div>

        <div>
          <Input
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="NY"
            error={errors.state}
          />
        </div>

        <div>
          <Input
            label="ZIP Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="10001"
            error={errors.zipCode}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent bg-white"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="PK">Pakistan</option>
            <option value="IN">India</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            error={errors.phone}
            icon={<Phone className="w-4 h-4 text-gray-400" />}
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="rounded border-gray-300 text-[#d9006c] focus:ring-[#d9006c]"
            />
            <span>Set as default address</span>
          </label>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-2">
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
              <span>{isEdit ? 'Update Address' : 'Save Address'}</span>
            </>
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};