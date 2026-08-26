// components/common/Badge/Badge.jsx
'use client';

import { forwardRef } from 'react';

export const Badge = forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  rounded = true,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-[#d9006c] text-white',
    secondary: 'bg-rose-100 text-[#d9006c]',
    success: 'bg-emerald-100 text-emerald-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-amber-100 text-amber-800',
    info: 'bg-blue-100 text-blue-800',
    dark: 'bg-gray-800 text-white',
    gold: 'bg-[#d4af37] text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  const classes = `
    inline-flex items-center font-bold uppercase tracking-wider
    ${variants[variant] || variants.default}
    ${sizes[size] || sizes.md}
    ${rounded ? 'rounded-full' : 'rounded-lg'}
    ${className}
  `;

  return (
    <span ref={ref} className={classes} {...props}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';