// backend/src/utils/cloudinaryUpload.js

import cloudinary from '../config/cloudinary.js';

// ============================================================
// UPLOAD IMAGE
// ============================================================

export const uploadImage = (
  buffer,
  folder = 'cuties-glow/products'
) => {
  return new Promise(
    (resolve, reject) => {
      if (!buffer) {
        return reject(
          new Error(
            'Image buffer is required'
          )
        );
      }

      const stream =
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type:
              'image',
          },
          (
            error,
            result
          ) => {
            if (error) {
              reject(error);
              return;
            }

            resolve({
              url:
                result.secure_url,

              publicId:
                result.public_id,
            });
          }
        );

      stream.end(buffer);
    }
  );
};

// ============================================================
// UPLOAD VIDEO
// ============================================================

export const uploadVideo = (
  buffer,
  folder = 'glow-botanical/videos'
) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error('Video buffer is required'));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'video',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    stream.end(buffer);
  });
};

// ============================================================
// DELETE IMAGE
// ============================================================

export const deleteImage =
  async (publicId) => {
    return deleteAsset(publicId, 'image');
  };

// ============================================================
// DELETE CLOUDINARY ASSET
// ============================================================

export const deleteAsset = async (publicId, resourceType = 'image') => {
    if (!publicId) {
      return;
    }

    try {
      await cloudinary.uploader.destroy(
        publicId,
        { resource_type: resourceType }
      );
    } catch (error) {
      console.error(
        `Cloudinary delete failed: ${publicId}`,
        error
      );

      throw error;
    }
  };
