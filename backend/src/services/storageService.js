// backend/src/services/storageService.js

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { AppError } from '../utils/error.js';
import { logger } from '../utils/logger.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 */
export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const { folder = 'GlowBotanical', publicId, transformation } = options;

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: publicId,
      transformation,
    });

    // Delete local file after upload
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      // Ignore if file doesn't exist
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    throw new AppError('Failed to upload file', 500);
  }
};

/**
 * Upload multiple files to Cloudinary
 */
export const uploadMultipleToCloudinary = async (filePaths, options = {}) => {
  try {
    const uploadPromises = filePaths.map((filePath) =>
      uploadToCloudinary(filePath, options)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    logger.error('Multiple Cloudinary upload error:', error);
    throw new AppError('Failed to upload files', 500);
  }
};

/**
 * Delete file from Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new AppError('Failed to delete file', 500);
  }
};

/**
 * Get Cloudinary image URL with transformations
 */
export const getCloudinaryUrl = (publicId, options = {}) => {
  const { width, height, crop = 'fit', quality = 'auto', format = 'auto' } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    format,
  });
};

/**
 * Upload base64 image
 */
export const uploadBase64Image = async (base64String, options = {}) => {
  try {
    const { folder = 'GlowBotanical', publicId } = options;

    const result = await cloudinary.uploader.upload(base64String, {
      folder,
      public_id: publicId,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    logger.error('Base64 upload error:', error);
    throw new AppError('Failed to upload image', 500);
  }
};

export default {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  getCloudinaryUrl,
  uploadBase64Image,
};