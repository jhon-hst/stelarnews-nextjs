import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-c38d6e22cb9247ea8a87cbcb25f85c9a.r2.dev',
        pathname: '/**',
      },
    ]
  }
};

export default nextConfig;
