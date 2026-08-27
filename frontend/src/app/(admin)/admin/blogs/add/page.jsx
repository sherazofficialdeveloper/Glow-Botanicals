'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { BlogEditor } from '@/components/admin/BlogEditor/BlogEditor';

export default function AddBlogPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const createBlog = async (data) => {
    setSubmitting(true);
    try { await adminService.createBlog(data); showToast('Blog post created successfully!', 'success'); router.push('/admin/blogs'); }
    catch (error) { showToast(error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'Failed to create blog post', 'error'); }
    finally { setSubmitting(false); }
  };
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold text-gray-900">Add Blog Post</h1><p className="text-sm text-gray-500">Create a new article for the storefront</p></div><BlogEditor submitting={submitting} submitLabel="Create Blog Post" onSubmit={createBlog} onCancel={() => router.push('/admin/blogs')} /></div>;
}