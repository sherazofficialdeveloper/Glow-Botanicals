'use client';

import Link from 'next/link';
import { Calendar, ArrowRight, User } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/common/Button';
import { useBlogPosts } from '@/hooks/useBlog';

export const BlogSection = ({ className = '' }) => {
  const { posts, loading } = useBlogPosts({ limit: 3 });
  if (loading || posts.length === 0) return null;

  return (
    <section id="blog" className={`py-16 lg:py-24 bg-white relative ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader badge="Glowly Blog" title="Skincare & Wellness Insights" subtitle="Tips, guides, and stories from our skincare experts" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.slice(0, 3).map((post) => (
            <Link key={post._id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-rose-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-rose-50">
                {post.image && <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                {post.readTime && <div className="absolute top-3 left-3 bg-[#d9006c] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{post.readTime}</div>}
              </div>
              <div className="p-6"><div className="flex items-center space-x-3 text-xs text-gray-500 mb-3"><span className="flex items-center space-x-1"><User className="w-3 h-3" /><span>{post.author?.name || 'Admin'}</span></span><span>•</span><span className="flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>{new Date(post.createdAt).toLocaleDateString()}</span></span></div><h3 className="text-lg font-bold text-gray-900 group-hover:text-[#d9006c] transition-colors line-clamp-2">{post.title}</h3><p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.excerpt || `${post.content?.substring(0, 150) || ''}...`}</p><div className="mt-4 flex items-center text-sm font-bold text-[#d9006c] group-hover:underline">Read More <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" /></div></div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center"><Link href="/blog"><Button variant="outline" className="inline-flex items-center space-x-2"><span>View All Articles</span><ArrowRight className="w-4 h-4" /></Button></Link></div>
      </div>
    </section>
  );
};