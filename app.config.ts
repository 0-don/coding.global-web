import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { solidStartSiteMapPlugin } from "solid-start-sitemap";
import checker from "vite-plugin-checker";

export default defineConfig({
  ssr: true,
  middleware: "./src/server/middleware.ts",
  vite: {
    resolve: {
      alias: { "@": resolve("./src") },
    },
    plugins: [
      // checker({
      //   typescript: {
      //     tsconfigPath: "./tsconfig.json",
      //     buildMode: true,
          
      //   },
      // }),
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
