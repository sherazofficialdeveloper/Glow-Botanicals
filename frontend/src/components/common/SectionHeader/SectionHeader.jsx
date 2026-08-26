// components/common/SectionHeader/SectionHeader.jsx
'use client';

import { Sparkles } from 'lucide-react';

export const SectionHeader = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
  badgeClassName = '',
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`mb-10 sm:mb-12 ${alignClasses[align] || alignClasses.center} ${className}`}>
      {badge && (
        <div className={`inline-flex items-center space-x-2 bg-rose-50 border border-rose-200 text-[#d9006c] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-3 ${badgeClassName}`}>
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className={`mt-3 text-base sm:text-lg text-gray-600 font-medium ${align === 'center' ? 'mx-auto max-w-2xl' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};