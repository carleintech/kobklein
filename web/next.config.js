const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Disable webpack build worker to avoid pnpm issues
    webpackBuildWorker: false
  },
  
  // Disable ESLint during builds to avoid deployment failures
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Image optimization settings
  images: {
    domains: ['kobklein.com', 'assets.kobklein.com'],
    formats: ['image/webp', 'image/avif']
  },

  // Fix npm workspace conflicts in pnpm environment
  transpilePackages: [],
  
  // Disable webpack cache issues in development
  webpack: (config, { dev, isServer }) => {
    // Fix for pnpm workspaces - disable symlinks
    config.resolve.symlinks = false;
    
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
      
      // Disable webpack cache in development to avoid vendor chunk issues
      config.cache = false;
    }
    
    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options', 
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Suppress hydration warnings in development
  reactStrictMode: true,
  
  // Optimize for development
  swcMinify: true,
  
  // Handle static file serving
  trailingSlash: false
};

module.exports = withNextIntl(nextConfig);
