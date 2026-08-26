// backend/src/controllers/videoController.js

import Video from '../models/Video.js';
import {
  deleteAsset,
  deleteImage,
  uploadImage,
  uploadVideo,
} from '../utils/cloudinaryUpload.js';

export const uploadVideoAssets = async (req, res, next) => {
  let uploadedVideo;
  let uploadedThumbnail;

  try {
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile && !thumbnailFile) {
      return res.status(400).json({
        success: false,
        message: 'Select a video file or thumbnail image to upload',
      });
    }

    if (thumbnailFile && thumbnailFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Thumbnail images must be 5MB or smaller',
      });
    }

    if (videoFile) {
      uploadedVideo = await uploadVideo(videoFile.buffer);
    }

    if (thumbnailFile) {
      uploadedThumbnail = await uploadImage(
        thumbnailFile.buffer,
        'glow-botanical/videos/thumbnails'
      );
    }

    res.status(201).json({
      success: true,
      data: {
        ...(uploadedVideo && { video: uploadedVideo }),
        ...(uploadedThumbnail && { thumbnail: uploadedThumbnail }),
      },
    });
  } catch (error) {
    await Promise.all([
      uploadedVideo && deleteAsset(uploadedVideo.publicId, 'video'),
      uploadedThumbnail && deleteImage(uploadedThumbnail.publicId),
    ]).catch((cleanupError) => {
      console.error('Failed to clean up video upload:', cleanupError);
    });
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
      type, productId, order, isActive,
    } = req.body;
    const video = new Video({
      title,
      description,
      url,
      videoPublicId: videoPublicId || null,
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
      type, productId, order, isActive,
    } = req.body;
    const previousVideoPublicId = video.videoPublicId;
    const previousThumbnailPublicId = video.thumbnailPublicId;
    const isReplacingVideo = url !== undefined && url !== video.url;
    const isReplacingThumbnail = thumbnail !== undefined && thumbnail !== video.thumbnail;

    video.title = title || video.title;
    video.description = description !== undefined ? description : video.description;
    video.url = url || video.url;
    video.thumbnail = thumbnail !== undefined ? thumbnail : video.thumbnail;
    if (isReplacingVideo) video.videoPublicId = videoPublicId || null;
    if (isReplacingThumbnail) video.thumbnailPublicId = thumbnailPublicId || null;
    video.type = type || video.type;
    video.productId = productId !== undefined ? (productId || null) : video.productId;
    video.order = order !== undefined ? order : video.order;
    video.isActive = isActive !== undefined ? isActive : video.isActive;
    await video.save();

    await Promise.all([
      isReplacingVideo && previousVideoPublicId && previousVideoPublicId !== video.videoPublicId
        ? deleteAsset(previousVideoPublicId, 'video')
        : null,
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
      deleteAsset(video.videoPublicId, 'video'),
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
    const items = await Video.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: { items },
    });
  } catch (error) {
    next(error);
  }
};
