import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3002/:path*', // Proxy to backend to avoid CORS
      },
    ];
  },
};

export default nextConfig;
