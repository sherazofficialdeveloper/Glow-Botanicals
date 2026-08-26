// app/(admin)/admin/settings/shipping/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Truck, Plus, Trash2 } from 'lucide-react';

export default function ShippingSettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    freeShippingThreshold: 35,
    standardShippingCost: 5.99,
    expressShippingCost: 9.99,
    internationalShippingCost: 19.99,
    shippingZones: [],
    defaultShippingZone: 'US',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminService.getShippingSettings();
        setFormData({
          freeShippingThreshold: data.freeShippingThreshold || 35,
          standardShippingCost: data.standardShippingCost || 5.99,
          expressShippingCost: data.expressShippingCost || 9.99,
          internationalShippingCost: data.internationalShippingCost || 19.99,
          shippingZones: data.shippingZones || [
            { name: 'US', countries: ['US'], cost: 5.99, estimatedDays: '3-5' },
            { name: 'Canada', countries: ['CA'], cost: 9.99, estimatedDays: '5-7' },
            { name: 'International', countries: ['UK', 'PK', 'IN'], cost: 19.99, estimatedDays: '7-14' },
          ],
          defaultShippingZone: data.defaultShippingZone || 'US',
        });
      } catch (error) {
        showToast('Failed to load shipping settings', 'error');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSettings();
  }, [showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleZoneChange = (index, field, value) => {
    const newZones = [...formData.shippingZones];
    newZones[index] = { ...newZones[index], [field]: value };
    setFormData((prev) => ({ ...prev, shippingZones: newZones }));
  };

  const handleAddZone = () => {
    setFormData((prev) => ({
      ...prev,
      shippingZones: [
        ...prev.shippingZones,
        { name: '', countries: [], cost: 0, estimatedDays: '' },
      ],
    }));
  };

  const handleRemoveZone = (index) => {
    const newZones = formData.shippingZones.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, shippingZones: newZones }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.updateShippingSettings(formData);
      showToast('Shipping settings updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update shipping settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading shipping settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shipping Settings</h1>
        <p className="text-sm text-gray-500">Configure shipping rates and zones</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Rates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-gray-400" />
            Shipping Rates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Free Shipping Threshold ($)
              </label>
              <Input
                name="freeShippingThreshold"
                type="number"
                step="0.01"
                value={formData.freeShippingThreshold}
                onChange={handleChange}
                placeholder="35"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Standard Shipping ($)
              </label>
              <Input
                name="standardShippingCost"
                type="number"
                step="0.01"
                value={formData.standardShippingCost}
                onChange={handleChange}
                placeholder="5.99"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Express Shipping ($)
              </label>
              <Input
                name="expressShippingCost"
                type="number"
                step="0.01"
                value={formData.expressShippingCost}
                onChange={handleChange}
                placeholder="9.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                International Shipping ($)
              </label>
              <Input
                name="internationalShippingCost"
                type="number"
                step="0.01"
                value={formData.internationalShippingCost}
                onChange={handleChange}
                placeholder="19.99"
              />
            </div>
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Shipping Zones</h3>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddZone}
              className="flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Zone</span>
            </Button>
          </div>

          <div className="space-y-4">
            {formData.shippingZones.map((zone, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Zone Name
                      </label>
                      <Input
                        value={zone.name}
                        onChange={(e) => handleZoneChange(index, 'name', e.target.value)}
                        placeholder="US"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Countries (comma separated)
                      </label>
                      <Input
                        value={zone.countries?.join(', ') || ''}
                        onChange={(e) => handleZoneChange(index, 'countries', e.target.value.split(',').map(s => s.trim()))}
                        placeholder="US, CA"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cost ($)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={zone.cost}
                        onChange={(e) => handleZoneChange(index, 'cost', parseFloat(e.target.value) || 0)}
                        placeholder="5.99"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveZone(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors mt-5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Estimated Delivery Days
                  </label>
                  <Input
                    value={zone.estimatedDays || ''}
                    onChange={(e) => handleZoneChange(index, 'estimatedDays', e.target.value)}
                    placeholder="3-5 days"
                    className="text-sm max-w-xs"
                  />
                </div>
              </div>
            ))}

            {formData.shippingZones.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No shipping zones configured. Add your first zone.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Shipping Settings'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/settings')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}