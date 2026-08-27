'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';

const emptyForm = {
  title: '', slug: '', excerpt: '', content: '', image: '', category: 'General',
  tags: '', readTime: '', isFeatured: false, isPublished: true,
};

export const BlogEditor = ({ initialData, submitting, submitLabel, onSubmit, onCancel }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!initialData) return;
    setFormData({
      ...emptyForm,
      ...initialData,
      tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
    });
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    setErrors((previous) => ({ ...previous, [name]: '' }));
  };

  const uploadImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      showToast('Choose an image file that is 5MB or smaller.', 'error');
      return;
    }
    const data = new FormData();
    data.append('image', file);
    setUploading(true);
    try {
      const uploaded = await adminService.uploadBlogImage(data);
      setFormData((previous) => ({ ...previous, image: uploaded.url }));
      showToast('Featured image uploaded successfully.', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to upload featured image.', 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!formData.title.trim()) nextErrors.title = 'Title is required';
    if (!formData.content.trim()) nextErrors.content = 'Content is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-3xl">
      <div className="space-y-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><Input name="title" value={formData.title} onChange={handleChange} error={errors.title} placeholder="Blog post title" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug</label><Input name="slug" value={formData.slug} onChange={handleChange} placeholder="Generated from the title if left blank" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label><textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} maxLength={300} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" placeholder="Short description (up to 300 characters)" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Content *</label><textarea name="content" value={formData.content} onChange={handleChange} rows={10} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" placeholder="Write the post content..." />{errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}</div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label><Input name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" /><label className="mt-3 inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer text-sm text-gray-600"><Upload className="w-4 h-4" /><span>{uploading ? 'Uploading image...' : 'Or upload an image'}</span><input ref={inputRef} type="file" accept="image/*" disabled={uploading} onChange={(event) => uploadImage(event.target.files?.[0])} className="hidden" /></label>{formData.image && <img src={formData.image} alt="Featured preview" className="mt-3 h-28 w-44 object-cover rounded border border-gray-200" />}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><Input name="category" value={formData.category} onChange={handleChange} placeholder="General" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Tags</label><Input name="tags" value={formData.tags} onChange={handleChange} placeholder="skincare, routine" /></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label><Input name="readTime" value={formData.readTime} onChange={handleChange} placeholder="5 min read" /></div>
        <div className="flex flex-wrap gap-6"><label className="inline-flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} /> Published</label><label className="inline-flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Featured</label></div>
        <div className="flex items-center space-x-3 pt-4 border-t border-gray-100"><Button type="submit" disabled={submitting || uploading}>{submitting ? 'Saving...' : submitLabel}</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></div>
      </div>
    </form>
  );
};