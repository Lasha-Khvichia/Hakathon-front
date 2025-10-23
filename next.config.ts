import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Use environment variable for backend API URL
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3002';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`, // /api/category -> http://localhost:3002/category
      },
    ];
  },
};

export default nextConfig;
