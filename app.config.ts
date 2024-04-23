import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: process.env.BUN ? true : false,
  server: process.env.BUN ? { preset: "bun" } : undefined,
  vite: {
    ssr: { external: ["@tanstack/solid-query"] },
  },
});
