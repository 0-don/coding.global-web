import { defineConfig } from "orval";

export default defineConfig({
  app: {
    input: {
      // target: "https://bot.coding.global/api/openapi/json",
      target: "http://localhost:4000/api/openapi/json",
    },
    output: {
      target: "./src/openapi.ts",
      client: "fetch",
      override: {
        mutator: {
          path: "./src/lib/custom-fetch.ts",
          name: "customFetch",
        },
      },
    },
    hooks: { afterAllFilesWrite: "prettier --write" },
  },
});
