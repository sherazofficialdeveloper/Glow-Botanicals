// frontend/src/components/layout/AnnouncementBar/AnnouncementBar.jsx
'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';

export const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  const items = [
    { icon: <Sparkles className="w-3.5 h-3.5" />, text: "TRY IT ONCE. THANK US LATER." },
    { icon: <Clock className="w-3.5 h-3.5" />, text: "GLOW IN 3 MINUTES ROUTINE" },
    { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: "100% SAFE BOTANICAL INGREDIENTS" },
    { icon: <Truck className="w-3.5 h-3.5" />, text: "COD & EXPRESS NATIONWIDE SHIPPING" },
    { icon: <Sparkles className="w-3.5 h-3.5" />, text: "USE CODE GLOW15 FOR 15% OFF" },
  ];

  useEffect(() => {
    const closed = localStorage.getItem('announcementClosed');
    if (closed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('announcementClosed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#121212] text-white py-2.5 px-4 text-xs overflow-hidden border-b border-rose-900/30 select-none relative" style={{ height: '48px' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-center h-full relative">
        {/* Desktop - Single line marquee */}
        <div className="hidden md:flex animate-marquee space-x-8 items-center whitespace-nowrap">
          {[...items, ...items, ...items].map((item, idx) => (
            <div key={idx} className="inline-flex items-center space-x-2.5">
              <span className="text-[#d4af37]">{item.icon}</span>
              <span className="uppercase text-[11px] font-semibold tracking-wider text-rose-100/90">{item.text}</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d9006c]/60 mx-3"></span>
            </div>
          ))}
        </div>

        {/* Mobile - Single line marquee */}
        <div className="md:hidden flex animate-marquee space-x-6 items-center whitespace-nowrap">
          {[...items, ...items, ...items].map((item, idx) => (
            <div key={idx} className="inline-flex items-center space-x-2">
              <span className="text-[#d4af37]">{item.icon}</span>
              <span className="uppercase text-[10px] font-semibold tracking-wider text-rose-100/90">{item.text}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-[#d9006c]/60 mx-2"></span>
            </div>
          ))}
        </div>

        <button
          onClick={handleClose}
          className="absolute right-0 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};