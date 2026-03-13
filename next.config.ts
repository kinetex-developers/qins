import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Required for Netlify image optimization
  images: {
    unoptimized: true,
  },

  // Avoid standalone output which may conflict with Netlify
  output: undefined,
};

export default nextConfig;