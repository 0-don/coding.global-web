import { defineConfig } from "@solidjs/start/config";

console.log("process.env.BUN", process.env.BUN);

export default defineConfig({
  // server: process.env.BUN ? { preset: "bun" } : undefined,
});
