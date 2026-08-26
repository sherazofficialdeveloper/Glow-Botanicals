'use client';

import { useRef, useState } from 'react';
import { FileVideo, Image, Upload } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useToast } from '@/hooks/useToast';

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export const VideoUploadFields = ({ formData, setFormData, setErrors }) => {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState({ video: false, thumbnail: false });
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const handleUpload = async (field, file) => {
    if (!file) return;

    const isVideo = field === 'video';
    const allowedTypes = isVideo ? VIDEO_TYPES : IMAGE_TYPES;
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_THUMBNAIL_SIZE;

    if (!allowedTypes.includes(file.type)) {
      showToast(
        isVideo
          ? 'Choose an MP4, WebM, or MOV video file.'
          : 'Choose a JPEG, PNG, GIF, or WebP image.',
        'error'
      );
      return;
    }

    if (file.size > maxSize) {
      showToast(
        isVideo ? 'Video files must be 100MB or smaller.' : 'Thumbnail images must be 5MB or smaller.',
        'error'
      );
      return;
    }

    const uploadData = new FormData();
    uploadData.append(field, file);

    setUploading((previous) => ({ ...previous, [field]: true }));
    try {
      const uploaded = await adminService.uploadVideoAssets(uploadData);
      setFormData((previous) => (
        field === 'video'
          ? {
              ...previous,
              url: uploaded.video.url,
              videoPublicId: uploaded.video.publicId,
              type: 'custom',
            }
          : {
              ...previous,
              thumbnail: uploaded.thumbnail.url,
              thumbnailPublicId: uploaded.thumbnail.publicId,
            }
      ));
      setErrors((previous) => ({ ...previous, [field === 'video' ? 'url' : 'thumbnail']: '' }));
      showToast(`${isVideo ? 'Video' : 'Thumbnail'} uploaded successfully.`, 'success');
    } catch (error) {
      showToast(
        error.response?.data?.message || `Failed to upload ${isVideo ? 'video' : 'thumbnail'}.`,
        'error'
      );
    } finally {
      setUploading((previous) => ({ ...previous, [field]: false }));
      const input = isVideo ? videoInputRef.current : thumbnailInputRef.current;
      if (input) input.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-medium text-gray-700">OR Upload Video File</p>
        <label className="mt-2 inline-flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-600">
          {uploading.video ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : <FileVideo className="w-4 h-4" />}
          <span>{uploading.video ? 'Uploading video...' : 'Upload video file'}</span>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            disabled={uploading.video}
            onChange={(event) => handleUpload('video', event.target.files?.[0])}
            className="hidden"
          />
        </label>
        {formData.url && (
          <p className="mt-2 text-xs text-gray-500 break-all">
            Current video: <a href={formData.url} target="_blank" rel="noreferrer" className="text-[#d9006c] hover:underline">{formData.url}</a>
          </p>
        )}
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-medium text-gray-700">Upload Thumbnail Image</p>
        <label className="mt-2 inline-flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-600">
          {uploading.thumbnail ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{uploading.thumbnail ? 'Uploading thumbnail...' : 'Upload thumbnail image'}</span>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            disabled={uploading.thumbnail}
            onChange={(event) => handleUpload('thumbnail', event.target.files?.[0])}
            className="hidden"
          />
        </label>
        {formData.thumbnail && (
          <div className="mt-3 flex items-center space-x-3">
            <Image className="w-4 h-4 text-gray-400" />
            <img src={formData.thumbnail} alt="Video thumbnail" className="w-20 h-12 object-cover rounded border border-gray-200" />
          </div>
        )}
      </div>
    </div>
  );
};
