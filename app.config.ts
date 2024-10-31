import { authVite } from "@solid-mediakit/auth-plugin";
import { defineConfig } from "@solidjs/start/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      alias: {
        "@": resolve(__dirname, "./src"),
      },
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
    ],
  },
});
