// components/sections/ScrollingTicker/ScrollingTicker.jsx
'use client';

import { Sparkles, Heart, Shield, Leaf, Award } from 'lucide-react';

export const ScrollingTicker = ({ className = '' }) => {
  const promises = [
    { text: 'Glow Promise: "Try karo, pasand na aaye, we\'ll make it right."', icon: Sparkles },
    { text: 'Safe & Simple: No fuss routine, whitening, brightening, moisturising', icon: Shield },
    { text: '100% Pure Botanical Ingredients • Honduran Batana & Papaya Enzymes', icon: Leaf },
    { text: 'Dermatologically Tested • 100% Satisfaction Guarantee', icon: Award },
    { text: 'Free Shipping on orders over $35 • COD Available', icon: Heart },
  ];

  return (
    <div className={`bg-[#111111] text-white py-4 overflow-hidden border-y border-rose-900/40 select-none ${className}`}>
      <div className="flex animate-marquee space-x-12 items-center whitespace-nowrap">
        {[...promises, ...promises, ...promises, ...promises].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="inline-flex items-center space-x-4">
              <Icon className="w-4 h-4 text-[#d4af37]" />
              <span className="text-sm sm:text-base font-extrabold tracking-wider uppercase text-rose-100">
                {item.text}
              </span>
              <Heart className="w-3.5 h-3.5 text-[#d9006c] fill-current mx-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
};