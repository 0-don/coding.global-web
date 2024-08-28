// app.config.ts
import { defineConfig } from "@solidjs/start/config";
var app_config_default = defineConfig({
  ssr: false,
  server: {
    // preset: "bun",
    // esbuild: {
    //   options: {
    //     target: "esnext",
    //   },
    // },
  },
  vite: {
    ssr: { external: ["@tanstack/solid-query"] }
  }
});
export {
  app_config_default as default
};
