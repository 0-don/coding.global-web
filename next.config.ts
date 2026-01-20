import { withPostHogConfig } from "@posthog/nextjs-config";
import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const nextConfig: NextConfig = {
  output: process.env.STANDALONE ? "standalone" : undefined,
  skipTrailingSlashRedirect: true,

  staticPageGenerationTimeout: 300, // 3 minutes for sitemap generation

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [10, 25, 50, 75, 90, 100],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [{ hostname: "*.discordapp.com" }],
  },

  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: ["./public/i18n/de.json"],
  },
});

const configWithNextIntl = withNextIntl(nextConfig);

console.log(
  "posthog log",
  !!process.env.POSTHOG_API_KEY,
  !!process.env.POSTHOG_ENV_ID,
);

export default process.env.STANDALONE
  ? withPostHogConfig(configWithNextIntl, {
      personalApiKey: process.env.POSTHOG_API_KEY,
      envId: process.env.POSTHOG_ENV_ID,
      host: "https://eu.posthog.com",
      sourcemaps: {
        enabled: true,
        project: process.env.NEXT_PUBLIC_APP_NAME,
        version: "1.0.0",
        deleteAfterUpload: true,
      },
    })
  : configWithNextIntl;
