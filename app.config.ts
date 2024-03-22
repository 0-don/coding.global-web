import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: process.env.BUN ? { preset: "bun" } : undefined,
});
