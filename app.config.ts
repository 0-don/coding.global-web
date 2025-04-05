import { defineConfig } from "@solidjs/start/config";
import { resolve } from "node:path";
import { solidStartSiteMapPlugin } from "solid-start-sitemap";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  ssr: true,
  middleware: "./src/server/middleware.ts",
  vite: {
    resolve: {
      alias: { "@": resolve("./src") },
    },
    plugins: [
      tailwindcss(),
      solidStartSiteMapPlugin({
        hostname: process.env.VITE_HOST_URL,
        replaceRouteParams: {
          ":locale?": ["de", "en"],
        },
      }),
    ],
  },
});
