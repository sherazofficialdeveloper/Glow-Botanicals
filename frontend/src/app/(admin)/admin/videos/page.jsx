// app/(admin)/admin/videos/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Video, Play, Calendar } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/common/Badge';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';

export default function AdminVideosPage() {
  const { showToast } = useToast();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data = await adminService.getVideos();
      setVideos(data);
    } catch (error) {
      showToast('Failed to load videos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await adminService.deleteVideo(id);
      showToast('Video deleted successfully', 'success');
      fetchVideos();
      setDeleteId(null);
    } catch (error) {
      showToast('Failed to delete video', 'error');
    }
  };

  const columns = [
    {
      key: 'thumbnail',
      label: 'Thumbnail',
      render: (row) => (
        <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={row.thumbnail || '/images/placeholder-video.jpg'}
            alt={row.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/images/placeholder-video.jpg';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play className="w-6 h-6 text-white fill-current" />
          </div>
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          <div className="text-xs text-gray-500 line-clamp-1">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <Badge variant="secondary" size="sm">
          {row.type || 'Video'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'danger'} size="sm">
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/videos/edit/${row._id}`}
            className="p-1.5 text-gray-400 hover:text-[#d9006c] rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="text-sm text-gray-500">Manage video content</p>
        </div>
        <Link
          href="/admin/videos/add"
          className="inline-flex items-center space-x-2 bg-[#d9006c] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-[#a80052] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video</span>
        </Link>
      </div>

      <DataTable
        data={videos}
        columns={columns}
        loading={loading}
        emptyMessage="No videos found"
      />

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Video</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this video? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}