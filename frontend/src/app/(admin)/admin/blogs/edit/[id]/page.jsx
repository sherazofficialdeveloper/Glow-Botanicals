'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BlogEditor } from '@/components/admin/BlogEditor/BlogEditor';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try { setPost(await adminService.getBlog(id)); }
      catch (error) { showToast(error.response?.data?.message || 'Failed to load blog post', 'error'); router.push('/admin/blogs'); }
      finally { setLoading(false); }
    };
    fetchPost();
  }, [id, router, showToast]);

  const updateBlog = async (data) => {
    setSubmitting(true);
    try { await adminService.updateBlog(id, data); showToast('Blog post updated successfully!', 'success'); router.push('/admin/blogs'); }
    catch (error) { showToast(error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'Failed to update blog post', 'error'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><LoadingSpinner text="Loading blog post..." /></div>;
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1><p className="text-sm text-gray-500">Update article details and publication status</p></div><BlogEditor initialData={post} submitting={submitting} submitLabel="Update Blog Post" onSubmit={updateBlog} onCancel={() => router.push('/admin/blogs')} /></div>;
}