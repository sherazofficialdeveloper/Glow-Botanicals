// app/(shop)/blog/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useBlogPosts } from '@/hooks/useBlog';

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { posts, loading, error, pagination } = useBlogPosts({
    page,
    limit: 9,
    search,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  if (loading) {
    return (
      <Container className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner text="Loading blog posts..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-medium mb-2">Unable to load blog posts right now.</p>
          <p className="text-sm text-gray-500">Please refresh the page or try again in a moment.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <SectionHeader
        title="Glow  Blog"
        subtitle="Tips, guides, and stories from our skincare experts"
        align="center"
      />

      {/* Search */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blog posts..."
            className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </form>

      {/* Blog Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No blog posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[16/10] overflow-hidden bg-rose-50">
                <img
                  src={post.image || '/images/placeholder-blog.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-blog.jpg';
                  }}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{post.author?.name || 'Admin'}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#d9006c] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {post.excerpt || post.content?.substring(0, 150) + '...'}
                </p>
                <div className="mt-4 flex items-center text-sm font-bold text-[#d9006c] group-hover:underline">
                  Read More <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium">
              {page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}