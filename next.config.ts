import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Docker/server deployment, comment out 'output: export'
  // output: 'export',
  
  // Enable standalone output for Docker
  output: 'standalone',
  
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Remove assetPrefix for server deployment
  // assetPrefix: './',
  basePath: '',
  
  // Optional: Enable experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: []
  }
};

export default nextConfig;
