import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: process.env.BUN ? true : false,
  solid: {
    babel: {},
  },
  server: {
    preset: process.env.BUN ? "bun" : undefined,

    esbuild: {
      options: {},
    },
    externals: {
      external: ["@auth/core", "@panva/hkdf"],
    },
  },
  vite: {
    ssr: { external: ["@tanstack/solid-query"] },
    optimizeDeps: {
      include: ["@panva/hkdf"],
    },
  },
});
