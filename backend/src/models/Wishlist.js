// backend/src/models/Wishlist.js

import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for total items
wishlistSchema.virtual('totalItems').get(function () {
  return this.items.length;
});

// To JSON transform
wishlistSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;