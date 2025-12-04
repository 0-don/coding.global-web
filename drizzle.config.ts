import "@dotenvx/dotenvx/config";
import { defineConfig } from "drizzle-kit";

console.log(process.env.BETTER_AUTH_URL)

export default defineConfig({
  out: "./drizzle",
  schema: "./src/lib/db/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
