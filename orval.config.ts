import { defineConfig } from "orval";

export default defineConfig({
  app: {
    input: {
      target: "https://bot.coding.global/swagger/json",
      validation: false,
    },
    output: {
      target: "./src/lib/openapi.ts",
      client: "fetch",
      baseUrl: "${getBaseUrl()}",
      override: { header: () => `import { getBaseUrl } from '../utils/base';` },
    },
    hooks: { afterAllFilesWrite: "prettier --write" },
  },
});
