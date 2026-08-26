// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Images Configuration
  images: {
    domains: [
      'localhost',
      'glowlybotanical.com',
      'api.glowlybotanical.com',
      'images.unsplash.com',
      'res.cloudinary.com',
      's3.amazonaws.com',
      's3.us-east-1.amazonaws.com',
      'via.placeholder.com',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Environment Variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/shop',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/store',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/old-blog/:path*',
        destination: '/blog/:path*',
        permanent: true,
      },
    ];
  },

  // Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Webpack Configuration
  webpack: (config, { isServer, dev }) => {
    // Add custom aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
      '@components': require('path').resolve(__dirname, './src/components'),
      '@hooks': require('path').resolve(__dirname, './src/hooks'),
      '@contexts': require('path').resolve(__dirname, './src/contexts'),
      '@services': require('path').resolve(__dirname, './src/services'),
      '@utils': require('path').resolve(__dirname, './src/utils'),
      '@config': require('path').resolve(__dirname, './src/config'),
      '@types': require('path').resolve(__dirname, './src/types'),
      '@styles': require('path').resolve(__dirname, './src/styles'),
      '@public': require('path').resolve(__dirname, './public'),
    };

    // Add SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Optimize bundle
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            commons: {
              test: /[\\/]src[\\/]components[\\/]common[\\/]/,
              name: 'commons',
              chunks: 'all',
            },
          },
        },
      };
    }

    return config;
  },

  // Experimental Features
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
  },

  // Compiler Options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Powered By Header
  poweredByHeader: false,

  // Generate Build ID
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

module.exports = nextConfig;