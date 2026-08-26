// components/sections/BlogSection/BlogSection.jsx
'use client';

import Link from 'next/link';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/common/Button';

export const BlogSection = ({ posts = [], className = '' }) => {
  // Default blog posts if none provided
  const defaultPosts = [
    {
      id: 1,
      title: 'The 3-Minute Glow Routine: Your Complete Guide',
      excerpt: 'Learn how to achieve radiant skin in just 3 minutes daily with our simple step-by-step routine...',
      image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800',
      author: 'Sarah Johnson',
      date: 'May 15, 2024',
      readTime: '5 min read',
      slug: '3-minute-glow-routine-guide',
    },
    {
      id: 2,
      title: 'Batana Oil Benefits for Hair Growth',
      excerpt: 'Discover why Honduran Batana Oil is called the "Miracle Oil" for hair growth and scalp health...',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800',
      author: 'Maria Rodriguez',
      date: 'May 10, 2024',
      readTime: '4 min read',
      slug: 'batana-oil-hair-growth-benefits',
    },
    {
      id: 3,
      title: 'Understanding Kojic Acid for Skin Brightening',
      excerpt: 'Everything you need to know about Kojic Acid and how it helps fade dark spots and hyperpigmentation...',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
      author: 'Emily Chen',
      date: 'May 5, 2024',
      readTime: '6 min read',
      slug: 'kojic-acid-skin-brightening',
    },
  ];

  const blogPosts = posts.length > 0 ? posts : defaultPosts;

  return (
    <section id="blog" className={`py-16 lg:py-24 bg-white relative ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="Glowly Blog"
          title="Skincare & Wellness Insights"
          subtitle="Tips, guides, and stories from our skincare experts"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-rose-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-rose-50">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-blog.jpg';
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#d9006c] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {post.readTime}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#d9006c] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="mt-4 flex items-center text-sm font-bold text-[#d9006c] group-hover:underline">
                  Read More <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <Link href="/blog">
            <Button variant="outline" className="inline-flex items-center space-x-2">
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};