// backend/src/models/Video.js

import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['youtube', 'vimeo', 'instagram', 'custom'],
      default: 'instagram',
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model('Video', videoSchema);

export default Video;