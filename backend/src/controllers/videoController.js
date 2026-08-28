// backend/src/controllers/videoController.js

import Video from '../models/Video.js';
import {
  deleteAsset,
  deleteImage,
  uploadImage,
  uploadVideo,
} from '../utils/cloudinaryUpload.js';
import { deleteReelVideo, uploadReelVideo } from '../utils/supabaseVideoStorage.js';

export const uploadReelVideoAsset = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Select a video file to upload' });
    console.info('Reel video received', { field: req.file.fieldname, filename: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size, bufferExists: Boolean(req.file.buffer), bufferLength: req.file.buffer?.length });
    const video = await uploadReelVideo(req.file);
    res.status(201).json({ success: true, data: { video } });
  } catch (error) {
    next(error);
  }
};

export const uploadReelThumbnailAsset = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Select a thumbnail image to upload' });
    const thumbnail = await uploadImage(req.file.buffer, 'glow-botanical/videos/thumbnails');
    res.status(201).json({ success: true, data: { thumbnail } });
  } catch (error) {
    next(error);
  }
};
export const getVideos = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: { items: videos },
    });
  } catch (error) {
    next(error);
  }
};

export const getVideoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.json({
      success: true,
      data: { video },
    });
  } catch (error) {
    next(error);
  }
};

export const createVideo = async (req, res, next) => {
  try {
    const {
      title, description, url, videoPublicId, thumbnail, thumbnailPublicId,
      type, sourceType, videoStoragePath, productId, order, isActive,
    } = req.body;
    const video = new Video({
      title,
      description,
      url,
      videoPublicId: videoPublicId || null,
      sourceType: sourceType || (videoStoragePath ? 'upload' : type === 'instagram' ? 'instagram' : 'direct'),
      videoStoragePath: videoStoragePath || null,
      thumbnail,
      thumbnailPublicId: thumbnailPublicId || null,
      type,
      productId: productId || null,
      order,
      isActive,
    });
    await video.save();
    res.status(201).json({
      success: true,
      message: 'Video created successfully',
      data: { video },
    });
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    const {
      title, description, url, videoPublicId, thumbnail, thumbnailPublicId,
      type, sourceType, videoStoragePath, productId, order, isActive,
    } = req.body;
    const previousVideoPublicId = video.videoPublicId;
    const previousVideoStoragePath = video.videoStoragePath;
    const previousThumbnailPublicId = video.thumbnailPublicId;
    const previousType = video.type;
    const normalizedUrl = url !== undefined && url !== '' ? url : video.url;
    const isReplacingVideo = normalizedUrl !== video.url;
    const isReplacingThumbnail = thumbnail !== undefined && thumbnail !== video.thumbnail;

    video.title = title || video.title;
    video.description = description !== undefined ? description : video.description;
    video.url = normalizedUrl;
    video.thumbnail = thumbnail !== undefined ? thumbnail : video.thumbnail;
    if (isReplacingVideo) {
      video.videoPublicId = videoPublicId || null;
      video.sourceType = sourceType || (videoStoragePath ? 'upload' : type === 'instagram' ? 'instagram' : 'direct');
      video.videoStoragePath = videoStoragePath || null;
    }
    if (isReplacingThumbnail) {
      video.thumbnail = thumbnail;
      video.thumbnailPublicId = thumbnailPublicId !== previousThumbnailPublicId
        ? thumbnailPublicId
        : null;
    }
    video.type = type || video.type;
    if (type && type !== previousType && !isReplacingVideo) {
      video.sourceType = sourceType || (type === 'instagram' ? 'instagram' : type === 'custom' ? 'upload' : 'direct');
    }
    video.productId = productId !== undefined ? (productId || null) : video.productId;
    video.order = order !== undefined ? order : video.order;
    video.isActive = isActive !== undefined ? isActive : video.isActive;
    await video.save();

    await Promise.all([
      // Supabase objects are intentionally retained on replacement until a reference-aware cleanup job is added.
      null,
      isReplacingThumbnail && previousThumbnailPublicId && previousThumbnailPublicId !== video.thumbnailPublicId
        ? deleteImage(previousThumbnailPublicId)
        : null,
    ]).catch((cleanupError) => {
      console.error('Failed to delete replaced video asset:', cleanupError);
    });
    res.json({
      success: true,
      message: 'Video updated successfully',
      data: { video },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    await video.deleteOne();
    await Promise.all([
      // Keep Supabase objects on delete until a reference-aware cleanup job is available.
      null,
      deleteImage(video.thumbnailPublicId),
    ]).catch((cleanupError) => {
      console.error('Failed to delete video assets:', cleanupError);
    });
    res.json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Public: active "reels" for the homepage Shoppable Reels carousel
export const getReels = async (req, res, next) => {
  try {
    const items = await Video.find({ isActive: true })
      .populate('productId', 'name price originalPrice images discount')
      .sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: { items },
    });
  } catch (error) {
    next(error);
  }
};
