// frontend/src/components/sections/ShoppableReels.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Instagram, X, ShoppingBag } from 'lucide-react';

const defaultReels = [
  {
    _id: 'reel-1',
    title: 'Ready 2 White Milky Cream Routine ✨',
    handle: '@glowlyangel',
    thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    videoPoster: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    productId: null,
  },
  {
    _id: 'reel-2',
    title: 'Instant Milky Whitening Effect 💖',
    handle: '@glowlyangel',
    thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
    videoPoster: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
    productId: null,
  },
  {
    _id: 'reel-3',
    title: 'Pure Turkish Formula Hydration 🌸',
    handle: '@glowlyangel',
    thumbnail: 'https://images.unsplash.com/photo-1608248597263-0007999658b0?auto=format&fit=crop&q=80&w=600',
    videoPoster: 'https://images.unsplash.com/photo-1608248597263-0007999658b0?auto=format&fit=crop&q=80&w=600',
    productId: null,
  },
  {
    _id: 'reel-4',
    title: 'Viral Glow Transformation ASMR 💦',
    handle: '@glowlyangel',
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
    videoPoster: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
    productId: null,
  },
  {
    _id: 'reel-5',
    title: 'Daily Pore Tightening Glow Routine 🌿',
    handle: '@glowlyangel',
    thumbnail: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=600',
    videoPoster: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=600',
    productId: null,
  },
];

export const ShoppableReels = ({ reels = [], products = [], onAddToCart, loading = false }) => {
  const [activeReel, setActiveReel] = useState(null);

  const displayReels = reels.length > 0 ? reels : defaultReels;

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-[#d9006c] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  const getProductForReel = (reel) => {
    if (reel.productId && products.length > 0) {
      const found = products.find(p => p._id === reel.productId);
      if (found) return found;
    }
    return products[0] || null;
  };

  return (
    <section id="instagram-reels" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 bg-rose-50 text-[#d9006c] px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2 border border-rose-100">
            <Instagram className="w-3.5 h-3.5 text-[#d9006c]" />
            <span>@GlowlyAngel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Follow On Instagram
          </h2>
        </div>

        {/* Desktop - 5 Column Grid */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {displayReels.slice(0, 5).map((reel) => {
            const product = getProductForReel(reel);
            const discountPercent = 19;
            const formattedPrice = product?.price ? `Rs ${Math.round(product.price * 100).toLocaleString()}.00` : 'Rs 1,999.00';
            const formattedOldPrice = product?.originalPrice ? `Rs ${Math.round(product.originalPrice * 100).toLocaleString()}.00` : 'Rs 2,600.00';

            return (
              <div
                key={reel._id}
                onClick={() => setActiveReel(reel)}
                className="bg-white rounded-xl border border-gray-300/90 shadow-sm hover:shadow-lg hover:border-gray-400 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-gray-100">
                  <div className="absolute top-0 left-0 z-10 bg-[#bd002a] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-br-md shadow-xs">
                    {discountPercent}% OFF
                  </div>
                  <img
                    src={reel.thumbnail || reel.videoPoster || '/images/placeholder-reel.jpg'}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-[#d9006c] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  {product && (
                    <div className="absolute bottom-2 left-2 z-10 bg-white/95 border border-gray-200 rounded-md p-0.5 shadow-xs w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center overflow-hidden">
                      <img src={product.images?.[0] || '/images/placeholder.png'} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white border-t border-gray-200/80 flex flex-col space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-[#d9006c] transition-colors">
                    {product?.name || 'Glowly Product'}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-xs">
                    <span className="font-extrabold text-[#bd002a]">{formattedPrice}</span>
                    <span className="text-gray-400 line-through text-[11px] font-medium">{formattedOldPrice}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile - Horizontal Scroll (1 Line) */}
        <div className="sm:hidden flex flex-nowrap gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {displayReels.slice(0, 5).map((reel) => {
            const product = getProductForReel(reel);
            const discountPercent = 19;
            const formattedPrice = product?.price ? `Rs ${Math.round(product.price * 100).toLocaleString()}.00` : 'Rs 1,999.00';
            const formattedOldPrice = product?.originalPrice ? `Rs ${Math.round(product.originalPrice * 100).toLocaleString()}.00` : 'Rs 2,600.00';

            return (
              <div
                key={reel._id}
                onClick={() => setActiveReel(reel)}
                className="flex-shrink-0 w-[200px] bg-white rounded-xl border border-gray-300/90 shadow-sm hover:shadow-lg hover:border-gray-400 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-gray-100">
                  <div className="absolute top-0 left-0 z-10 bg-[#bd002a] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-br-md shadow-xs">
                    {discountPercent}% OFF
                  </div>
                  <img
                    src={reel.thumbnail || reel.videoPoster || '/images/placeholder-reel.jpg'}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-[#d9006c] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  {product && (
                    <div className="absolute bottom-2 left-2 z-10 bg-white/95 border border-gray-200 rounded-md p-0.5 shadow-xs w-8 h-8 flex items-center justify-center overflow-hidden">
                      <img src={product.images?.[0] || '/images/placeholder.png'} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white border-t border-gray-200/80 flex flex-col space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-[#d9006c] transition-colors">
                    {product?.name || 'Glowly Product'}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-xs">
                    <span className="font-extrabold text-[#bd002a]">{formattedPrice}</span>
                    <span className="text-gray-400 line-through text-[11px] font-medium">{formattedOldPrice}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reel Modal */}
      {activeReel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-200">
            <button onClick={() => setActiveReel(null)} className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="relative aspect-[9/16] w-full bg-gray-900">
              <img src={activeReel.thumbnail || activeReel.videoPoster || '/images/placeholder-reel.jpg'} alt={activeReel.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 text-[#d9006c] flex items-center justify-center animate-pulse shadow-xl">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">{activeReel.handle}</p>
                <h3 className="text-sm font-extrabold mt-0.5">{activeReel.title}</h3>
              </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-gray-900 truncate max-w-[170px]">
                  {getProductForReel(activeReel)?.name || 'Product'}
                </p>
                <span className="text-sm font-extrabold text-[#bd002a]">
                  Rs {(Math.round(getProductForReel(activeReel)?.price * 100 || 1999)).toLocaleString()}.00
                </span>
              </div>
              <button
                onClick={() => {
                  const p = getProductForReel(activeReel);
                  if (p) { onAddToCart(p); }
                  setActiveReel(null);
                }}
                className="bg-[#d9006c] text-white px-4 py-2 rounded-full font-extrabold text-xs uppercase tracking-wider hover:bg-[#a80052] transition-colors flex items-center space-x-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </section>
  );
};