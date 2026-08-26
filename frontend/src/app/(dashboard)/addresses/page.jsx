// app/(dashboard)/addresses/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, MapPin, Home } from 'lucide-react';
import { AddressForm } from '@/components/dashboard/AddressForm';
import { Button } from '@/components/common/Button';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/services/userService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function AddressesPage() {
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await userService.getAddresses();
      setAddresses(data);
    } catch (error) {
      showToast('Failed to load addresses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await userService.deleteAddress(id);
      showToast('Address deleted successfully', 'success');
      fetchAddresses();
    } catch (error) {
      showToast('Failed to delete address', 'error');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading addresses..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <p className="text-sm text-gray-500">
            {addresses.length} saved addresses
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </Button>
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <AddressForm
            address={editingAddress}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Addresses Saved</h3>
          <p className="text-sm text-gray-500 mt-1">
            Add your first address for faster checkout
          </p>
          <Button onClick={handleAdd} className="mt-4">
            Add Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`bg-white rounded-xl p-6 shadow-sm border ${
                address.isDefault ? 'border-[#d9006c] ring-2 ring-[#d9006c]/20' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                    <Home className="w-5 h-5 text-[#d9006c]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-gray-900">{address.fullName}</p>
                      {address.isDefault && (
                        <span className="text-[10px] font-bold text-[#d9006c] bg-rose-50 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                    {address.phone && (
                      <p className="text-sm text-gray-500 mt-1">
                        📞 {address.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-1.5 text-gray-400 hover:text-[#d9006c] rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}