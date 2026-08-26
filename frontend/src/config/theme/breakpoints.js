// config/theme/breakpoints.js

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const breakpointsArray = [
  { name: 'xs', min: '0px', max: '639px' },
  { name: 'sm', min: '640px', max: '767px' },
  { name: 'md', min: '768px', max: '1023px' },
  { name: 'lg', min: '1024px', max: '1279px' },
  { name: 'xl', min: '1280px', max: '1535px' },
  { name: '2xl', min: '1536px', max: '∞' },
];

export const mediaQueries = {
  sm: '@media (min-width: 640px)',
  md: '@media (min-width: 768px)',
  lg: '@media (min-width: 1024px)',
  xl: '@media (min-width: 1280px)',
  '2xl': '@media (min-width: 1536px)',
};

export default breakpoints;