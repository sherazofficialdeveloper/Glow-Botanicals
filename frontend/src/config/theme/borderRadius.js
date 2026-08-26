// config/theme/borderRadius.js

export const borderRadius = {
  none: '0',
  xs: '0.125rem',    // 2px
  sm: '0.25rem',     // 4px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.5rem',   // 24px
  '3xl': '2rem',     // 32px
  '4xl': '2.5rem',   // 40px
  full: '9999px',
};

export const borderRadiusMap = {
  // Button sizes
  button: {
    sm: borderRadius.lg,
    md: borderRadius.xl,
    lg: borderRadius['2xl'],
  },
  // Card sizes
  card: {
    sm: borderRadius.lg,
    md: borderRadius.xl,
    lg: borderRadius['2xl'],
  },
  // Input sizes
  input: {
    sm: borderRadius.md,
    md: borderRadius.lg,
    lg: borderRadius.xl,
  },
};

export default borderRadius;