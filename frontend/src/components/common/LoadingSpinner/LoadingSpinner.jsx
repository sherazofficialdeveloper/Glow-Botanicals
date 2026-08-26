// components/common/LoadingSpinner/LoadingSpinner.jsx
'use client';

export const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  fullScreen = false,
  text = '',
}) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const colors = {
    primary: 'border-[#d9006c] border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 border-t-transparent',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizes[size] || sizes.md} ${colors[color] || colors.primary} rounded-full animate-spin`}
      />
      {text && <p className="mt-3 text-sm text-gray-500">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Skeleton Loader for content
export const SkeletonLoader = ({ count = 1, className = '' }) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-16 w-full" />
      ))}
    </div>
  );
};