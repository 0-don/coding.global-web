import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  // ssr: false,
  server: process.env.BUN ? { preset: "bun" } : undefined,
});
