// backend/src/models/BlogPost.js

import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      name: {
        type: String,
        default: 'Admin',
        trim: true,
      },
    },
    readTime: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

blogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
