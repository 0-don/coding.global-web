import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: process.env.STANDALONE ? "standalone" : undefined,
  // trailingSlash: true,

  staticPageGenerationTimeout: 300, // 3 minutes for sitemap generation

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [10, 25, 50, 75, 90, 100],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [{ hostname: "*.discordapp.com" }],
  },
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: ["./public/i18n/de.json"],
  },
});

export default withNextIntl(nextConfig);
