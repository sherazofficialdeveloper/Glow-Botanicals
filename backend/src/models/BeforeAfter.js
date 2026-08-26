// backend/src/models/BeforeAfter.js

import mongoose from 'mongoose';

const beforeAfterSchema = new mongoose.Schema(
  {
    beforeImage: {
      type: String,
      required: true,
    },
    afterImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const BeforeAfter = mongoose.model('BeforeAfter', beforeAfterSchema);

export default BeforeAfter;