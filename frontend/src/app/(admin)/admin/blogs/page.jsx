'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';

export default function AdminBlogsPage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const fetchPosts = async () => { setLoading(true); try { setPosts(await adminService.getBlogs()); } catch { showToast('Failed to load blog posts', 'error'); } finally { setLoading(false); } };
  useEffect(() => { fetchPosts(); }, []);
  const deletePost = async () => { try { await adminService.deleteBlog(deleteId); showToast('Blog post deleted successfully', 'success'); setDeleteId(null); fetchPosts(); } catch (error) { showToast(error.response?.data?.message || 'Failed to delete blog post', 'error'); } };
  const columns = [
    { key: 'title', label: 'Post', render: (row) => <div className="flex items-center gap-3"><img src={row.image || '/images/placeholder-blog.jpg'} alt="" className="w-12 h-9 object-cover rounded bg-rose-50" /><div><p className="font-medium text-gray-900 text-sm">{row.title}</p><p className="text-xs text-gray-500">{row.slug}</p></div></div> },
    { key: 'category', label: 'Category', render: (row) => <Badge variant="secondary" size="sm">{row.category || 'General'}</Badge> },
    { key: 'status', label: 'Status', render: (row) => <Badge variant={row.isPublished ? 'success' : 'warning'} size="sm">{row.isPublished ? 'Published' : 'Draft'}</Badge> },
    { key: 'date', label: 'Updated', render: (row) => <span className="text-sm text-gray-600">{new Date(row.updatedAt || row.createdAt).toLocaleDateString()}</span> },
    { key: 'actions', label: 'Actions', render: (row) => <div className="flex items-center gap-2"><Link href={`/admin/blogs/edit/${row._id}`} className="p-1.5 text-gray-400 hover:text-[#d9006c] rounded-lg hover:bg-rose-50"><Pencil className="w-4 h-4" /></Link><button onClick={() => setDeleteId(row._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></div> },
  ];
  return <div className="space-y-6"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1><p className="text-sm text-gray-500">Manage storefront articles</p></div><Link href="/admin/blogs/add" className="inline-flex items-center space-x-2 bg-[#d9006c] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-[#a80052]"><Plus className="w-4 h-4" /><span>Add Blog Post</span></Link></div><DataTable data={posts} columns={columns} loading={loading} emptyMessage="No blog posts found. Add your first blog post!" />{deleteId && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"><div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"><h3 className="text-lg font-bold text-gray-900 mb-2">Delete Blog Post</h3><p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this post? This cannot be undone.</p><div className="flex gap-3 justify-end"><button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button><button onClick={deletePost} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg">Delete</button></div></div></div>}</div>;
}