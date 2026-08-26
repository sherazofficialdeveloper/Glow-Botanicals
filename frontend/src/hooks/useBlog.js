// frontend/src/hooks/useBlog.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { blogService } from '@/services/blogService';

export const useBlogPosts = (options = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 9,
  });

  const fetchPosts = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await blogService.getPosts({
        page: params.page || 1,
        limit: params.limit || 9,
        search: params.search,
        category: params.category,
      });
      
      setPosts(response.items || []);
      setPagination({
        page: response.currentPage || 1,
        total: response.totalCount || 0,
        totalPages: response.totalPages || 1,
        limit: response.limit || 9,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch blog posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(options);
  }, [fetchPosts, JSON.stringify(options)]);

  const refetch = useCallback(() => {
    fetchPosts(options);
  }, [fetchPosts, options]);

  return {
    posts,
    loading,
    error,
    pagination,
    refetch,
  };
};

export const useBlogPost = (slug) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await blogService.getPostBySlug(slug);
        setPost(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch blog post');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
};

export default { useBlogPosts, useBlogPost };