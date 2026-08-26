// frontend/src/components/sections/HeroSlideshow.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroSlideshow = ({ banners = [], loading = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use banners from backend or fallback
  const slides = banners.length > 0 
    ? banners.map(b => ({
        id: b._id,
        desktopImage: b.image,
        mobileImage: b.mobileImage || b.image,
        alt: b.title || 'Hero Banner',
        link: b.link || '/products',
      }))
    : [
        {
          id: '1',
          desktopImage: '/image-1.png',
          mobileImage: '/image 1.png',
          alt: 'Glowly Botanical 3-Minute Glow',
          link: '/products',
        },
        {
          id: '2',
          desktopImage: '/image-2.png',
          mobileImage: '/image 2.png',
          alt: 'Glowly Botanical Ready 2 White',
          link: '/products',
        },
      ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) {
    return (
      <section className="relative w-full bg-white overflow-hidden">
        <div className="w-full aspect-[16/7] bg-gray-200 animate-pulse"></div>
      </section>
    );
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section id="hero" className="relative w-full bg-white overflow-hidden">
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] lg:aspect-[16/5.5]">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Link href={slide.link || '#'}>
                <img
                  src={slide.desktopImage}
                  alt={slide.alt}
                  className="hidden sm:block w-full h-full object-cover max-h-[620px]"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-hero.jpg';
                  }}
                />
                <img
                  src={slide.mobileImage}
                  alt={slide.alt}
                  className="block sm:hidden w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-hero-mobile.jpg';
                  }}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-gray-800 hover:text-[#d9006c] shadow-md flex items-center justify-center transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-gray-800 hover:text-[#d9006c] shadow-md flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-8 bg-[#d9006c]' : 'w-2.5 bg-white/80 hover:bg-white shadow-sm'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};