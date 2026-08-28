
'use client';

import { useRef, useState } from 'react';
import { Image, Upload } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { useToast } from '@/hooks/useToast';

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const VideoUploadFields = ({ formData, setFormData, setErrors }) => {
  const { showToast } = useToast();

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const thumbnailInputRef = useRef(null);

  const handleThumbnailUpload = async (file) => {
    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      showToast(
        'Choose a JPEG, PNG, GIF, or WebP image.',
        'error'
      );
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      showToast(
        'Thumbnail images must be 5MB or smaller.',
        'error'
      );
      return;
    }

    const uploadData = new FormData();
    uploadData.append('thumbnail', file);

    setUploadingThumbnail(true);

    try {
      const uploaded = await adminService.uploadVideoThumbnail(uploadData);

      setFormData((previous) => ({
        ...previous,
        thumbnail: uploaded.thumbnail.url,
        thumbnailPublicId: uploaded.thumbnail.publicId,
      }));

      setErrors((previous) => ({
        ...previous,
        thumbnail: '',
      }));

      showToast(
        'Thumbnail uploaded successfully.',
        'success'
      );
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          'Failed to upload thumbnail.',
        'error'
      );
    } finally {
      setUploadingThumbnail(false);

      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Thumbnail Upload Only */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-medium text-gray-700">
          Upload Thumbnail Image (optional)
        </p>

        <label className="mt-2 inline-flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-600">
          {uploadingThumbnail ? (
            <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}

          <span>
            {uploadingThumbnail
              ? 'Uploading thumbnail...'
              : 'Upload thumbnail image'}
          </span>

          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            disabled={uploadingThumbnail}
            onChange={(event) =>
              handleThumbnailUpload(
                event.target.files?.[0]
              )
            }
            className="hidden"
          />
        </label>

        {formData.thumbnail && (
          <div className="mt-3 flex items-center space-x-3">
            <Image className="w-4 h-4 text-gray-400" />

            <img
              src={formData.thumbnail}
              alt="Video thumbnail"
              className="w-20 h-12 object-cover rounded border border-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  );
};
