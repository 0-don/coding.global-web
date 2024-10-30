import { defineConfig } from "@solidjs/start/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  ssr: true,
  middleware: "./src/server/middleware.ts",
  server: {
    preset: "bun",
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  vite: {
    ssr: { external: ["drizzle-orm"] },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  },
});
