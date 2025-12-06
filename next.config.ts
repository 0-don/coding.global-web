import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.STANDALONE ? "standalone" : undefined,
  images: {
    qualities: [75, 100],
  },
};

export default nextConfig;
