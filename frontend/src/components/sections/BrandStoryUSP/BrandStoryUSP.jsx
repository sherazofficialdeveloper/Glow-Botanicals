// components/sections/BrandStoryUSP/BrandStoryUSP.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Sparkles, Shield, Leaf, Award, Heart } from 'lucide-react';

export const BrandStoryUSP = ({ className = '' }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="brand-usp" className={`py-10 sm:py-14 bg-white relative ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Rounded Container */}
        <div className="bg-[#fcf0f5] border border-rose-100/80 rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
          
          {/* Background Decoration */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#d9006c]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Column: Text */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white border border-rose-200 text-[#d9006c] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>3-Minute Glow Guarantee</span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Glow Botanicals
                <br />
                <span className="text-[#d9006c]">3-Minute Glow</span>
              </h2>

              {/* Subheading */}
              <p className="text-xs sm:text-sm font-semibold text-rose-800/80 italic tracking-wide">
                Global trusted skincare & haircare brand — simple routine, fast results.
              </p>

              {/* Description */}
              <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <strong className="text-gray-900 font-extrabold">Glow Botanicals</strong> brings thoughtfully crafted skincare & haircare for every type. Our promise is simple: <strong className="text-[#d9006c] font-extrabold">just 3 minutes</strong> of easy routine, and your skin & hair will look <strong className="text-[#d9006c] font-extrabold">healthier, smoother</strong> and naturally <strong className="text-[#d9006c] font-extrabold">glowing</strong>.
              </p>

              {/* USP Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2 justify-center lg:justify-start">
                <span className="inline-flex items-center bg-[#d9006c] text-white px-5 py-2 rounded-full font-extrabold text-xs tracking-wider uppercase shadow-md">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  Only 3 Minutes
                </span>
                <span className="inline-flex items-center bg-white border border-rose-200 text-gray-700 px-5 py-2 rounded-full font-extrabold text-xs tracking-wider uppercase shadow-sm">
                  <Shield className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                  100% Safe
                </span>
                <span className="inline-flex items-center bg-white border border-rose-200 text-gray-700 px-5 py-2 rounded-full font-extrabold text-xs tracking-wider uppercase shadow-sm">
                  <Leaf className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                  Botanical
                </span>
              </div>

              {/* CTA Button */}
              <div className="pt-1 flex justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="bg-[#d9006c] hover:bg-[#a80052] text-white px-8 py-3 rounded-full font-extrabold text-sm tracking-wider uppercase shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Shop Now — Only 3 Mins</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Image */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="relative w-full max-w-sm bg-white/60 backdrop-blur-sm p-4 rounded-3xl border border-rose-200/60 shadow-inner flex flex-col items-center justify-center overflow-hidden">
                
                {/* Main Product Image */}
                <img
                  src={imageError ? '/WhatsApp_Image_2025-09-06_at_12.08.36_AM.jpg' : '/WhatsApp_Image_2025-09-06_at_12.08.36_AM.jpg'}
                  alt="Glow Botanicals 3-Minute Glow"
                  className="w-full h-auto rounded-2xl object-cover"
                  onError={() => setImageError(true)}
                />
                
                {/* Overlay Badges */}
                <div className="absolute top-3 left-3 bg-sky-50 text-sky-600 flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-sky-100 shadow-md">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span className="text-[10px] font-black uppercase tracking-wider">3 Mins</span>
                </div>

                <div className="absolute top-3 right-3 bg-[#d9006c] text-white font-extrabold text-[10px] px-3 py-1.5 rounded-full shadow-lg rotate-3">
                  ✨ So Easy
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm text-[#d9006c] font-extrabold text-[10px] sm:text-xs px-4 py-1.5 rounded-full shadow-md border border-rose-200">
                  ⚡ Only 3 Minutes
                </div>

              </div>
            </div>

          </div>
        </div>

       

      </div>
    </section>
  );
};