import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL)
  throw new Error("DATABASE_URL environment variable is not set!");

export default {
  driver: "pg",
  schema: "./src/routes/api/schema.ts",
  out: "./db.migrations",
  dbCredentials: { connectionString: process.env.DATABASE_URL },
  // Print all statements
  verbose: false,
  // Always ask for confirmation
  strict: false,
} satisfies Config;
