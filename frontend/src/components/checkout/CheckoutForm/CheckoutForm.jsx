// components/checkout/CheckoutForm/CheckoutForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Home, Building, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/useToast';

export const CheckoutForm = ({
  onSubmit,
  loading = false,
  initialData = null,
}) => {
  const { user } = useAuth();
  const { items, total } = useCart();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    // Shipping Address
    shippingFullName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingCountry: 'US',
    shippingPhone: '',
    
    // Billing Address (same as shipping)
    sameAsShipping: true,
    billingFullName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'US',
    billingPhone: '',
    
    // Order Notes
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  // Load user saved address
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const savedAddress = user.addresses[0];
      setFormData((prev) => ({
        ...prev,
        shippingFullName: savedAddress.fullName || user.name || '',
        shippingAddress: savedAddress.address || '',
        shippingCity: savedAddress.city || '',
        shippingState: savedAddress.state || '',
        shippingZipCode: savedAddress.zipCode || '',
        shippingCountry: savedAddress.country || 'US',
        shippingPhone: savedAddress.phone || '',
      }));
      setUseSavedAddress(true);
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        shippingFullName: user.name || '',
        shippingEmail: user.email || '',
      }));
    }
  }, [user]);

  // Auto-fill billing from shipping
  useEffect(() => {
    if (formData.sameAsShipping) {
      setFormData((prev) => ({
        ...prev,
        billingFullName: prev.shippingFullName,
        billingAddress: prev.shippingAddress,
        billingCity: prev.shippingCity,
        billingState: prev.shippingState,
        billingZipCode: prev.shippingZipCode,
        billingCountry: prev.shippingCountry,
        billingPhone: prev.shippingPhone,
      }));
    }
  }, [
    formData.sameAsShipping,
    formData.shippingFullName,
    formData.shippingAddress,
    formData.shippingCity,
    formData.shippingState,
    formData.shippingZipCode,
    formData.shippingCountry,
    formData.shippingPhone,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Shipping Address Validation
    if (!formData.shippingFullName.trim()) {
      newErrors.shippingFullName = 'Full name is required';
    }
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = 'Address is required';
    }
    if (!formData.shippingCity.trim()) {
      newErrors.shippingCity = 'City is required';
    }
    if (!formData.shippingState.trim()) {
      newErrors.shippingState = 'State is required';
    }
    if (!formData.shippingZipCode.trim()) {
      newErrors.shippingZipCode = 'ZIP code is required';
    }
    if (!formData.shippingPhone.trim()) {
      newErrors.shippingPhone = 'Phone number is required';
    }
    
    // Billing Address Validation (if not same as shipping)
    if (!formData.sameAsShipping) {
      if (!formData.billingFullName.trim()) {
        newErrors.billingFullName = 'Full name is required';
      }
      if (!formData.billingAddress.trim()) {
        newErrors.billingAddress = 'Address is required';
      }
      if (!formData.billingCity.trim()) {
        newErrors.billingCity = 'City is required';
      }
      if (!formData.billingState.trim()) {
        newErrors.billingState = 'State is required';
      }
      if (!formData.billingZipCode.trim()) {
        newErrors.billingZipCode = 'ZIP code is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        name: formData.shippingFullName,
        email: user?.email || '',
        phone: formData.shippingPhone,
        shippingAddress: {
          name: formData.shippingFullName,
          street: formData.shippingAddress,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZipCode,
          country: formData.shippingCountry,
        },
        notes: formData.notes,
        items: items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: total,
      };

      // Hand the collected shipping data up to the parent, which owns
      // moving to the payment step. Order creation itself happens once
      // a payment method is chosen (the backend requires paymentMethod
      // at creation time), so we don't call the API here.
      await onSubmit(orderData);
    } catch (error) {
      showToast(error.message || 'An error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Address */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 text-[#d9006c] mr-2" />
          Shipping Address
        </h3>

        {user && user.addresses && user.addresses.length > 0 && (
          <div className="mb-4">
            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={useSavedAddress}
                onChange={(e) => {
                  setUseSavedAddress(e.target.checked);
                  if (e.target.checked) {
                    const addr = user.addresses[0];
                    setFormData((prev) => ({
                      ...prev,
                      shippingFullName: addr.fullName || user.name || '',
                      shippingAddress: addr.address || '',
                      shippingCity: addr.city || '',
                      shippingState: addr.state || '',
                      shippingZipCode: addr.zipCode || '',
                      shippingCountry: addr.country || 'US',
                      shippingPhone: addr.phone || '',
                    }));
                  }
                }}
                className="rounded border-gray-300 text-[#d9006c] focus:ring-[#d9006c]"
              />
              <span>Use saved address</span>
            </label>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <Input
              name="shippingFullName"
              value={formData.shippingFullName}
              onChange={handleChange}
              placeholder="John Doe"
              error={errors.shippingFullName}
              icon={<User className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <Input
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              placeholder="123 Main Street"
              error={errors.shippingAddress}
              icon={<Home className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <Input
              name="shippingCity"
              value={formData.shippingCity}
              onChange={handleChange}
              placeholder="New York"
              error={errors.shippingCity}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <Input
              name="shippingState"
              value={formData.shippingState}
              onChange={handleChange}
              placeholder="NY"
              error={errors.shippingState}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <Input
              name="shippingZipCode"
              value={formData.shippingZipCode}
              onChange={handleChange}
              placeholder="10001"
              error={errors.shippingZipCode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              name="shippingCountry"
              value={formData.shippingCountry}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <Input
              name="shippingPhone"
              type="tel"
              value={formData.shippingPhone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              error={errors.shippingPhone}
              icon={<Phone className="w-4 h-4 text-gray-400" />}
            />
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Building className="w-5 h-5 text-[#d9006c] mr-2" />
            Billing Address
          </h3>
          <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              name="sameAsShipping"
              checked={formData.sameAsShipping}
              onChange={handleChange}
              className="rounded border-gray-300 text-[#d9006c] focus:ring-[#d9006c]"
            />
            <span>Same as shipping</span>
          </label>
        </div>

        {!formData.sameAsShipping && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                name="billingFullName"
                value={formData.billingFullName}
                onChange={handleChange}
                placeholder="John Doe"
                error={errors.billingFullName}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <Input
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleChange}
                placeholder="123 Main Street"
                error={errors.billingAddress}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <Input
                name="billingCity"
                value={formData.billingCity}
                onChange={handleChange}
                placeholder="New York"
                error={errors.billingCity}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <Input
                name="billingState"
                value={formData.billingState}
                onChange={handleChange}
                placeholder="NY"
                error={errors.billingState}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
              </label>
              <Input
                name="billingZipCode"
                value={formData.billingZipCode}
                onChange={handleChange}
                placeholder="10001"
                error={errors.billingZipCode}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                name="billingCountry"
                value={formData.billingCountry}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <Input
                name="billingPhone"
                type="tel"
                value={formData.billingPhone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                error={errors.billingPhone}
              />
            </div>
          </div>
        )}
      </div>

      {/* Order Notes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Notes</h3>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
          placeholder="Add any special instructions or notes about your order..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || loading}
          className="px-8 py-3 text-sm"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Placing Order...
            </>
          ) : (
            'Place Order'
          )}
        </Button>
      </div>
    </form>
  );
};