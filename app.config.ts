import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: false,
  server: {
    // preset: "bun",
    // esbuild: {
    //   options: {
    //     target: "esnext",
    //   },
    // },
  },
  // vite: {
  //   ssr: { external: ["@tanstack/solid-query"] },
  // },
});
