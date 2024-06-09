import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: process.env.BUN ? true : false,
  server: {
    preset: process.env.BUN ? "bun" : undefined,
    rollupConfig: {
      external: ["@auth/core", "@panva/hkdf"],
    },
    externals: {
      external: ["@auth/core", "@panva/hkdf"],
    },
  },
  vite: {
    ssr: { external: ["@tanstack/solid-query", "@auth/core", "@panva/hkdf"] },
    optimizeDeps: {
      include: ["@panva/hkdf"],
    },
  },
});
