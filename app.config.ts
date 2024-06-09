import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: process.env.BUN ? true : false,
  server: {
    preset: process.env.BUN ? "bun" : undefined,
    rollupConfig: {
      external: ["@panva/hkdf"],
    },
  },
  vite: {
    ssr: { external: ["@tanstack/solid-query"] },
  },
});
