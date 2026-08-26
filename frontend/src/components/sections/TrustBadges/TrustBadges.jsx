// frontend/src/components/sections/TrustBadges.jsx
'use client';

import { ShieldCheck, Award, Heart, CheckCircle } from 'lucide-react';

export const TrustBadges = () => {
  const badges = [
    {
      icon: <ShieldCheck className="w-7 h-7 sm:w-9 sm:h-9 text-emerald-100 mb-1" />,
      title: '100% Safe',
      subtitle: 'Formula',
      bg: 'border-emerald-500 bg-emerald-50',
      iconBg: 'bg-emerald-600',
    },
    {
      icon: <Award className="w-7 h-7 sm:w-9 sm:h-9 text-amber-100 mb-1" />,
      title: 'Dermatologically',
      subtitle: 'Tested',
      bg: 'border-amber-500 bg-amber-50',
      iconBg: 'bg-[#8c6227]',
    },
    {
      icon: <CheckCircle className="w-7 h-7 sm:w-9 sm:h-9 text-sky-100 mb-1" />,
      title: '100% Money Back',
      subtitle: 'Guarantee',
      bg: 'border-sky-500 bg-sky-50',
      iconBg: 'bg-sky-600',
    },
    {
      icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-300 fill-current mb-0.5" />,
      title: 'Loved by',
      subtitle: '10,000+ ★★★★★',
      bg: 'border-purple-500 bg-purple-50',
      iconBg: 'bg-[#6a1b9a]',
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-[#faf9f6] border-y border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop - 4 Column Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center justify-items-center">
          {badges.map((b, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group cursor-default">
              <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-dashed ${b.bg} flex items-center justify-center p-3 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                <div className={`w-full h-full rounded-full ${b.iconBg} text-white flex flex-col items-center justify-center shadow-inner p-2 text-center`}>
                  {b.icon}
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-tight">
                    {b.title}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest mt-0.5">
                    {b.subtitle}
                  </span>
                </div>
              </div>
              <span className="mt-3 text-xs sm:text-sm font-extrabold text-gray-800 tracking-wide">
                {b.title} {b.subtitle}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile - Horizontal Scroll (1 Line) */}
        <div className="sm:hidden flex flex-nowrap gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {badges.map((b, idx) => (
            <div key={idx} className="flex-shrink-0 flex flex-col items-center text-center group cursor-default w-[140px]">
              <div className={`relative w-28 h-28 rounded-full border-4 border-dashed ${b.bg} flex items-center justify-center p-3 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                <div className={`w-full h-full rounded-full ${b.iconBg} text-white flex flex-col items-center justify-center shadow-inner p-2 text-center`}>
                  {b.icon}
                  <span className="text-[9px] font-black uppercase tracking-wider leading-tight">
                    {b.title}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5">
                    {b.subtitle}
                  </span>
                </div>
              </div>
              <span className="mt-2 text-xs font-extrabold text-gray-800 tracking-wide">
                {b.title} {b.subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>

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