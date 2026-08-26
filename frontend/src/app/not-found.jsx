// frontend/src/app/not-found.jsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 max-w-md w-full text-center">
        {/* 404 */}
        <div className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-[#d9006c]">
          404
        </div>
        
        {/* Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-50 flex items-center justify-center mx-auto mt-4">
          <Search className="w-10 h-10 sm:w-12 sm:h-12 text-[#d9006c]" />
        </div>
        
        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
          Page Not Found
        </h1>
        
        {/* Message */}
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <Link href="/">
            <button className="w-full bg-[#d9006c] text-white px-4 py-2.5 sm:py-3 rounded-lg font-bold text-sm hover:bg-[#a80052] transition-colors flex items-center justify-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </button>
          </Link>
          
          <button
            onClick={() => router.back()}
            className="w-full text-sm text-gray-500 hover:text-[#d9006c] transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">You might be looking for:</p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <Link href="/products" className="text-xs text-[#d9006c] font-medium hover:underline">
              Shop All
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/about" className="text-xs text-[#d9006c] font-medium hover:underline">
              About Us
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/contact" className="text-xs text-[#d9006c] font-medium hover:underline">
              Contact
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/blog" className="text-xs text-[#d9006c] font-medium hover:underline">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}