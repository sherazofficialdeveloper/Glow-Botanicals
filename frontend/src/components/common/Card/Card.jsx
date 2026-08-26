// components/common/Card/Card.jsx
'use client';

import { forwardRef } from 'react';

export const Card = forwardRef(({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hoverable = false,
  onClick,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-white border border-gray-100',
    primary: 'bg-rose-50 border border-rose-100',
    secondary: 'bg-gray-50 border border-gray-200',
    success: 'bg-emerald-50 border border-emerald-100',
    danger: 'bg-red-50 border border-red-100',
    warning: 'bg-amber-50 border border-amber-100',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const classes = `
    rounded-xl shadow-sm
    ${variants[variant] || variants.default}
    ${paddings[padding] || paddings.md}
    ${hoverable ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div
      ref={ref}
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Sub-components
export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold text-gray-900 ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>{children}</div>
);