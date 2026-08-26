import Video from '../models/Video.js';
import { NotFoundError } from '../utils/error.js';

export const getVideos = async () => {
  return Video.find().sort({ createdAt: -1 });
};

export const getVideoById = async (id) => {
  const video = await Video.findById(id);
  if (!video) {
    throw new NotFoundError('Video');
  }
  return video;
};

export const createVideo = async (data) => {
  return Video.create({
    title: data.title,
    url: data.url,
    type: data.type,
  });
};

export const updateVideo = async (id, data) => {
  const video = await getVideoById(id);
  if (data.title !== undefined) video.title = data.title;
  if (data.url !== undefined) video.url = data.url;
  if (data.type !== undefined) video.type = data.type;
  await video.save();
  return video;
};

export const deleteVideo = async (id) => {
  const video = await getVideoById(id);
  await video.deleteOne();
};

export const getHomepageVideo = async () => {
  return Video.findOne({ type: 'homepage' }).sort({ createdAt: -1 });
};
