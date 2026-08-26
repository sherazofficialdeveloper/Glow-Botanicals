// app/(shop)/blog/[slug]/page.jsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useBlogPost } from '@/hooks/useBlog';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug;
  const { post, loading } = useBlogPost(slug);

  if (loading) {
    return (
      <Container className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner text="Loading blog post..." />
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="min-h-[400px] flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Post Not Found</h2>
        <p className="text-gray-500 mt-2">The blog post you're looking for doesn't exist.</p>
        <Link href="/blog" className="mt-4 text-[#d9006c] font-bold hover:underline">
          Back to Blog →
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12 max-w-3xl">
      <Link
        href="/blog"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Blog</span>
      </Link>

      <article>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center space-x-1">
              <User className="w-3.5 h-3.5" />
              <span>{post.author?.name || 'Admin'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </span>
            {post.readTime && (
              <>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime}</span>
                </span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            {post.title}
          </h1>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto"
              onError={(e) => {
                e.target.src = '/images/placeholder-blog.jpg';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none prose-rose"
          dangerouslySetInnerHTML={{ __html: post.content || post.body || '' }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </Container>
  );
}