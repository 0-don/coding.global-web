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
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: ["./public/i18n/de.json"],
  },
});

const configWithNextIntl = withNextIntl(nextConfig);

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
