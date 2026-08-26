import Banner from '../models/Banner.js';
import { NotFoundError } from '../utils/error.js';

export const getBanners = async () => {
  return Banner.find().sort({ createdAt: -1 });
};

export const getBannerById = async (id) => {
  const banner = await Banner.findById(id);
  if (!banner) {
    throw new NotFoundError('Banner');
  }
  return banner;
};

export const createBanner = async (data) => {
  return Banner.create({
    title: data.title,
    image: data.image,
    link: data.link,
    type: data.type,
    isActive: data.isActive,
  });
};

export const updateBanner = async (id, data) => {
  const banner = await getBannerById(id);
  if (data.title !== undefined) banner.title = data.title;
  if (data.image !== undefined) banner.image = data.image;
  if (data.link !== undefined) banner.link = data.link;
  if (data.type !== undefined) banner.type = data.type;
  if (data.isActive !== undefined) banner.isActive = data.isActive;
  await banner.save();
  return banner;
};

export const deleteBanner = async (id) => {
  const banner = await getBannerById(id);
  await banner.deleteOne();
};
