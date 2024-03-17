import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  // ssr: false,
  devOverlay: true,
  vite: (options) => ({
    build: {
      sourcemap: true,
    },
  }),
  server: {
    sourceMap: true,
  },
});
