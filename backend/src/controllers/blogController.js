// backend/src/controllers/blogController.js

import BlogPost from '../models/BlogPost.js';
import { slugify } from '../utils/helpers.js';

// GET /blog - public, paginated, optional search/category
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const filter = { isPublished: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const totalCount = await BlogPost.countDocuments(filter);
    const items = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: {
        items,
        currentPage: page,
        totalCount,
        totalPages: Math.max(Math.ceil(totalCount / limit), 1),
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /blog/featured - public
export const getFeaturedPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    const items = await BlogPost.find({ isPublished: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// GET /blog/search - public
export const searchPosts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, data: [] });
    }
    const items = await BlogPost.find({
      isPublished: true,
      $text: { $search: q },
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// GET /blog/category/:category - public
export const getPostsByCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const filter = { isPublished: true, category: req.params.category };

    const totalCount = await BlogPost.countDocuments(filter);
    const items = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: {
        items,
        currentPage: page,
        totalCount,
        totalPages: Math.max(Math.ceil(totalCount / limit), 1),
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /blog/id/:id - public (used by admin edit form and any direct-by-id lookups)
export const getPostById = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// GET /blog/:slug - public
export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// GET /blog/admin - admin, all posts including unpublished
export const getAdminPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { items: posts } });
  } catch (error) {
    next(error);
  }
};

// POST /blog/admin - admin
export const createPost = async (req, res, next) => {
  try {
    const { title, slug, excerpt, content, image, category, tags, readTime, isFeatured, isPublished } = req.body;
    const finalSlug = slugify(slug || title);

    const existing = await BlogPost.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A post with this slug already exists' });
    }

    const post = new BlogPost({
      title,
      slug: finalSlug,
      excerpt,
      content,
      image,
      category,
      tags,
      readTime,
      isFeatured,
      isPublished: isPublished !== undefined ? isPublished : true,
    });
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /blog/admin/:id - admin
export const updatePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const { title, slug, excerpt, content, image, category, tags, readTime, isFeatured, isPublished } = req.body;

    if (slug && slugify(slug) !== post.slug) {
      const finalSlug = slugify(slug);
      const existing = await BlogPost.findOne({ slug: finalSlug, _id: { $ne: post._id } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'A post with this slug already exists' });
      }
      post.slug = finalSlug;
    }

    post.title = title || post.title;
    post.excerpt = excerpt !== undefined ? excerpt : post.excerpt;
    post.content = content !== undefined ? content : post.content;
    post.image = image !== undefined ? image : post.image;
    post.category = category || post.category;
    post.tags = tags !== undefined ? tags : post.tags;
    post.readTime = readTime !== undefined ? readTime : post.readTime;
    post.isFeatured = isFeatured !== undefined ? isFeatured : post.isFeatured;
    post.isPublished = isPublished !== undefined ? isPublished : post.isPublished;

    await post.save();

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /blog/admin/:id - admin
export const deletePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    await post.deleteOne();
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
