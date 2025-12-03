// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9090/:path*',
      },
    ];
  },
};

export default nextConfig;
