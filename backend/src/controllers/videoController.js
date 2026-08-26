// backend/src/controllers/videoController.js

import Video from '../models/Video.js';

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
    const { title, description, url, thumbnail, type, productId, order, isActive } = req.body;
    const video = new Video({
      title,
      description,
      url,
      thumbnail,
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
    const { title, description, url, thumbnail, type, productId, order, isActive } = req.body;
    video.title = title || video.title;
    video.description = description !== undefined ? description : video.description;
    video.url = url || video.url;
    video.thumbnail = thumbnail !== undefined ? thumbnail : video.thumbnail;
    video.type = type || video.type;
    video.productId = productId !== undefined ? (productId || null) : video.productId;
    video.order = order !== undefined ? order : video.order;
    video.isActive = isActive !== undefined ? isActive : video.isActive;
    await video.save();
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
