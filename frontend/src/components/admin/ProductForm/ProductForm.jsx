// components/admin/ProductForm/ProductForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useToast } from '@/hooks/useToast';
import { productService } from '@/services/productService';

export const ProductForm = ({
  product = null,
  categories = [],
  onSubmit,
  loading = false,
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const isEdit = !!product;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subtitle: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    tags: [],
    images: [],
    inStock: true,
    stock: 1,
    isFeatured: false,
    volume: '',
    benefits: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      const productStock = Number(product.stock);
      const stock = Number.isFinite(productStock) && productStock >= 0
        ? Math.floor(productStock)
        : product.inStock ? 1 : 0;

      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        subtitle: product.subtitle || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category?._id || product.category || '',
        tags: product.tags || [],
        images: product.images || [],
        inStock: stock > 0,
        stock,
        isFeatured: Boolean(product.isFeatured),
        volume: product.volume || '',
        benefits: product.benefits || [],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generate slug from name
    if (name === 'name' && !isEdit) {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (benefit) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((b) => b !== benefit),
    }));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput('');
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const formDataUpload = new FormData();
    files.forEach((file) => formDataUpload.append('images', file));

    setUploadingImages(true);
    try {
      const uploaded = await productService.uploadImages(formDataUpload);
      const urls = uploaded.map((img) => img.url);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
      showToast('Image(s) uploaded successfully', 'success');
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Unable to upload image(s). Please try again.',
        'error'
      );
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (image) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.slug) newErrors.slug = 'Slug is required';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { inStock, stock, ...productData } = formData;
    const currentStock = Number(stock);

    const submitData = {
      ...productData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      // The Product model derives inStock from stock > 0. Preserve a
      // real existing quantity when enabled; use one unit for this
      // boolean-only form and zero units when disabled.
      stock: inStock
        ? Math.max(Number.isFinite(currentStock) ? Math.floor(currentStock) : 0, 1)
        : 0,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              error={errors.name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <Input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="product-slug"
              error={errors.slug}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle
          </label>
          <Input
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Short tagline or subtitle"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
            placeholder="Detailed product description"
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Pricing & Inventory
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <Input
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              error={errors.price}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original Price
            </label>
            <Input
              name="originalPrice"
              type="number"
              step="0.01"
              value={formData.originalPrice}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volume / Size
            </label>
            <Input
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              placeholder="e.g., 60ml, 100ml"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d9006c]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:bg-[#d9006c] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            <span className="ms-3 text-sm font-medium text-gray-700">
              In Stock
            </span>
          </label>
        </div>
      </div>

      {/* Category */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Category</h3>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-red-600 mt-1">{errors.category}</p>
        )}

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center space-x-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d9006c]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:bg-[#d9006c] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            <span className="ms-3 text-sm font-medium text-gray-700">
              Featured Product
            </span>
          </label>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>

        <div className="flex space-x-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="Add tag..."
            className="flex-1"
          />
          <Button type="button" onClick={handleAddTag}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 bg-pink-50 text-[#d9006c] rounded-full text-sm font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-gray-400 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Benefits</h3>

        <div className="flex space-x-2">
          <Input
            value={benefitInput}
            onChange={(e) => setBenefitInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddBenefit()}
            placeholder="Add benefit..."
            className="flex-1"
          />
          <Button type="button" onClick={handleAddBenefit}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <ul className="mt-3 space-y-1">
          {formData.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm"
            >
              <span className="text-gray-700">• {benefit}</span>
              <button
                type="button"
                onClick={() => handleRemoveBenefit(benefit)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Images</h3>

        <div className="flex items-center space-x-2 mb-3">
          <label className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-600">
            {uploadingImages ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploadingImages ? 'Uploading...' : 'Upload image file(s)'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploadingImages}
              className="hidden"
            />
          </label>
          <span className="text-xs text-gray-400">or enter a URL below</span>
        </div>

        <div className="flex space-x-2">
          <Input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Image URL..."
            className="flex-1"
          />
          <Button type="button" onClick={handleAddImage}>
            <Upload className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-3">
          {formData.images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img}
                alt={`Product image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.target.src = '/images/placeholder.png';
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(img)}
                className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-[#d9006c] text-white px-2 py-0.5 rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? isEdit ? 'Updating...' : 'Creating...'
            : isEdit ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};
