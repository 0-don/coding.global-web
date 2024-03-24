import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: process.env.BUN ? { preset: "bun" } : undefined,
  // vite({ router }) {
  //   if (router === "client") {
  //     return {
  //       server: {
  //         hmr: {
  //           port: 4000,
  //         },
  //         watch: {
  //           usePolling: true,
  //         },
  //       },
  //     };
  //   }
  //   return {
  //     server: {
  //       watch: {
  //         usePolling: true,
  //       },
  //     },
  //   };
  // },
});
