import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: process.env.STANDALONE ? "standalone" : undefined,
  // trailingSlash: true,

  images: {
    qualities: [90, 75, 50, 25, 10],
  },
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: ["./public/i18n/en.json"],
  },
});

export default withNextIntl(nextConfig);
