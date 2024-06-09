import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: process.env.BUN ? true : false,
  server: {
    preset: "bun",
    rollupConfig: {
      external: ["@panva/hkdf", "@auth/core"],
    },
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  vite: {
    ssr: { external: ["@tanstack/solid-query"] },
  },
});
