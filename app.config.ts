import { authVite } from "@solid-mediakit/auth-plugin";
import { defineConfig } from "@solidjs/start/config";
import { resolve } from "node:path";
import { solidStartSiteMapPlugin } from "solid-start-sitemap";

export default defineConfig({
  ssr: true,
  middleware: "./src/server/middleware.ts",
  server: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  vite: {
    resolve: {
      alias: { "@": resolve("./src") },
    },
    plugins: [
      authVite({
        redirectTo: "/",
        log: true,
        authOpts: {
          name: "authOptions",
          dir: "~/server/auth-options",
        },
      }),
      solidStartSiteMapPlugin({
        hostname: process.env.VITE_HOST_URL,
        replaceRouteParams: {
          ":locale?": ["de", "en"],
        },
      }),
    ],
  },
});
