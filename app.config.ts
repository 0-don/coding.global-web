import { defineConfig } from "@solidjs/start/config";
// import tailwindcss from "@tailwindcss/vite";
import { solidStartSiteMapPlugin } from "solid-start-sitemap";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  ssr: true,
  middleware: "./src/server/middleware.ts",
  vite: {
    plugins: [
      // checker({
      //   typescript: {
      //     tsconfigPath: "./tsconfig.json",
      //     buildMode: true,

      //   },
      // }),
      tsconfigPaths(),
      // tailwindcss(),
      solidStartSiteMapPlugin({
        hostname: process.env.VITE_HOST_URL,
        replaceRouteParams: {
          ":locale?": ["de", "en"],
        },
      }),
    ],
  },
});
