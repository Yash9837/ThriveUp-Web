import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure proper webpack configuration for Vercel
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Optimize for Vercel deployment
  experimental: {
    // Disable features that might cause issues
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Optimize client components
    optimizePackageImports: ['lucide-react'],
    // Ensure proper client reference handling
    clientRouterFilter: true,
    // Disable problematic features
    serverComponentsExternalPackages: [],
  },
  // Ensure proper static generation
  trailingSlash: false,
  poweredByHeader: false,
  // Ensure proper client reference handling
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Force proper build output
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
