import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/routes/api/schema.ts",
  out: "./db.migrations",
  dbCredentials: { url: process.env.DATABASE_URL },
  // Print all statements
  verbose: false,
  // Always ask for confirmation
  strict: false,
});
