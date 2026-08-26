// config/theme/animations.js

export const animations = {
  // Duration
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Easing
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.16, 1, 0.3, 1)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  // Keyframes
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    slideUp: {
      '0%': { transform: 'translateY(10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideDown: {
      '0%': { transform: 'translateY(-10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideIn: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(0)' },
    },
    slideOut: {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(100%)' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    scaleOut: {
      '0%': { transform: 'scale(1)', opacity: '1' },
      '100%': { transform: 'scale(0.95)', opacity: '0' },
    },
    spin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    marquee: {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(-50%)' },
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
    bounce: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    shimmer: {
      '0%': { backgroundPosition: '-200% center' },
      '100%': { backgroundPosition: '200% center' },
    },
    glow: {
      '0%, 100%': { boxShadow: '0 0 15px rgba(217, 0, 108, 0.25)' },
      '50%': { boxShadow: '0 0 30px rgba(217, 0, 108, 0.5)' },
    },
    float: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-8px)' },
    },
  },
};

export const animationClasses = {
  'animate-fadeIn': `fadeIn ${animations.duration.normal} ${animations.easing.out}`,
  'animate-fadeOut': `fadeOut ${animations.duration.normal} ${animations.easing.in}`,
  'animate-slideUp': `slideUp ${animations.duration.normal} ${animations.easing.out}`,
  'animate-slideDown': `slideDown ${animations.duration.normal} ${animations.easing.out}`,
  'animate-slideIn': `slideIn ${animations.duration.normal} ${animations.easing.out}`,
  'animate-slideOut': `slideOut ${animations.duration.normal} ${animations.easing.in}`,
  'animate-scaleIn': `scaleIn ${animations.duration.normal} ${animations.easing.out}`,
  'animate-scaleOut': `scaleOut ${animations.duration.normal} ${animations.easing.in}`,
  'animate-spin': `spin 1s ${animations.easing.linear} infinite`,
  'animate-marquee': `marquee 28s ${animations.easing.linear} infinite`,
  'animate-pulse': `pulse 2s ${animations.easing.inOut} infinite`,
  'animate-bounce': `bounce 1s ${animations.easing.bounce} infinite`,
  'animate-shimmer': `shimmer 2s ${animations.easing.linear} infinite`,
  'animate-glow': `glow 3s ${animations.easing.inOut} infinite`,
  'animate-float': `float 3s ${animations.easing.inOut} infinite`,
};

export default animations;