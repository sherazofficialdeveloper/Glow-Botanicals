// frontend/src/components/sections/PromoBanner.jsx
'use client';

import Link from 'next/link';

export const PromoBanner = ({ 
  imageUrl, 
  mobileImageUrl, 
  altText = 'Promotional Banner', 
  link, 
  className = '' 
}) => {
  if (!imageUrl) return null;

  return (
    <section className={`w-full py-8 sm:py-12 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {link ? (
            <Link href={link}>
              <img
                src={imageUrl}
                alt={altText}
                className="w-full h-auto object-cover block"
                onError={(e) => {
                  e.target.src = '/images/placeholder-banner.jpg';
                }}
              />
            </Link>
          ) : (
            <img
              src={imageUrl}
              alt={altText}
              className="w-full h-auto object-cover block"
              onError={(e) => {
                e.target.src = '/images/placeholder-banner.jpg';
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;