import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  // trailingSlash: true,

  images: {
    qualities: [10, 25, 50, 75, 90, 100],
  },
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: ["./public/i18n/en.json"],
  },
});

export default withNextIntl(nextConfig);
