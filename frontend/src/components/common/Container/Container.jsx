// components/common/Container/Container.jsx
'use client';

import { forwardRef } from 'react';

export const Container = forwardRef(({
  children,
  className = '',
  maxWidth = 'xl',
  padding = true,
  as: Component = 'div',
  ...props
}, ref) => {
  const maxWidths = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const classes = `
    mx-auto w-full
    ${maxWidths[maxWidth] || maxWidths.xl}
    ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
    ${className}
  `;

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  );
});

Container.displayName = 'Container';

// Grid Component
export const Grid = ({ children, cols = 3, gap = 6, className = '' }) => {
  const colsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  const gaps = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
  };

  return (
    <div className={`grid ${colsMap[cols] || colsMap[3]} ${gaps[gap] || gaps[6]} ${className}`}>
      {children}
    </div>
  );
};